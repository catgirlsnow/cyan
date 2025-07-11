import { calcYawPitch, snapTo, S22PacketMultiBlockChange, S23PacketBlockChange, Prefix, MCBlock, getBowShootSpeed, rightClick, getNameByClass, removeUnicode } from "../utils/utils";
import Settings from "../../config";
import leapUtils from "../utils/leapUtils";
import serverRotations from "../utils/serverRotations";


const DevBlocks = [[68, 130, 50], [66, 130, 50], [64, 130, 50], [68, 128, 50], [66, 128, 50], [64, 128, 50], [68, 126, 50], [66, 126, 50], [64, 126, 50]];

const offsetMap = {
    68: -0.7,
    66: -0.5,
    64: 1.5
};



const isNearPlate = () => Player.getY() == 127 && Player.getX() >= 62 && Player.getX() <= 65 && Player.getZ() >= 34 && Player.getZ() <= 37;
const platePos = [63, 127, 35];

const isFourPlateDown = () => {
    const block = World.getBlockAt(...platePos);
    if (block.type.getID() !== 147) return false;
    const state = block.getState();
    return block.type.mcBlock.func_176201_c(state) > 0;
};

let emeraldUpdated = false;
let currentEmerald;
let shotAt = [];
let tempShot = [];
let prefires = 0;
let lastShot = 0;

register("packetReceived", (packet, event) => {
    const position = packet.func_179827_b();
    const positionXYZ = [position.func_177958_n(), position.func_177956_o(), position.func_177952_p()];
    const blockState = packet.func_180728_a();
    const block = blockState.func_177230_c();

    const index = DevBlocks.findIndex(xyz => {
        return positionXYZ.every((coord, index) => coord === xyz[index]);
    });
    
    if (index === -1) return;
    
    const blockID = MCBlock.func_149682_b(block);
    if (blockID !== 133) return;
    
    currentEmerald = positionXYZ;
    emeraldUpdated = true;

}).setFilteredClass(S23PacketBlockChange);

register("packetReceived", (packet, event) => {
    const updatedBlocks = packet.func_179844_a();
    const foundBlock = updatedBlocks.find(updatedBlock => {
        const blockState = updatedBlock.func_180088_c();
        const block = blockState.func_177230_c();
        const blockID = MCBlock.func_149682_b(block);
        return blockID === 133;
    });

    if (!foundBlock) return;
    
    const position = foundBlock.func_180090_a();
    const positionXYZ = [position.func_177958_n(), position.func_177956_o(), position.func_177952_p()];
    currentEmerald = positionXYZ; 
    emeraldUpdated = true;

}).setFilteredClass(S22PacketMultiBlockChange);

function aimCoords(coords) {
    let xoffset = offsetMap[coords[0]] || 0.5;

    const item = Player.getHeldItem();
    const itemId = item?.getNBT()?.get("tag")?.get("ExtraAttributes")?.getString("id");
    if (itemId !== "TERMINATOR") xoffset = 0.5;

    return [coords[0] + xoffset, coords[1] + 1.1, coords[2]];
}

function getShootCoord() {
    if (emeraldUpdated && currentEmerald) {
        tempShot = [];
        prefires = 0;
        emeraldUpdated = false;
        shotAt.push(currentEmerald);
        return aimCoords(currentEmerald);
    }

    if (!Settings().AutoPrefire || prefires > 1) return;

    const prepossiblePrefire = DevBlocks.filter(block => !shotAt.some(b => b.every((coord, index) => coord === block[index])));
    const possiblePrefire = prepossiblePrefire.filter(block => !tempShot.some(b => b.every((coord, index) => coord === block[index])));

    if (possiblePrefire.length === 0) return;

    const randomIndex = Math.floor(Math.random() * possiblePrefire.length);
    const randomPrefire = possiblePrefire[randomIndex];
    tempShot.push(randomPrefire);
    return aimCoords(randomPrefire);
}

register("tick", () => {
    if (!Settings().AutoArrow || !isNearPlate() || Player.getHeldItem()?.getID() !== 261) return;
    if (Date.now() - lastShot < (getBowShootSpeed()) + 20) return;
    if (!isFourPlateDown()) {
        shotAt = [];
        return;
    }

    const currentTarget = getShootCoord();
    if (!currentTarget) return;

    const [yaw, pitch] = calcYawPitch({ x: currentTarget[0], y: currentTarget[1], z: currentTarget[2] });

    serverRotations.setRotation(yaw, pitch, () => {
        rightClick()
        Client.scheduleTask(0, () => {
            serverRotations.resetRotation()
        })
    })

    lastShot = Date.now();
    prefires++;
});

let hasMelody = false
let melodyIGN = ""

register("chat", (player, a, event) => {
    if (!Settings().Pre4ToggleLeap) return;
    if (!isNearPlate()) return;
    
    const rawMessage = ChatLib.getChatMessage(event);
    if (!rawMessage) return;
    
    const message = rawMessage.removeFormatting();
    if (message.includes("1/4") || message.includes("25%")) {
        hasMelody = true;
        melodyIGN = removeUnicode(player).trim();
    }

}).setCriteria(/\bParty\b .* (\w+): (.*)/)

register("worldLoad", () => {
    hasMelody = false
    melodyIGN = ""
})

register("chat", (player, message) => {
    if (!Settings().Pre4ToggleLeap) return;
    if (player !== Player.getName()) return;
    if (!isNearPlate()) return;

    let Pre4IGNLeap = Settings().Pre4IGNLeap; 
    let leapClass = getNameByClass(Pre4IGNLeap);
    let leapString = (leapClass === -1 || leapClass === "EMPTY") ? Pre4IGNLeap : leapClass; 

    if (hasMelody && Settings().Pre4LeapMelody) {
        leapString = melodyIGN
        hasMelody = false
        melodyIGN = ""
    }

    ChatLib.chat(Prefix + "&aDevice Complete");
    leapUtils.autoLeap(leapString);
}).setCriteria(/(\w+) completed a device! \((.*?)\)/);