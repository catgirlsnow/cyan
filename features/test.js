import petHelper from "./utils/petUtils"
import leapHelper from "./utils/leapUtils"
import Terminal from "./utils/terminalUtils"
import serverRotations from "./utils/serverRotations"
import Pathfinder from "./utils/pathUtils"
import dragHelper from "./utils/dragUtils"
import { C05PacketPlayerLook, Jump, MouseEvent, S0FPacketSpawnMob, S2FPacketSetSlot, calcYawPitch, getFloor, getNameByClass, getViewDistance3D, leftClick, rightClick, snapTo, useItem } from "./utils/utils"
import pathUtils from "./utils/pathUtils"
import autoP3 from "./utils/autoP3"
import Settings from "../config"
import Node from "./utils/nodeUtils"
import { clip } from "./dungeons/HClip"
import leapUtils from "./utils/leapUtils"
import roomUtils from "./utils/roomUtils"
import "./events/heldItemChange"
import playerUtils from "./utils/playerUtils"


    
let shouldLook = false
let targetx
let targety
let targetz
let ctEntity

let yVelo = 3.37




register("tick", () => {
    if (Server.getIP() !== "localhost") return
    let Velo = yVelo
    let blockBelow = World.getBlockAt(Player.getX(), Player.getY(), Player.getZ()).type.getRegistryName()
    Player.getPlayer().func_110148_a(net.minecraft.entity.SharedMonsterAttributes.field_111263_d).func_111128_a(0.50000000745)
    Player.getPlayer().field_71075_bZ.func_82877_b(0.50000000745) 
    if (Player.getPlayer().func_180799_ab()) {
        Player.getPlayer().func_70016_h(Player.getPlayer().field_70159_w, Velo, Player.getPlayer().field_70179_y)
    }

    if (["minecraft:rail", "minecraft:powered_rail", "minecraft:detector_rail", "minecraft:activator_rail"].includes(blockBelow)) {
        Player.getPlayer().func_70016_h(Player.getPlayer().field_70159_w, 4.24, Player.getPlayer().field_70179_y)
    }
})

register("command", (x,y,z) => {   
    targetx = parseInt(x)
    targety = parseInt(y)
    targetz = parseInt(z)
    const [yaw, pitch] = calcYawPitch({x:x, y:y, z:z})
    snapTo(yaw, pitch)
}).setName("lookat")


register("command", (itemName) => {
    playerUtils.setHeldItem(itemName, () => {
        leftClick()
    })
}).setName("clickwith")


register("command", (min, max) => {
    playerUtils.enableAC(parseInt(min), parseInt(max))
}).setName("autoclicker")

register("command", () => {
    playerUtils.disableAC()
}).setName("stopautoclicker")

const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding");


register("command", () => {
    Jump.setState(true)
    clip()
    Client.scheduleTask(2, () => {
        Jump.setState(false)
    })
}).setName("jumpclip")


// { x: 24, y: 5, z: 56, shouldJump: true, shouldSnap: false, yawPitch: [0, 0], ignoreY: true },
// { x: 22, y: 5, z: 58, shouldJump: false, shouldSnap: true, yawPitch: [39.5, 14.7], ignoreY: true}


register("command", () => {
    const centerX = Math.floor(Player.getX()) + 0.5;
    const centerZ = Math.floor(Player.getZ()) + 0.5;
    Player.getPlayer().func_70107_b(centerX, Player.getY(), centerZ);
}).setName("center")

function convertFixedPoint(fixedValue, n = 5) {
    return fixedValue / (1 << n)
}




//archer
// Pathfinder.addPath(24, 5, 56, true, false, [30, 30]);
// Pathfinder.addPath(22, 5, 58, false, true, [39.5, 14.7]);

// berserk
// Pathfinder.addPath(86, 5, 52, true, false, [30, 30]);
// Pathfinder.addPath(91, 5, 56, false, true, [-66.2, 15.6]);

//Orange stackfrom: 49, 4, 88, lookat:85, 24, 55.5
//Blue stackfrom: 36, 5, 113 lookat:85, 23, 96.5
//Red stackfrom: 33, 4, 94 lookat: 27.5, 22, 59
//Green stackfrom: 67, 4, 70 lookat: 20, 24, 93
//Purple stackfrom: 22, 5, 94 lookat: 56, 22, 125

// maxor spawns at 73 226 53
// storm spawns at 103 188 53
// goldor spawns at 80 119 40
// necron spawns at 54 66 76

        