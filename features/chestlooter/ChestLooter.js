import { EntityArmorStand, getEntitySkullTexture, sendUseEntity } from "../../../BloomCore/utils/Utils"
import { chestData, DungeonChest, ChestItem } from "../../../Bloom/features/dungeonChestProfit/chestUtils"
import { getFloor, getFloorBoss, sendWindowClick } from "../utils/utils"
import Settings from "../../config";

const prefix = "";
const textures = ["eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWFlMzg1NWY5NTJjZDRhMDNjMTQ4YTk0NmUzZjgxMmE1OTU1YWQzNWNiY2I1MjYyN2VhNGFjZDQ3ZDMwODEifX19", "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNGFkMDQ3NmU4NjcxNjk2YWYzYTg5NDlhZmEyYTgxNGI5YmRkZTY1ZWNjZDFhOGI1OTNhZWVmZjVhMDMxOGQifX19", "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzdiOWRmZDI4MWRlYWVmMjYyOGFkNTg0MGQ0NWJjZGE0MzZkNjYyNjg0NzU4N2YzYWM3NjQ5OGE1MWM4NjEifX19", "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZTBlZDk0YmY1ZmNjZGQ5ZDNiN2NhN2ZhMzhlMmNlYjUwMTMzMmU2YjMzNTM0MDQyNzY1NjZiNTIxNmMxMzA0ZiJ9fX0K", "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODkzM2VlZmFiOGZjYjNmYTBmNDdiYjAzOTlhNTA4ZWY2YzkxMWRhZTRiMTE0NTU3ZjkwNjg5N2FlY2VkZjg1YSJ9fX0K", "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzRhYzY0NjMzMjQ5ZjEzZjFiMGM5NTI1YzZlZmE0NGNkZTk2YWJjZDY0N2UwOTVhMTcxZmUyNDRjMWEyNDRlNSJ9fX0K"]
let availableChests = []
let openedChests = []
let rerollThreshold
let secondChestThreshold
let rerollChestType
let Looting 
let rerolledChest
let chestName
let items = []
let profitChestOpened
let secondChestOpened
let shouldStart = false

let looterDebug = false

function getChestStr(chestName) {
    const chestMap = {
        "Wood": "&fWood",
        "Gold": "&6Gold",
        "Diamond": "&bDiamond",
        "Emerald": "&2Emerald",
        "Obsidian": "&5Obsidian",
        "Bedrock": "&8Bedrock"
    };

    return chestMap[chestName] || ""; 
}

function getChestVal(number) {
    const prefix = number < 0 ? "&c" : "&a"; 
    const absNumber = Math.abs(number); 
    const formattedNumber = absNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return prefix + formattedNumber;
}





function sortOpenedChestsByProfit() {
    openedChests.sort((a, b) => b[0].profit - a[0].profit); // add blooms blacklist/whitelist
}

const hasRunEnded = () => {
    const inventory = Player.getInventory()
    const lastSlot = inventory.getStackInSlot(8)

    return lastSlot && lastSlot.getName().removeFormatting() == "Your Score Summary"
}

function inChest(chestName) {
    let match = chestName.match(/^(\w+) Chest$/)
    if (!match) return false;
    return true;
}

register("packetReceived", (packet, event) => {
    if (!Looting) return;
    if (profitChestOpened) return;
	const itemStack = packet.func_149174_e();
    const slot = packet.func_149173_d();
    if (!(chestName in chestData)) return;
    if (slot === 31) {
        const item = new Item(itemStack);
        const chest = new DungeonChest(chestName)
        let lore = item.getLore()
        if (lore.length >= 7) {
            let match = lore[7].removeFormatting().match(/^([\d,]+) Coins$/)
            if (match) chest.cost = parseInt(match[1].replace(/,/g, ""))
        }
        chest.items = items.map(a => new ChestItem(a))
        chest.calcValueAndProfit()
        items = []
        const existingInd = openedChests.findIndex(a => a[0].name == chestName)
        if (existingInd !== -1) {
            ChatLib.chat(prefix + getChestStr(chest.name) + " Chest: " + getChestVal(chest.profit))
            openedChests.push([chest,openedChests.splice(existingInd, 1)[0][1]])
            return;
        }
        

        ChatLib.chat(prefix + getChestStr(chest.name) + " Chest: " + getChestVal(chest.profit))
        openedChests.push([chest])
        return;
    }
    
    if (slot < 9 || slot >= 18) return;
    if (itemStack == null) return;
    const item = new Item(itemStack);
    if (item.getID() === 160) return;
    items.push(item)
}).setFilteredClass(net.minecraft.network.play.server.S2FPacketSetSlot)

register("packetReceived", (packet, event) => {
    if (!Looting) return;
    if (profitChestOpened) return;
    const title = ChatLib.removeFormatting(packet.func_179840_c().func_150254_d());
    let match = title.match(/^(\w+) Chest$/)
    if (!match) {
        chestName = null
        return;
    }
    [_, chestName] = match
    if (!(chestName in chestData)) return;
}).setFilteredClass(net.minecraft.network.play.server.S2DPacketOpenWindow)


register("tick", () => {
    if (!Settings().ChestLooter) return;
    if (!hasRunEnded() || shouldStart) return;
    shouldStart = true
    
    let chestTextures = [...textures];
    openedChests = []
    availableChests = []
    items = []
    rerolledChest = false
    profitChestOpened = false
    secondChestOpened = false
    Looting = false
    chestName = null
    rerollThreshold = Settings().rerollThreshold && !isNaN(parseInt(Settings().rerollThreshold)) ? parseInt(Settings().rerollThreshold) : 1000000
    secondChestThreshold = Settings().ChestKeyThreshold && !isNaN(parseInt(Settings().ChestKeyThreshold)) ? parseInt(Settings().ChestKeyThreshold) : 150000

    if (getFloor === "M4") rerollChestType = "Obsidian";
    else rerollChestType = "Bedrock";

        const stands = World.getAllEntitiesOfType(EntityArmorStand)
        stands.forEach(stand => {
            skull = getEntitySkullTexture(stand)
            if (!skull) return;
            if (chestTextures.includes(skull)) {
                availableChests.push(stand)
                chestTextures.splice(chestTextures.indexOf(skull), 1)
            }
        })
        if (!availableChests.length) return;
        for (let index = 0; index < availableChests.length; index++) {
                sendUseEntity(availableChests[index])
                if (looterDebug) ChatLib.chat(availableChests[index].getX()+", "+availableChests[index].getY()+", "+availableChests[index].getZ());
                if (looterDebug) ChatLib.chat("sendUseEntity1");

        }
    Looting = true

})

register("packetReceived", (packet, event) => {
    if (!Looting) return;
    Client.scheduleTask(5, () => {
        if (rerolledChest || profitChestOpened) return;
        const title = ChatLib.removeFormatting(packet.func_179840_c().func_150254_d());
        let match = title.match(/^(\w+) Chest$/)
        if (!match) return;
        if (!(match[1] === openedChests[openedChests.length-1][0].name)) return;
        if (!(title === openedChests[openedChests.length-1][0].name+" Chest")) return;
        for (let index = 0; index < availableChests.length; index++) {
            openedChests[index][1] = availableChests[index]
        }
        if ((getFloor() === "F7" || getFloor() === "M7" || getFloor() === "M4" || getFloorBoss() === "f7") && Settings().useKismet && openedChests[openedChests.length-1][0].name === rerollChestType && openedChests[openedChests.length-1][0].profit < rerollThreshold) {
            const windowId = packet.func_148901_c(); 
            const title = ChatLib.removeFormatting(packet.func_179840_c().func_150254_d());
            sendWindowClick(windowId,50,0,0)
            if (looterDebug) ChatLib.chat("invclick1 "+title);
            

            rerolledChest = true
            sendUseEntity(openedChests[openedChests.length-1][1]) 
            if (looterDebug) ChatLib.chat("sendUseEntity2"+openedChests[openedChests.length-1][0].name);

        }
        else {
            sortOpenedChestsByProfit()
            if (looterDebug) ChatLib.chat("sort1 openedchestlength:"+openedChests.length+" "+openedChests[0][0].profit);
            sendUseEntity(openedChests[0][1])  
            if (looterDebug) ChatLib.chat("sendUseEntity3"+openedChests[0][0].name);

            profitChestOpened = true
        }
    })

    
}).setFilteredClass(net.minecraft.network.play.server.S2DPacketOpenWindow)

register("packetReceived", (packet, event) => {
    if (!Looting) return;
    Client.scheduleTask(1, () => {
        if (secondChestOpened) {
            if (!Looting) return;
            Looting = false;
            
            const windowId = packet.func_148901_c();
            const title = ChatLib.removeFormatting(packet.func_179840_c().func_150254_d());
            if (!(inChest(title))) return;

            sendWindowClick(windowId,31,0,0)
            if (looterDebug) ChatLib.chat("invclick2 "+title);

            ChatLib.chat(prefix + "&aOpened " + getChestStr(openedChests[1][0].name) + " Chest: " + getChestVal(openedChests[1][0].profit))
            return;
        }
        if (profitChestOpened) {
            if (secondChestOpened) return;
            secondChestOpened = true

            const windowId = packet.func_148901_c();
            const title = ChatLib.removeFormatting(packet.func_179840_c().func_150254_d());
            if (!(inChest(title))) return;

            sendWindowClick(windowId,31,0,0)
            if (looterDebug) ChatLib.chat("invclick3 "+title);

            ChatLib.chat(prefix + "&aOpened " + getChestStr(openedChests[0][0].name) + " Chest: " + getChestVal(openedChests[0][0].profit))

            if (openedChests[1][0].profit > secondChestThreshold && Settings().useChestKey) {
                sendUseEntity(openedChests[1][1])
                if (looterDebug) ChatLib.chat("sendUseEntity4"+openedChests[1][0].name); 
            }
            else Looting = false;
            return;
        }
        if (rerolledChest) {
            if (profitChestOpened) return;
            profitChestOpened = true
            sortOpenedChestsByProfit()
            if (looterDebug) ChatLib.chat("sort2 openedchestlength:"+openedChests.length+" "+openedChests[0][0].profit);
            sendUseEntity(openedChests[0][1])      
            if (looterDebug) ChatLib.chat("sendUseEntity5"+openedChests[0][0].name);
   
            return;
        }
    })
}).setFilteredClass(net.minecraft.network.play.server.S2DPacketOpenWindow)

register("worldUnload", () => {
    openedChests = []
    availableChests = []
    items = []
    rerolledChest = false
    profitChestOpened = false
    secondChestOpened = false
    Looting = false
    chestName = null
    shouldStart = false
})

