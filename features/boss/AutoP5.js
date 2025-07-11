// import dragHelper, { onDragDeath, onDragParticles, onDragSpawn, onStartStack } from "../utils/dragUtils"
// import Pathfinder from "../utils/pathUtils"
// import serverRotations from "../utils/serverRotations"
// import { calcYawPitch, getItemSlot, rightClick, useItem, getClass, colorOrder, stopuseItem, snapTo } from "../utils/utils"

// let shouldP5
// let currentClass
// let currentPrio 
// let currentPath

// let shootEntity = null
// let shootX
// let shootY
// let shootZ


// const shootAt = register("tick", () => {
//     let targetX = shootX
//     let targetY = shootY
//     let targetZ = shootZ
//     if (shootEntity) {
//         targetX = shootEntity.getX() + (shootEntity.getMotionX() * 9)
//         targetY = shootEntity.getY() + shootEntity.getEyeHeight() + (shootEntity.getMotionY() * 9)
//         targetZ = shootEntity.getZ() + (shootEntity.getMotionZ() * 9)
//     }
//     const [yaw, pitch] = calcYawPitch({x:targetX, y:targetY, z:targetZ})
//     serverRotations.setRotation(yaw, pitch)
//     useItem()


// }).unregister()

// register("chat", () => {
//     currentClass = getClass()
//     if (currentClass !== "Berserk" && currentClass !== "Archer") return;

//     shouldP5 = true
// }).setCriteria("[BOSS] Wither King: I no longer wish to fight, but I know that will not stop you.")


// onDragParticles(() => {
//     Client.scheduleTask(1, () => {
//        currentPrio = dragHelper.getPrio()
//        currentPath = stackSpots.find(stack => stack.dragon === currentPrio);
//        Pathfinder.addPath(
//         currentPath.startStack.x,
//         currentPath.startStack.y,
//         currentPath.startStack.z,
//         currentPath.startStack.shouldJump,
//         currentPath.startStack.shouldSnap,
//         currentPath.startStack.yawPitch,
//         currentPath.startStack.ignoreY
//     )
//     })
// })

// onStartStack(() => {

//     Pathfinder.addPath(
//         currentPath.stackTo.x,
//         currentPath.stackTo.y,
//         currentPath.stackTo.z,
//         currentPath.stackTo.shouldJump,
//         currentPath.stackTo.shouldSnap,
//         currentPath.stackTo.yawPitch,
//         currentPath.stackTo.ignoreY 
//     )

//     shootX = currentPath.lookAt.x
//     shootY = currentPath.lookAt.y
//     shootZ = currentPath.lookAt.z
//     shootAt.register()
// })

// onDragSpawn((color) => {
//     if (color !== currentPrio) return;
//     const dragInfo = dragHelper.getDragInfo(currentPrio) 
//     shootEntity = dragInfo.dragEntity

// })

// onDragDeath((color) => {
//     if (color !== currentPrio) return;
//     shootAt.unregister()
//     serverRotations.resetRotation()
//     stopuseItem()
//     shootEntity = null
//     currentPrio = null
//     currentPath = null
//     Pathfinder.addPath(39, 5, 89, true, false, [0, 0], true)
// })

// const stackSpots = [
//     {
//         dragon: "orange",
//         startStack: { x: 46, y: 4, z: 84, shouldJump: true, shouldSnap: true, yawPitch: [-126.3, -19.4], ignoreY: true },
//         stackTo: { x: 78, y: 4, z: 61, shouldJump: false, shouldSnap: false, yawPitch: [0, 0], ignoreY: true },
//         lookAt: { x: 84, y: 23, z: 57 }
//     },
//     {
//         dragon: "blue",
//         startStack: { x: 42, y: 5, z: 106, shouldJump: true, shouldSnap: true, yawPitch: [-102.4, -18.7], ignoreY: true },
//         stackTo: { x: 81, y: 5, z: 97, shouldJump: false, shouldSnap: false, yawPitch: [0, 0], ignoreY: true },
//         lookAt: { x: 81, y: 21, z: 98 }
//     },
//     {
//         dragon: "red",
//         startStack: { x: 16, y: 5, z: 85, shouldJump: true, shouldSnap: true, yawPitch: [-154.7, -22.1], ignoreY: true },
//         stackTo: { x: 28, y: 4, z: 64, shouldJump: false, shouldSnap: false, yawPitch: [0, 0], ignoreY: true },
//         lookAt: { x: 30, y: 20.4, z: 57 }
//     },
//     {
//         dragon: "green",
//         startStack: { x: 63, y: 4, z: 75, shouldJump: true, shouldSnap: true, yawPitch: [67.5, -19.5], ignoreY: true },
//         stackTo: { x: 34, y: 4, z: 86, shouldJump: false, shouldSnap: false, yawPitch: [0, 0], ignoreY: true },
//         lookAt: { x: 26, y: 21, z: 91 }
//     },
//     {
//         dragon: "purple",
//         startStack: { x: 26, y: 5, z: 94, shouldJump: true, shouldSnap: true, yawPitch: [-42.8, -17.6], ignoreY: true },
//         stackTo: { x: 42, y: 5, z: 111, shouldJump: false, shouldSnap: false, yawPitch: [0, 0], ignoreY: true },
//         lookAt: { x: 52, y: 19.5, z: 122 }
//     }
// ];


// register("command", (arg) => {
//     // dragHelper._simDragon("purple")
//     dragHelper._simParticles(arg)
// }).setName("dragspawn")

// register("command", (arg) => {
//     dragHelper._simDragDeath(arg)
// }).setName("dragdeath")

// register("command", (arg) => {
//     shootAt.unregister()
// }).setName("stopshoot")