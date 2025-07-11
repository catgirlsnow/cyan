import {Prefix, S2DPacketOpenWindow, S2FPacketSetSlot, sendWindowClick, rightClick } from "./utils"

export default new class leapHelper {
    constructor() {
        this.leapQueue = []
        this.menuOpened = false
        this.shouldLeap = false
        this.inProgress = false
        this.clickedLeap = false

        register("packetReceived", (packet, event) => {
            if (!this._inQueue() || !this.menuOpened ) return;


            const itemStack = packet.func_149174_e();
            const slot = packet.func_149173_d();
            const windowID = packet.func_149175_c();

            if (!windowID || !itemStack || !slot) return;
            if (slot > 35) {
                ChatLib.chat(Prefix + "&aCould not find &c" + this._currentLeap())
                this._reloadGUI()
                return;
            }; 
            cancel(event)
            
            const item = new Item(itemStack);
            const itemName = item?.getName()?.removeFormatting()?.toLowerCase();
            if (itemName !== this._currentLeap()?.toLowerCase()) return;
            sendWindowClick(windowID, slot, 0, 0)
            ChatLib.chat(Prefix + "&aLeaping to &c" + this._currentLeap())
            this._reloadGUI()

        }).setFilteredClass(S2FPacketSetSlot);

        register("packetReceived", (packet, event) => {
            if (!this._inQueue()) return;

            const title = ChatLib.removeFormatting(packet.func_179840_c().func_150254_d());
            this.WindowID = packet.func_148901_c()
    
    
            if (title !== "Spirit Leap") return;
            this.menuOpened = true;
            this.clickedLeap = false
            cancel(event)
        }).setFilteredClass(S2DPacketOpenWindow);

        register("chat", () => {
            this.clickedLeap = false
            this.inProgress = false
            this.leapQueue.pop()
        }).setChatCriteria(/^This ability is on cooldown for (\d+)s\.$/)
        

    }

    
    _inQueue() {
        return this.leapQueue.length > 0;
    }

    _currentLeap() {
        return this.leapQueue[0];
    }

    _reloadGUI () {
        this.menuOpened = false;
        this.leapQueue.shift();
        this.inProgress = false
    }

    clearQueue() {
        this.leapQueue = []
    } 
    
    queueLeap(name) {
        this.leapQueue.push(name);
    }

    autoLeap(name) {
        if (this.clickedLeap) return;
        if (this.inProgress) return;

        const leapID = Player.getInventory()?.getItems()?.find(a => a?.getName()?.removeFormatting() == "Infinileap")?.getID()
        if (!leapID) return;
        const leapSlot = parseInt(Player.getInventory().indexOf(leapID))
        if (leapSlot > 7 || leapSlot < 0) return;

        this.inProgress = true

        Player.setHeldItemIndex(leapSlot)

        Client.scheduleTask(0, () => {
            rightClick()
            this.clickedLeap = true
        })

        this.leapQueue.push(name);

    }
}