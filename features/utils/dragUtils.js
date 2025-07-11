import { Prefix, S0FPacketSpawnMob, S2APacketParticle, S32PacketConfirmTransaction, enchantmentTableParticle, getClass, convertFixedPoint, getDistance3D } from "./utils";
import Settings from "../../config"
import overlayUtils from "./overlayUtils";
import { registerWhen } from "../../../BloomCore/utils/Utils";

const dragParticles = []
const startStacks = []
const dragSpawns = []
const dragDeaths = []


export const onDragParticles = (particleFunc) => {
    if (typeof particleFunc === "function") {
        dragParticles.push(particleFunc);
    }
};

export const onStartStack = (stackFunc) => {
    if (typeof stackFunc === "function") {
        startStacks.push(stackFunc);
    }
};

export const onDragSpawn = (spawnFunc) => {
    if (typeof spawnFunc === "function") {
        dragSpawns.push(spawnFunc);
    }
};

export const onDragDeath = (deathFunc) => {
    if (typeof deathFunc === "function") {
        dragDeaths.push(deathFunc);
    }
};



const colors = {
    "orange": {x: [82, 88], y: [15, 22], z: [53, 59]},
    "red": {x: [24, 30], y: [15, 22], z: [56, 62]},
    "green": {x: [23, 29], y: [15, 22], z: [91, 97]}, 
    "purple": {x: [53, 59], y: [15, 22], z: [122, 128]},
    "blue": {x: [82, 88], y: [15, 22], z: [91, 97]},
};

const priorities = {
    "Archer": ["purple", "blue", "red", "green", "orange"],
    "Tank": ["purple", "blue", "red", "green", "orange"],
    "Mage": ["orange", "green", "red", "blue", "purple"],
    "Berserk": ["orange", "green", "red", "blue", "purple"],
    "Healer": ["orange", "green", "red", "blue", "purple"]
};

function isWithinRange(value, range) {
    return value >= range[0] && value <= range[1];
}

const prio = "pbrgo";

export default new class dragHelper { 
    constructor() {
        this.dragonInfo = {
            "orange": {spawning: false, tillSpawn: 0, spawnCoords: [85, 18, 56], dragEntity: null, spawned: false},
            "red": {spawning: false, tillSpawn: 0, spawnCoords: [27, 18, 59], dragEntity: null, spawned: false},
            "green": {spawning: false, tillSpawn: 0, spawnCoords: [26, 18, 94], dragEntity: null, spawned: false},
            "purple": {spawning: false, tillSpawn: 0, spawnCoords: [56, 18, 125], dragEntity: null, spawned: false},
            "blue": {spawning: false, tillSpawn: 0, spawnCoords: [85, 18, 94], dragEntity: null, spawned: false}
        };
        


        register("packetReceived", (packet, event) => {
            if (packet.func_179749_a() !== enchantmentTableParticle) return;

            const x = packet.func_149220_d() // x
            const y = packet.func_149226_e() // y
            const z = packet.func_149225_f() // z

            for (let color in colors) {
                let { x: xRange, y: yRange, z: zRange } = colors[color];
                if (
                    isWithinRange(x, xRange) &&
                    isWithinRange(y, yRange) &&
                    isWithinRange(z, zRange)
                ) {
                    if (!this.dragonInfo[color].spawning && !this.dragonInfo[color].spawned) {
                        this.dragonInfo[color].spawning = true;
                        this.dragonInfo[color].tillSpawn = 100;
                        this.dragonInfo[color].dragEntity = null
                        // ChatLib.chat(Prefix + `&c${color} &adragon is spawning.`);
                        for (let dragParticle of dragParticles) {
                            dragParticle()
                        }
                    }
                }
            }

        }).setFilteredClass(S2APacketParticle)

        register("packetReceived", (packet, event) => {
            for (let color in colors) {
                if (this.dragonInfo[color].spawning) {
                    this.dragonInfo[color].tillSpawn--;

                    if (this.dragonInfo[color].tillSpawn == 18) {
                        for (let startStack of startStacks) {
                            startStack()
                        }
                    }

                    if (this.dragonInfo[color].tillSpawn == 0) {
                        this.dragonInfo[color].spawning = false
                    }
                }
            }
        }).setFilteredClass(S32PacketConfirmTransaction);

        // register("tick", () => {
        //     for (let color in colors) {
        //         if (this.dragonInfo[color].spawning) {
        //             this.dragonInfo[color].tillSpawn--;

        //             if (this.dragonInfo[color].tillSpawn == 18) {
        //                 for (let startStack of startStacks) {
        //                     startStack()
        //                 }
        //             }

        //             if (this.dragonInfo[color].tillSpawn == 0) {
        //                 this.dragonInfo[color].spawning = false
        //             }
        //         }
        //     }
        // })

        register("packetReceived", (packet, event) => {
            if (packet.func_149025_e() !== 63) return;
        
            const x = (convertFixedPoint(packet.func_149023_f()))
            const y = (convertFixedPoint(packet.func_149034_g()))
            const z = (convertFixedPoint(packet.func_149029_h()))
            const entityID = packet.func_149024_d()

            for (let color in colors) {
                let spawnCoords = this.dragonInfo[color].spawnCoords;
                if (!spawnCoords) return;
                let distance = getDistance3D(x, y, z, spawnCoords[0], spawnCoords[1], spawnCoords[2]);
                if (distance <= 15) {
                    Client.scheduleTask(2, () => {
                        let mcEntity = World.getWorld().func_73045_a(entityID)
                        let ctEntity = new Entity(mcEntity)
                        this.dragonInfo[color].dragEntity = ctEntity
                        this.dragonInfo[color].spawned = true
                        // ChatLib.chat(Prefix + `&c${color} &dragon spawned.`);
                        for (let dragSpawn of dragSpawns) {
                            dragSpawn(color)
                        }
                    })
                    break
                }
            }

        
        }).setFilteredClass(S0FPacketSpawnMob)

        register("tick", () => { 
            for (let color in this.dragonInfo) {
                let dragInfo = this.dragonInfo[color];
        
                if (dragInfo.dragEntity && dragInfo.dragEntity.getEntity().func_110143_aJ() <= 0)  {
                    dragInfo.dragEntity = null; 
                    dragInfo.spawned = false; 
                    dragInfo.spawning = false
                    // ChatLib.chat(Prefix + `&c${color} &dragon died.`);
                    for (let dragDeath of dragDeaths) {
                        dragDeath(color);
                    }
                }
            }
        });
        
        registerWhen(register("RenderOverlay", () => {
            const dragInfo = this.getDragInfo(this.getPrio())
            if (!dragInfo) return;

            const inTerminalText = "&3" + dragInfo.tillSpawn * 50
            const scale = 1.5;
            Renderer.scale(scale);
            Renderer.drawStringWithShadow(inTerminalText, (Renderer.screen.getWidth() / scale - Renderer.getStringWidth(inTerminalText)) / 2, Renderer.screen.getHeight() / scale / 2 + 10);
    
        }), () => Settings().DragonTimer && this.getDragInfo(this.getPrio()))

    }
    
    _simParticles(dragon) {
        this.dragonInfo[dragon].spawning = true
        this.dragonInfo[dragon].tillSpawn = 100;
        this.dragonInfo[dragon].dragEntity = null
        for (let dragParticle of dragParticles) {
            dragParticle()
        }
    }

    _simDragDeath(dragon) {
        let dragInfo = this.dragonInfo[dragon];
        dragInfo.dragEntity = null; 
        dragInfo.spawned = false; 
        dragInfo.spawning = false

        for (let dragDeath of dragDeaths) {
            dragDeath(dragon);
        }
    }


    getDragInfo(dragon) {
        return this.dragonInfo[dragon] || null;
    }

    getPrio() {    
        const currentClass = getClass()
        const priorityOrder = priorities[currentClass] || [];
    
        return priorityOrder.find(color => this.dragonInfo[color]?.spawning || this.dragonInfo[color]?.spawned) || null;
    }
    
}
