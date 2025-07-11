import { leftClick, snapTo } from "./utils"

export default new class playerUtils {
    constructor() {
        this.lastClick = 0;
        this.lcac = false;
        this.mincps = 0;
        this.maxcps = 0;

        this.autoclicker = register("renderWorld", () => {
            if (!this.lcac || this.maxcps < this.mincps) return;
        
            let time = Date.now();
            let cps = Math.random() * (this.maxcps - this.mincps) + this.mincps;
        
            let delay = 1000 / cps;
            delay += Math.random() * (1000 / this.mincps - 1000 / this.maxcps);
        
            if (time - this.lastClick < delay) return;
        
            Client.scheduleTask(0, leftClick)
            this.lastClick = time;
        }).unregister()
        
    }
    
    enableAC(min, max) {
        if (max < min) return;
        this.maxcps = max;
        this.mincps = min;
        this.lcac = true;
        this.autoclicker.register()
    }

    disableAC() {
        this.lcac = false;
        this.maxcps = 0;
        this.mincps = 0;
        this.autoclicker.unregister()
    }

    setRotation(yaw, pitch) {
        snapTo(yaw, pitch);
    }

    setHeldItem(itemName, callback = null) {
        const inventory = Player?.getInventory()?.getItems();
        if (!inventory) return;

        const itemSlot = inventory.findIndex(item => item?.getName()?.toLowerCase()?.includes(itemName.toLowerCase()));
        if (itemSlot < 0 || itemSlot > 7) return;

        Player.setHeldItemIndex(itemSlot);
        if (callback) Client.scheduleTask(1, callback);
    }
}
