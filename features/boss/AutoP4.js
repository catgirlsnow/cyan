
import { entityWither, getClass, getHeldItemID, isPlayerInBox, Prefix, calcYawPitch, useItem, stopuseItem, getNameByClass } from "../utils/utils";
import serverRotations from "../utils/serverRotations";
import Pathfinder from "../utils/pathUtils"
import leapHelper from "../utils/leapUtils"
import petHelper from "../utils/petUtils"
import Settings from "../../config";
import { prefix, registerWhen } from "../../../BloomCore/utils/Utils";

let shouldShoot
let currentNecron
let necronArgh = 0
let shouldSnap 

register("chat", () => {
    if (!Settings().AutoP4) return;
    const currentClass = getClass()
    if (currentClass !== "Berserk" && currentClass !== "Archer") return;
    shouldShoot = true
    let allWithers = World.getAllEntitiesOfType(entityWither)
    allWithers.forEach(entity => {
        if (entity.distanceTo(54, 66, 76) < 15) {
            currentNecron = entity
        }
    });

}).setCriteria("[BOSS] Necron: Goodbye.")



registerWhen(register("tick", () => {

    if (getHeldItemID() !== "TERMINATOR") return;

    const [yaw, pitch] = calcYawPitch({x: currentNecron.getX(), y: currentNecron.getY()+3, z:currentNecron.getZ()})

    serverRotations.setRotation(yaw, pitch)
    useItem()
}), () => shouldShoot && currentNecron && Settings().AutoP4 && isPlayerInBox(52, 60, 68, 56, 70, 71))


register("chat", () => {
    if (!Settings().AutoP4) return;
    necronArgh = necronArgh + 1
    if (necronArgh !== 2) return;

    const currentClass = getClass()
    if (!currentClass) return;
    if (currentClass.includes("Healer")) return;

    shouldShoot = false
    stopuseItem()
    serverRotations.resetRotation()

    let leapTo = getNameByClass("Healer")
    if (!leapTo) return;

    ChatLib.chat(Prefix + "&aNecron Complete")
    leapHelper.autoLeap(leapTo)
    shouldSnap = true

}).setCriteria("[BOSS] Necron: ARGH!")

register("worldUnload", () => {
    necronArgh = 0
    currentNecron = null
})

const relicLocations = [
    {
        class: "Archer",
        paths: [
            { x: 24, y: 5, z: 56, shouldJump: true, shouldSnap: false, yawPitch: [0, 0], ignoreY: true },
            { x: 22, y: 5, z: 58, shouldJump: false, shouldSnap: true, yawPitch: [39.5, 14.7], ignoreY: true}
        ]
    },
    {
        class: "Berserk",
        paths: [
            { x: 86, y: 5, z: 52, shouldJump: true, shouldSnap: false, yawPitch: [0, 0], ignoreY: true },
            { x: 91, y: 5, z: 56, shouldJump: false, shouldSnap: true, yawPitch: [-66.2, 15.6], ignoreY: true }
        ]
    }
];

function addClassPath(className) {
    const location = relicLocations.find(loc => loc.class === className);
    if (location) {
        location.paths.forEach(path => {
            Pathfinder.addPath(path.x, path.y, path.z, path.shouldJump, path.shouldSnap, path.yawPitch, path.ignoreY);
        });
    } else {
        ChatLib.chat(Prefix + `&aClass &c'${className}'&a not found in relicLocations.`);
    }
}

let forceclass = false
let forcedclass = ""
register("command", (arg) => {
    forceclass = true
    forcedclass = arg
    ChatLib.chat(Prefix + `&a Class forced to ${forcedclass}`)
}).setName("forceclass")


register("chat", (player, event) => {
    if (!Settings().AutoP4) return;
    if (!shouldSnap) return;
    shouldSnap = false

    let currentClass = getClass()
    if (!currentClass) return;
    if (forceclass) {
        currentClass = forcedclass
    }

    if (Settings().AutoCat) {
    petHelper.queuePet("cat")
    }

    if (Settings().AutoRunRelic) {
    addClassPath(currentClass)
    }
}).setCriteria(/^You have teleported to (\w+)!$/)

