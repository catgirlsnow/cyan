import Settings from "../../config";
import leapHelper from "../utils/leapUtils"
import { isPlayerInBox, rightClick, MouseEvent, getHeldItemID, getNameByClass } from "../utils/utils";

let lastOpener

register("chat", (player, event) => {
    lastOpener = player
}).setCriteria(/^(\w+) opened a WITHER door!$/)




function getLeap() {
    let leapString = "";

    if (Settings().DoorOpener) {
        leapString = lastOpener;
    }

    if (Settings().PositionalFastLeap) {
        if (isPlayerInBox(113, 160, 48, 89, 100, 122)) {
            let leapClass = getNameByClass(Settings().S1Leap);
            leapString = (leapClass === -1 || leapClass === "EMPTY") ? Settings().S1Leap : leapClass;
        } else if (isPlayerInBox(91, 160, 145, 19, 100, 121)) {
            let leapClass = getNameByClass(Settings().S2Leap);
            leapString = (leapClass === -1 || leapClass === "EMPTY") ? Settings().S2Leap : leapClass;
        } else if (isPlayerInBox(-6, 160, 123, 19, 100, 50)) {
            let leapClass = getNameByClass(Settings().S3Leap);
            leapString = (leapClass === -1 || leapClass === "EMPTY") ? Settings().S3Leap : leapClass;
        } else if (isPlayerInBox(17, 160, 27, 90, 100, 50)) {
            let leapClass = getNameByClass(Settings().S4Leap);
            leapString = (leapClass === -1 || leapClass === "EMPTY") ? Settings().S4Leap : leapClass;
        }
    }

    return leapString;
}


register(MouseEvent, (event) => {

        
    const button = event.button
    const state = event.buttonstate

    if (!state) return
    if (button !== 1) return;
    
    if (getHeldItemID() !== "INFINITE_SPIRIT_LEAP") return;

    leapHelper.clearQueue()
})

register(MouseEvent, (event) => {
    if (!Settings().FastLeap) return;
    
    const button = event.button
    const state = event.buttonstate

    if (!state) return
    if (button !== 0) return;

    if (getHeldItemID() !== "INFINITE_SPIRIT_LEAP") return;
    cancel(event)

    rightClick()

    let leapTo = getLeap()
    if (!leapTo || !leapTo.length) return;

    leapHelper.queueLeap(leapTo)
    
})
