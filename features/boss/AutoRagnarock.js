import { getClass, getItemSlot, rightClick } from "../utils/utils"
import petHelper from "../utils/petUtils"
import Settings from "../../config"
let equipDrag

register("chat", () => {
    if (!Settings().AutoRag) return;
    const currentClass = getClass()
    if (currentClass !== "Archer" && currentClass !== "Berserk" && currentClass !== "Mage") return;


    let ragSlot = getItemSlot("Ragnarock")
    if (isNaN(ragSlot)) return;

    
    if (ragSlot > 8 || ragSlot < 0) return;
    
    Player.setHeldItemIndex(ragSlot)

    Client.scheduleTask(0, () => {
        rightClick()
    })

    petHelper.queuePet("golden", "remedies")
    if (currentClass !== "Mage") equipDrag = true

}).setCriteria("[BOSS] Wither King: I no longer wish to fight, but I know that will not stop you.")


register("actionBar", (message) => {
    if (!equipDrag) return;
    equipDrag = false

    petHelper.queuePet("ender", "plushie")
}).setChatCriteria(/.*\bCASTING\b$/);   