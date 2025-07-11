import Settings from "../../config"
import terminalUtils from "../utils/terminalUtils";
import { rightClick, S2DPacketOpenWindow, S32PacketConfirmTransaction } from "../utils/utils";

let lastClick

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

register("tick", (event) => {
    if (!Settings().TerminalTriggerbot) return;
    if (terminalUtils.isInTerm()) return;
    if (lastClick > 0) return;
    if (Player?.getContainer()?.getName() !== "container") return;


    if (Player.lookingAt()?.getName()?.removeFormatting() === "Inactive Terminal") {
        rightClick()
        lastClick = 20;
    } 
    
})


