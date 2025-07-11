import { clip } from "../dungeons/HClip";
import serverRotations from "./serverRotations";
import petHelper from "./petUtils"
import leapHelper from "./leapUtils";
import { doJump, getItemSlot, leftClick, rightClick, snapTo, startWalk, stopWalk, getNameByClass, edge, Prefix } from "./utils";

export default class Node {
    constructor(x, y, z, width, id) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.id = id;
        this.actionsByEvent = {};
        this.activeActions = new Set();
    }

    addEventAction(eventType, type, data) {
        if (!this.actionsByEvent[eventType]) {
            this.actionsByEvent[eventType] = [];
        }

        // Check for conflicts between "bonzo" and "boom"
        for (let i = 0; i < this.actionsByEvent[eventType].length; i++) {
            const action = this.actionsByEvent[eventType][i];
            if (
                (action.type === "bonzo" && type === "boom") ||
                (action.type === "boom" && type === "bonzo")
            ) {
                ChatLib.chat(Prefix + `&aCannot add &c"${type}" &aaction because a conflicting &c"${action.type}" &aaction already exists in Node.`);
                return;
            }
        }

        // Ensure only one action of the same type exists
        for (let i = 0; i < this.actionsByEvent[eventType].length; i++) {
            if (this.actionsByEvent[eventType][i].type === type) {
                this.actionsByEvent[eventType][i] = { type, data };
                ChatLib.chat(Prefix + `&aAction &c"${type}" &aupdated under event &c"${eventType}" &afor Node`);
                return;
            }
        }

        this.actionsByEvent[eventType].push({ type, data });
        ChatLib.chat(Prefix + `&aAction &c"${type}" &aadded under event &c"${eventType}" &afor Node`);
    }

    removeAction(type) {
        let removed = false;

        for (let eventType in this.actionsByEvent) {
            const actions = this.actionsByEvent[eventType];
            const filteredActions = [];
            for (let i = 0; i < actions.length; i++) {
                if (actions[i].type !== type) {
                    filteredActions.push(actions[i]);
                } else {
                    removed = true;
                }
            }
            this.actionsByEvent[eventType] = filteredActions;
        }

        if (removed) {
            ChatLib.chat(Prefix + `&aAction &c"${type}" removed from Node`);
        } else {
            ChatLib.chat(Prefix + `&aAction &c"${type}" not found in Node`);
        }
    }

    executeActions(eventType = null) {
        let actions = [];
    
        if (eventType) {
            actions = this.actionsByEvent[eventType]
        } else {
            actions = this.actionsByEvent["null"]
        }
        
        if (!Array.isArray(actions)) return;
        if (!actions.length) return;
        // Sort actions by priority 
        let priorityOrder = ["stop", "rotate", "walk", "pet", "jump", "hclip", "boom", "bonzo", "leap", "edge"];
        actions.sort((a, b) => priorityOrder.indexOf(a.type) - priorityOrder.indexOf(b.type));
        
        for (let i = 0; i < actions.length; i++) {
            this._executeAction(actions[i].type, actions[i].data, eventType);
        }
    }
    
    
    

    _executeAction(type, data, eventType = null) {
        if (this.activeActions.has(type) && !eventType) return; 
        if (!eventType) this.activeActions.add(type); 
        let delay = 20;
    
            switch (type) {
                case "stop":
                    this.handleStop(data.motion, data.centerBlock);
                    delay = 40;
                    break;
                case "rotate":
                    this.handleRotate(data.yaw, data.pitch);
                    delay = 5;
                    break;
                case "walk":
                    this.handleWalk();
                    delay = 5;
                    break;
                case "jump":
                    this.handleJump();
                    delay = 40;
                    break;
                case "hclip":
                    this.handleHClip(data.yaw, data.speed);
                    delay = 40;
                    break;
                case "boom":
                    this.handleBoom(data.yaw, data.pitch);
                    delay = 60;
                    break;
                case "bonzo":
                    this.handleBonzo(data.yaw, data.pitch);
                    delay = 60;
                    break;
                case "leap":
                    this.handleLeap(data.leapClass);
                    delay = 60;
                    break;
                case "pet": 
                    this.handlePet(data.petName)
                    delay = 60
                case "edge":
                    this.handleEdge();
                    delay = 60;
                    break;
                default:
                    ChatLib.chat(`&cUnknown action type: ${type}`);
            }
        if (!eventType){
            Client.scheduleTask(delay, () => {
                this.activeActions.delete(type);
            });
        }

    }
    

    handleWalk() {
        Player.getPlayer().func_70016_h(0, Player.getPlayer().field_70181_x, 0);
        startWalk();
    }

    handleRotate(yaw, pitch) {
        snapTo(yaw, pitch);
    }

    handleJump() {
        doJump();
    }

    handleHClip(yaw, speed) {
        if (isNaN(yaw)) yaw = Player.getYaw();
        if (isNaN(speed)) speed = 2.7
        clip(yaw, speed);
    }

    handleStop(motion, centerBlock) {
        stopWalk();

        if (motion) {
            Player.getPlayer().func_70016_h(0, Player.getPlayer().field_70181_x, 0);
        }

        if (centerBlock) {
            const centerX = Math.floor(this.x) + 0.5;
            const centerZ = Math.floor(this.z) + 0.5;
            Player.getPlayer().func_70107_b(centerX, Player.getY(), centerZ);
        }
    }

    handleBoom(yaw, pitch) {
        const itemSlot = getItemSlot("boom");
        if (!itemSlot) return;
        if (itemSlot < 0 || itemSlot > 7) return;
        Player.setHeldItemIndex(itemSlot);
        snapTo(yaw, pitch);
        Client.scheduleTask(1, () => {
            leftClick();
        });
    }

    handleBonzo(yaw, pitch) {
        const itemSlot = getItemSlot("bonzo");
        if (!itemSlot) return;
        if (itemSlot < 0 || itemSlot > 7) return;
        Player.setHeldItemIndex(itemSlot);
        serverRotations.setRotation(yaw, pitch, () => {
            Client.scheduleTask(1, () => {
                rightClick();
                serverRotations.resetRotation();
            });
        });
    }

    handleLeap(playerClass) {
        const playerIGN = getNameByClass(playerClass)
        if (!playerIGN) return;
        ChatLib.chat(playerIGN)
        leapHelper.autoLeap(playerIGN);
    }

    handlePet(petName) {
        if (!petName) return;
        petHelper.queuePet(petName)
    }

    handleEdge() {
        edge();
    }

    printActionsSummary() {
        if (Object.keys(this.actionsByEvent).length === 0) {
            ChatLib.chat(Prefix + "&cNo actions or events defined for this node.");
            return;
        }

        ChatLib.chat(Prefix + `&aNode ID: &e${this.id}`);
        ChatLib.chat(Prefix + `&aCoordinates: &e(${this.x}, ${this.y}, ${this.z})`);
        ChatLib.chat(Prefix + "&aActions and Events:");

        for (let eventType in this.actionsByEvent) {
            const actions = this.actionsByEvent[eventType];
            ChatLib.chat(Prefix + `&6Event: &e${eventType}`);
            for (let i = 0; i < actions.length; i++) {
                ChatLib.chat(
                    Prefix +
                    `  &b${i + 1}. Action: &e${actions[i].type} &aData: &e${JSON.stringify(actions[i].data)}`
                );
            }
        }
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
            width: this.width,
            id: this.id,
            actionsByEvent: this.actionsByEvent
        };
    }

    static fromJSON(data) {
        const node = new Node(data.x, data.y, data.z, data.width, data.id);
        node.actionsByEvent = data.actionsByEvent || {};
        return node;
    }
}
