import { Prefix } from "../utils/utils";

let completeFuncs = [];

export const onSectionComplete = (completeFunc) => {
    if (typeof completeFunc === "function") {
        completeFuncs.push(completeFunc);
    }
};

let gateBlown = false;
let completed = 0;
let total = 1;

function sectionComplete() {
    if (completed === total && gateBlown) {
        for (let completeFunc of completeFuncs) {
            completeFunc()
        }
        completed = 0;
        total = 1;
        gateBlown = false;
    }
}

register("command", () => {
    ChatLib.chat(Prefix + "&aSim Section Complete")
    Client.scheduleTask(1, () => {
        for (let completeFunc of completeFuncs) {
            completeFunc()
        }
    })
}).setName("simsectioncomplete")

register("chat", () => {
    gateBlown = true;
    sectionComplete();
}).setCriteria("The gate has been destroyed!");

register("chat", (completedParam, totalParam) => {
    completed = parseInt(completedParam);
    total = parseInt(totalParam);
    sectionComplete();
}).setCriteria(/^.+ (?:activated|completed) a .+! \((\d)\/(\d)\)$/);
