import { C09PacketHeldItemChange, Prefix, S09PacketHeldItemChange } from "../utils/utils";


let heldChangeFuncs = []

export const onHeldItemChange = (changeFunc) => {
    if (typeof completeFunc === "function") {
        heldChangeFuncs.push(changeFunc);
    }
};

function itemChange(slot) {
    const inv = Player?.getInventory()
    const itemStack = inv?.getStackInSlot(slot)
    for (let heldChangeFunc of heldChangeFuncs) {
        heldChangeFunc(itemStack)
    }
}

register("packetReceived", (packet, event) => {
    const slot = packet.func_149385_c()
    if (!slot) return;
    itemChange(slot)
}).setFilteredClass(S09PacketHeldItemChange)

register("packetSent", (packet, event) => {
    const slot = packet.func_149614_c()
    if (!slot) return;
    itemChange(slot)
}).setFilteredClass(C09PacketHeldItemChange)
