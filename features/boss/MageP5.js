import dragHelper, { onDragDeath, onDragParticles, onDragSpawn, ondebuffSpot } from "../utils/dragUtils"
import Pathfinder from "../utils/pathUtils"
import serverRotations from "../utils/serverRotations"
import { calcYawPitch, getItemSlot, rightClick, useItem, getClass, stopuseItem, snapTo } from "../utils/utils"

let shouldP5
let dragonCount 
let lastPrio

const dragonSpots = [
    {
        dragon: "orange",
        debuffSpot: {x: 83, y: 8, z: 57, shouldJump: true, snap: true, yawPitch: [-64.5, -80.6], ignoreY: true},
        aim: {x: 82, y: 17, z: 57}
    },
    {
        dragon: "blue",
        debuffSpot: {x: 82, y: 8, z: 97, shouldJump: true, snap: true, yawPitch: [-64.5, -80.6], ignoreY: true},
        aim: {x: 82, y: 21, z: 96}
    },
    {
        dragon: "red",
        debuffSpot: {x: 27, y: 8, z: 56, shouldJump: true, snap: true, yawPitch: [-64.5, -80.6], ignoreY: true},
        aim: {x: 27, y: 21, z: 56}

    },
    {
        dragon: "green",
        debuffSpot: {x: 27, y: 8, z: 91, shouldJump: true, snap: true, yawPitch: [-64.5, -80.6], ignoreY: true},
        aim: {x: 27, y: 23, z: 91}
    },
    {
        dragon: "purple",
        debuffSpot: {x: 56, y: 9, z: 126, shouldJump: true, snap: true, yawPitch: [-64.5, -80.6], ignoreY: true},
        aim: {x: 56, y: 15, z: 124}
    }
]

register("chat", () => {
    currentClass = getClass()
    if (currentClass !== "Mage") return;
    shouldP5 = true
}).setCriteria("[BOSS] Wither King: I no longer wish to fight, but I know that will not stop you.")

//     {   dragon: "mid",
//         debuffSpot: {x: 54, y: 7.5, z: 76, shouldJump: true, snap: true, yawPitch: [180, 0], ignoreY: true}
//     }

register("worldLoad", () => {
    dragonCount = 0
    lastPrio = ""
})

onDragParticles(() => {
    Client.scheduleTask(1, () => {
        currentPrio = dragHelper.getPrio()
        if (lastPrio == currentPrio) return;
        dragonCount++
        currentPath = stackSpots.find(stack => stack.dragon === currentPrio);
        Pathfinder.addPath(
        currentPath.debuffSpot.x,
        currentPath.debuffSpot.y,
        currentPath.debuffSpot.z,
        currentPath.debuffSpot.shouldJump,
        currentPath.debuffSpot.shouldSnap,
        currentPath.debuffSpot.yawPitch,
        currentPath.debuffSpot.ignoreY
    )
    })
})