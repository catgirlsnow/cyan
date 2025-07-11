import { EntityArmorStand, S2DPacketOpenWindow, S32PacketConfirmTransaction, getViewDistance3D, sendUseEntity } from "../utils/utils"
import Terminal from "../utils/terminalUtils"
import Settings from "../../config"

let lastClick = 0

register("packetReceived", (packet, event) => {
    const title = packet.func_179840_c().func_150254_d().removeFormatting()
    if (title === "Click the button on time!") lastClick = 0
}).setFilteredClass(S2DPacketOpenWindow)

register("chat", () => {
    lastClick = 0
}).setCriteria("This Terminal doesn't seem to be responsive at the moment.")

register("packetReceived", (packet, event) => {
    if (lastClick === 0) return;
    lastClick--

}).setFilteredClass(S32PacketConfirmTransaction)

register("tick", () => {
    if (!Settings().TerminalAura) return;
    if (Terminal.isInTerm()) return;
    if (lastClick > 0) return;
    if (Player?.getContainer()?.getName() !== "container") return;
    let entities = World.getAllEntitiesOfType(EntityArmorStand);
    for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        if (entity.getName().removeFormatting() !== "Inactive Terminal") continue;
        
        let distance = getViewDistance3D(entity.getX(), entity.getY(), entity.getZ());

        
        if (distance > 4) continue;
        
        sendUseEntity(entity);
        lastClick = 20;
    }
    

})

