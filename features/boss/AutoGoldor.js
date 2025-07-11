// import Settings from "../../config";
// import { onHeldItemChange } from "../events/heldItemChange"
// import serverRotations from "../utils/serverRotations"
// import { calcYawPitch, entityWither, getItemID } from "../utils/utils"
// // ctEntity.isInvisible() || ctEntity.entity.func_82212_n()

// let shouldShoot
// let currentGoldor

// register("chat", () => {

//     if (!Settings().AutoGoldor) return;
//     const currentClass = getClass()

//     if (currentClass !== "Berserk" && currentClass !== "Archer") return;

//     shouldShoot = true
//     let allWithers = World.getAllEntitiesOfType(entityWither)

//     for (let entity of allWithers) {
//         if (!entity.isInvisible() && entity.entity.func_82212_n() !== 800 && entity.getY() > 116 && entity.getY() < 119)  {
//             currentGoldor = entity
//         } 
//     }
// }).setCriteria("[BOSS] Goldor: You have done it, you destroyed the factory…")

// const shootGoldor = register("tick", () => {

//     const [yaw, pitch] = calcYawPitch({x: currentGoldor.getX(), y: currentGoldor.getY()+4, z:currentGoldor.getZ()})
// }).unregister()


// onHeldItemChange((item) => {
//     if (!Settings().AutoGoldor) return;
//     if (getItemID(item) !== "TERMINATOR") {
//         shootGoldor.unregister()
//     }
// })

// onHeldItemChange((item) => {
//     if (!Settings().AutoP4) return;

//     if (getItemID(item) !== "TERMINATOR") {
//         shootNecron.unregister()
//         serverRotations.resetRotation()
//         return;
//     }

//     shootNecron.register()

// })