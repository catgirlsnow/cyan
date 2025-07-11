import Settings from "../../config";
import { InDungeon, MCBlockPos, MovingObjectPosition, Vec3, C08PacketPlayerBlockPlacement, C0APacketAnimation, EnumFacing, checkValidName } from "../utils/utils";
export const C05PacketPlayerLook = Java.type("net.minecraft.network.play.client.C03PacketPlayer$C05PacketPlayerLook")

const directionDict = {
    "down": 0,
    "up": 1,
    "north": 2,
    "south": 3,
    "west": 4,
    "east": 5
}

let lastClick = 0
let recentClick = []

let auraLevers = [
    [106, 124, 113, 5.7], [94, 124, 113, 5.7], [23, 132, 138, 5.7], 
    [27, 124, 127, 5.7], [2, 122, 55, 5.7], [14, 122, 55, 5.7], 
    [84, 121, 34, 5.7], [86, 128, 46, 5.7], [62, 133, 142, 5.7], 
    [62, 136, 142, 5.7], [60, 135, 142, 5.7], [60, 134, 142, 5.7], 
    [58, 136, 142, 5.7], [58, 133, 142, 5.7]
];


function getClosestAura() {
    const x = Player.getX();
    const y = Player.getY();
    const z = Player.getZ();

    return auraLevers.sort((a, b) => {
        const distA = getDistance(x, y, z, a[0], a[1], a[2]);
        const distB = getDistance(x, y, z, b[0], b[1], b[2]);
        return distA - distB;
    });
}

function isRecentClick(xyz) {
    return recentClick.some(coord => coord.every((val, i) => val === xyz[i]));
}

function removeRecentClick(xyz) {
    recentClick = recentClick.filter(coord => !coord.every((val, i) => val === xyz[i]));
}

function getDistance(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
}

function getEyePos() {
    return {x:Player.getX(), y:Player.getY()+Player.getPlayer().func_70047_e(), z:Player.getZ()}
}

let started = false



register("tick", () => {
    if (!Settings().LeverAura || !InDungeon() || Date.now() - lastClick < 80) return;

    const AuraBlocks = getClosestAura()
    if (!AuraBlocks || AuraBlocks.length === 0) return;

    const CanAura = AuraBlocks.filter(xyz => !isRecentClick(xyz));
    const target = CanAura[0];
    if (!target) return;

    const currentEyePos = getEyePos()

    if (getDistance(currentEyePos.x, currentEyePos.y, currentEyePos.z, target[0], target[1], target[2]) > target[3]) return;

    const mop = getRandomSide(target[0], target[1], target[2]);
    if (!mop) return;

    const side = mop.field_178784_b;
    const hitvec = mop.field_72307_f;
    if (!side || !hitvec) return;

    const direction = directionDict[side];
    if (!direction) return;

    const xOffset = hitvec.field_72450_a - target[0];
    const yOffset = hitvec.field_72448_b - target[1];
    const zOffset = hitvec.field_72449_c - target[2];
    if (!xOffset || !yOffset || !zOffset) return;

    Click(target[0], target[1], target[2], direction, xOffset, yOffset, zOffset);
    World.playSound("note.pling", 500, 1)
    World.playSound("note.pling", 500, 1)
    World.playSound("note.pling", 500, 1)
    World.playSound("note.pling", 500, 1)

    lastClick = Date.now();
    recentClick.push(target);
    Client.scheduleTask(300, () => {
        removeRecentClick(target);
    });
})



function Click(x, y, z, direction, xOffset, yOffset, zOffset) {
    let heldItem = Player.getHeldItem()?.getItemStack() || null;

    Client.sendPacket(new C08PacketPlayerBlockPlacement(new MCBlockPos(x, y, z), direction, heldItem, xOffset, yOffset, zOffset))
	if (!Player.isSneaking()) Client.sendPacket(new C0APacketAnimation());
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}




function getRandomSide(x, y, z) {
    x = parseInt(x)
    y = parseInt(y)
    z = parseInt(z)

    const blockPos = new MCBlockPos(x, y, z)
    const state = World.getWorld().func_180495_p(blockPos)
    const block = state.func_177230_c()

    const playerVec = Player.getPlayer().func_174824_e(1.0)
    const playerX = playerVec.field_72450_a
    const playerY = playerVec.field_72448_b
    const playerZ = playerVec.field_72449_c

    block.func_180654_a(World.getWorld(), blockPos)

    const minX = block.func_149704_x()
    const minY = block.func_149665_z()
    const minZ = block.func_149706_B()

    const maxX = block.func_149753_y()
    const maxY = block.func_149669_A()
    const maxZ = block.func_149693_C()

    let projections = []

    for (let i = 0; i < 10; i++) {
        if (x >= playerX) {
            projections.push(new MovingObjectPosition(
                MovingObjectPosition.MovingObjectType.BLOCK, 
                new Vec3(x + minX, randomNumber(y + minY, y + maxY), randomNumber(z + minZ, z + maxZ)), 
                EnumFacing.WEST, 
                blockPos
            ));
        }

        if (x <= playerX) {
            projections.push(new MovingObjectPosition(
                MovingObjectPosition.MovingObjectType.BLOCK, 
                new Vec3(x + maxX, randomNumber(y + minY, y + maxY), randomNumber(z + minZ, z + maxZ)), 
                EnumFacing.EAST, 
                blockPos
            ));
        }

        if (z <= playerZ) {
            projections.push(new MovingObjectPosition(
                MovingObjectPosition.MovingObjectType.BLOCK, 
                new Vec3(randomNumber(x + minX, x + maxX), randomNumber(y + minY, y + maxY), z + maxZ), 
                EnumFacing.SOUTH, 
                blockPos
            ));
        }

        if (z >= playerZ) {
            projections.push(new MovingObjectPosition(
                MovingObjectPosition.MovingObjectType.BLOCK, 
                new Vec3(randomNumber(x + minX, x + maxX), randomNumber(y + minY, y + maxY), z + minZ), 
                EnumFacing.NORTH, 
                blockPos
            ));
        }

        if (y <= playerY) {
            projections.push(new MovingObjectPosition(
                MovingObjectPosition.MovingObjectType.BLOCK, 
                new Vec3(randomNumber(x + minX, x + maxX), y + maxY, randomNumber(z + minZ, z + maxZ)), 
                EnumFacing.UP, 
                blockPos
            ));
        }

        if (y >= playerY) {
            projections.push(new MovingObjectPosition(
                MovingObjectPosition.MovingObjectType.BLOCK, 
                new Vec3(randomNumber(x + minX, x + maxX), y + minY, randomNumber(z + minZ, z + maxZ)), 
                EnumFacing.DOWN, 
                blockPos
            ));
        }
    }

    if (projections.length > 0) {
        return projections[Math.floor(randomNumber(0, projections.length))];
    } else {
        return null; 
    }
    
}



register("chat", (message) => {

    recentClick = []


  }).setCriteria(/\[BOSS\] Goldor: Who dares trespass into my domain\?/)




