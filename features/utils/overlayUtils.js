/*
    display object format:
    {
        text: '',
        x: 0,
        y: 0,
        scale: 1,
        expiry: 0,
        align: null/LEFT/RIGHT
    }
*/


// leo litdab my father built this brick by brick
// he is the best mage to ever play on hypixel skyblock
// he is the best human to ever live in the netherlands 
// he is actually just the best person of all time
// thank you leo litdab
// i will cherish you always

export default new class overlayUtils {
    constructor() {
        this.currentDisplays = [];
        this.renderObj = [];
        this.renderRegistered = false;

        const render = register('renderOverlay', () => {
            for (let obj of this.renderObj) {
                let [render, x, y] = obj;
                render.draw(x, y);
            }
        }).setPriority(Priority.LOW).unregister();
    
        register('tick', () => {
            if (!this.currentDisplays.length) {
                if (this.renderRegistered) {
                    render.register();
                    this.renderRegistered = false;
                };

                return;
            };

            if (!this.renderRegistered) {
                render.register();
                this.renderRegistered = true;
            }
        
            this.renderObj = [];

            for (let i = 0; i < this.currentDisplays.length; i++) {
                let obj = this.currentDisplays[i];
        
                if (Date.now() - obj.expiry - 10 > 0) {
                    this.currentDisplays.splice(i, 1);
                    i--;
                    continue;
                }

                this.renderObj.push([new Text(obj.text).setScale(obj.scale).setShadow(true).setAlign(obj.align == null ? (obj.x < (Renderer.screen.getWidth() / 2) ? 'LEFT' : 'RIGHT') : obj.align), obj.x, obj.y]);
            }
        })
    }

    addDisplayObject(text, x, y, scale, expiry = 0, align = null) {
        this.currentDisplays.push({
            text: text,
            x: x,
            y: y,
            scale: scale,
            expiry: Date.now() + expiry,
            align: align
        });
    }
}