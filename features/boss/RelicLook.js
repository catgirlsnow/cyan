import { C02PacketUseEntity, Prefix, EntityArmorStand, EntityPlayer, rightClick} from "../utils/utils";
import Pathfinder from "../utils/pathUtils"
import Settings from "../../config"
import {registerWhen} from "../../../BloomCore/utils/Utils"

let autoRun
let lastClick
let lastSnap

const relicBoxes = [
    {
        coordinates: {
            minX: 90,
            minZ: 54,
            maxX: 94,
            maxZ: 58
        }, 
        dragon: "&6Orange",
        aim: { x: 58, y: 7.5, z: 43} 
    },
    {
        coordinates: {
            minX: 18,
            minZ: 57,
            maxX: 22,
            maxZ: 61
        }, 
        dragon: "&cRed",
        aim: { x: 51, y: 6.5, z: 42.87} 
    }
];  

function getDragInfo(x, z) {
    for (let box of relicBoxes) {
        if (x >= box.coordinates.minX && x <= box.coordinates.maxX &&
            z >= box.coordinates.minZ && z <= box.coordinates.maxZ) {
            return box;
        }
    }
    return null;
}

register("tick", () => {
    if (!Settings().RelicTriggerbot) return;
    if (Date.now() - lastClick < 1000) return;
    const lookingAt = Player.lookingAt()
    if (!(lookingAt instanceof Entity)) return;

    const mcEntity = lookingAt.entity
    if (!(mcEntity instanceof EntityArmorStand)) return
    if (!(getDragInfo(lookingAt.getX(), lookingAt.getZ()))) return;
    
    rightClick()
    lastClick = Date.now()


})


register("packetSent", (packet, event) => {
    if (!Settings().RelicLook) return;
    if (Date.now() - lastSnap < 3000) return;

    const entity = packet.func_149564_a(World.getWorld())
    if (!entity) return;
    
    if (entity instanceof EntityPlayer) return;

    let entityClicked = new Entity(entity)

    if (!(entityClicked.getY() < 15)) return; 

    let dragInfo = getDragInfo(entityClicked.getX(), entityClicked.getZ())
    if (!dragInfo) return;

    ChatLib.chat(Prefix + "&aRotating towards " + dragInfo.dragon)

    Pathfinder.addPath(dragInfo.aim.x, dragInfo.aim.y, dragInfo.aim.z, false, false, [0, 0], false);

    lastSnap = Date.now()
    autoRun = true

    Client.scheduleTask(0, () => {
        snapTo(yaw,pitch+0.05)
    })
    Client.scheduleTask(1, () => {
        snapTo(yaw,pitch-0.05)
    })

    
}).setFilteredClass(C02PacketUseEntity);

registerWhen(register("renderOverlay", () => {
    const blockID = Player.lookingAt()?.getType()?.getID();
    if (blockID !== 118 && blockID !== 145) return;
    rightClick()
    Pathfinder.finishPath()
    Client.scheduleTask(20, () => {
        Pathfinder.addPath(54, 5.75, 76, false, false, [0, 0], true)
    })
    autoRun = false
}), () => autoRun && Settings().RunMid)

