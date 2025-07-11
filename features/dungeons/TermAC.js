
import Settings from "../../config";
import {leftClick} from "../utils/utils"

function randomDelay(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
let lastTermClick = 0


register("tick", () => {
    if(!Settings().termAC) return;
   
    if (Player.lookingAt() instanceof Block) return;
    
    let mc = Client.getMinecraft();
    if (mc.field_71474_y.field_74313_G.func_151470_d()) {
        let item = Player.getHeldItem();
        let itemId = item?.getNBT()?.get("tag")?.get("ExtraAttributes")?.getString("id");
        if (itemId == "TERMINATOR") {
            if (lastTermClick === 0) {
                leftClick();
                lastTermClick = Date.now();
            }
            if (Date.now() - lastTermClick >= randomDelay(100, 80)) {
                leftClick();
                lastTermClick = Date.now();
            }
        }
    }
});