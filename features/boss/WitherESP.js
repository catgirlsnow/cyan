import Settings from "../../config";
import {S0FPacketSpawnMob, S13PacketDestroyEntity, convertFixedPoint, entityWither} from "../utils/utils"

const RenderUtils = Java.type("me.odinmain.utils.render.RenderUtils");
const ColorUtils = Java.type("me.odinmain.utils.render.Color");
const AxisAlignedBB = Java.type("net.minecraft.util.AxisAlignedBB");
const javaColor = Java.type("java.awt.Color")

let withers = [];

register("worldLoad", () => {
    withers = [];
    WitherESP.unregister()
});

register("packetReceived", (packet, event) => {
    if (!Settings().witherESP) return;
    if (packet.func_149025_e() !== 64) return;

    const entityID = packet.func_149024_d();

    Client.scheduleTask(1, () => {
        let mcEntity = World.getWorld().func_73045_a(entityID);
        let ctEntity = new Entity(mcEntity);

        if (ctEntity.isInvisible() || ctEntity.entity.func_82212_n() == 800) return;
        withers.push(ctEntity);
        WitherESP.register();
    });

}).setFilteredClass(S0FPacketSpawnMob);

register('packetReceived', (packet, event) => {
    if (!Settings().witherESP) return;
    for (let entityIDPacket of packet.func_149098_c()) { 
        if (World.getWorld().func_73045_a(entityIDPacket) == null) continue;

        let entityID = new Entity(World.getWorld().func_73045_a(entityIDPacket)).getEntity(); 

        withers = withers.filter(wither => wither.getEntity() !== entityID);
    }


    if (withers.length) return; 
    WitherESP.unregister();

}).setFilteredClass(S13PacketDestroyEntity);



const WitherESP = register("renderWorld", () => {
    let w = 3.2;
    let h = 3.5;

    for (let wither of withers) {
        if (!wither) continue
        
        let x = wither.getRenderX();
        let y = wither.getRenderY();
        let z = wither.getRenderZ();

        let [r, g, b] = [255, 0, 0]; 
        let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2);

        RenderUtils.INSTANCE.drawOutlinedAABB(newBox, new ColorUtils(javaColor.RGBtoHSB(r, g, b, null), 255 * 255), 3, false, true);
        RenderUtils.INSTANCE.drawFilledAABB(newBox, new ColorUtils(javaColor.RGBtoHSB(r, g, b, null), 255 * 255 * 0.2), false);
    }
}).unregister();




// maxor spawns at 73 226 53
// storm spawns at 103 188 53
// goldor spawns at 80 119 40
// necron spawns at 54 66 76