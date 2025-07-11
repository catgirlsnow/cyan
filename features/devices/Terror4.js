import {calcYawPitch, Prefix, snapTo, rightClick, getBowShootSpeed} from "../utils/utils"

let terrorStack = 0;
const terrorActionBarRegex = /(§6(§l)?[0-9]+⁑)(§r)?./gm;

let lastShot = 0
let shouldPrefire

register('actionBar', (msg) => {
    const text = ChatLib.getChatMessage(msg);
    const terrorResult = text.match(terrorActionBarRegex);
    if (terrorResult) {
        hydraText = terrorResult[0];
        const newTerrorStack = parseInt(terrorResult[0].removeFormatting().match(/1?[0-9]/)[0]);
        if (newTerrorStack !== terrorStack) {
            lastTerrorHit = Date.now();
        }
        terrorStack = newTerrorStack;
    } else {
        terrorStack = 0;
    }
})

const isNearPlate = () => Player.getY() == 127 && Player.getX() >= 62 && Player.getX() <= 65 && Player.getZ() >= 34 && Player.getZ() <= 37;
const platePos = [63, 127, 35];

const isFourPlateDown = () => {
    const block = World.getBlockAt(...platePos);
    if (block.type.getID() !== 147) return false;
    const state = block.getState();
    return block.type.mcBlock.func_176201_c(state) > 0;
};

const shootCoords = [
    [66, 126, 50],
    [66, 128, 50],
    [66, 130, 50],
]

let shootIndex = 0


let TerrorFourthDevEnabled = false;


register("tick", () => {
    if (Player.getHeldItem()?.getID() !== 261) return;
    if (Date.now() - lastShot < getBowShootSpeed()) return;
    if (terrorStack !== 10) return;
    if (!shouldPrefire) return;
    if (!isNearPlate() || !isFourPlateDown()) return;

    if (shootIndex == 3) {
        shootIndex = 0
    }

    const [yaw, pitch] = calcYawPitch({x: shootCoords[shootIndex][0] + 0.7, y: shootCoords[shootIndex][1] + 1, z: shootCoords[shootIndex][2] + 0.5})
    snapTo(yaw, pitch)
    
    Client.scheduleTask(0, () => {
        rightClick()
        lastShot = Date.now()
    })   
    shootIndex++


})

register("chat", (message) => {
    shouldPrefire = true
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance.")

register("chat", (player, message) => {
    if (player !== Player.getName()) return;
    shouldPrefire = false

}).setCriteria(/(\w+) completed a device! \((.*?)\)/)
