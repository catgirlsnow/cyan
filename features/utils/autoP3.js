import Node from "./nodeUtils";
import RenderLib from "RenderLib";
import Dungeon from "../../../BloomCore/dungeons/Dungeon";

import { isPlayerInsideBox } from "./utils";
import { onCloseTerm, onOpenTerm } from "./terminalUtils";
import { onSectionComplete } from "../events/sectionComplete";
import { registerWhen } from "../../../BloomCore/utils/Utils";

const Prefix = "&8[&3Cyan&8] ";

export default new class AutoP3 {
    constructor() {
        this.nodes = []; // List of all nodes from all loaded configs
        this.nextId = 1; // Unique ID generator
        this.rootpath = "data/"; // File path for storing nodes
        this.loadedConfigs = {}; // Track loaded configs (key: file name, value: node list)
        this.activeConfig = null; // File name of the active config
        this.module = "Cyan";
        this.editmode = false;
        this.forcedungeon = false;

        // Event listeners
        onSectionComplete(() => this.checkProximity("onsectioncomplete"));
        onCloseTerm(() => this.checkProximity("oncloseterm"));
        onOpenTerm(() => this.checkProximity("onopenterm"));

        register("command", (action, ...args) => {
            this.handleCommand(action, args);
        }).setName("route");

        registerWhen(register("renderWorld", () => {
            this.renderNodes();
        }), () => this.forcedungeon && Dungeon.floorNumber ==7)


        register("tick", () => {
            if (!this.forcedungeon && Dungeon.floorNumber !== 7) return;
            if (this.editmode) return;
            this.checkProximity();
        });
    }

    handleCommand(action, args) {
        if (!action) {
            this.showHelp();
            return;
        }

        switch (action.toLowerCase()) {
            // Config-related commands
            case "loadconfig": {
                let path = args[0];
                if (!path) {
                    ChatLib.chat(Prefix + "&aUsage: &c/route loadconfig <path>");
                    return;
                }
                this._loadConfig(path);
                break;
            }
            case "setactive": {
                let path = args[0];
                if (!path) {
                    ChatLib.chat(Prefix + "&aUsage: &c/route setactive <path>");
                    return;
                }
                this.setActiveConfig(path);
                break;
            }
            case "listconfigs": {
                ChatLib.chat(Prefix + "&aLoaded Configurations:");
                let keys = Object.keys(this.loadedConfigs);
                for (let i = 0; i < keys.length; i++) {
                    let file = keys[i];
                    ChatLib.chat(Prefix + "&e- " + file + (file === this.activeConfig ? " (active)" : ""));
                }
                break;
            }
            case "unloadall": {
                this.unloadAllConfigs();
                ChatLib.chat(Prefix + "&aAll configurations have been unloaded.");
                break;
            }
            case "unloadconfig": {
                let path = args[0];
                if (!path || !this.loadedConfigs[path]) {
                    ChatLib.chat(Prefix + "&aInvalid or unloaded config path: &c" + path);
                    return;
                }
                this.unloadConfig(path);
                ChatLib.chat(Prefix + "&aConfiguration unloaded: &c" + path);
                break;
            }

            // Node management commands
            case "addnode": {
                let width = Number(args[0]);
                if (isNaN(width)) {
                    ChatLib.chat(Prefix + "&aUsage: &c/route addnode <width>");
                    return;
                }
                let x = Player.getX();
                let y = Player.getY();
                let z = Player.getZ();
                this.addNode(x, y, z, width);
                break;
            }
            case "addaction": {
                let [type, ...dataArgs] = args;
                let eventType = null;
                let validEvents = ["onopenterm", "oncloseterm", "onsectioncomplete"];
                if (dataArgs.length > 0 && validEvents.includes(dataArgs[0].toLowerCase())) {
                    eventType = dataArgs.shift().toLowerCase();
                }

                if (!this.activeConfig) {
                    ChatLib.chat(Prefix + "&cNo active configuration. Set an active config first.");
                    return;
                }

                let closestNode = this.findClosestNode();
                if (!closestNode) {
                    ChatLib.chat(Prefix + "&aNo nodes found near you to add an action.");
                    return;
                }
                if (!type) {
                    ChatLib.chat(Prefix + "&aUsage: &c/route addaction <type> [eventType] <data>");
                    return;
                }

                try {
                    let data = this.parseActionData(type, dataArgs);
                    closestNode.addEventAction(eventType, type.toLowerCase(), data);
                    this._saveNodes();
                } catch (error) {
                    ChatLib.chat(error.message);
                }
                break;
            }
            case "removeaction": {
                let [type, eventType = null] = args;
                if (!this.activeConfig) {
                    ChatLib.chat(Prefix + "&cNo active configuration. Set an active config first.");
                    return;
                }
                let closestNode = this.findClosestNode();
                if (!closestNode) {
                    ChatLib.chat(Prefix + "&aNo nodes found near you to remove an action.");
                    return;
                }
                if (!type) {
                    ChatLib.chat(Prefix + "&aUsage: &c/route removeaction <type> [eventType]");
                    return;
                }

                let normalizedEvent = eventType ? eventType.toLowerCase() : null;
                if (closestNode.actionsByEvent[normalizedEvent]) {
                    closestNode.actionsByEvent[normalizedEvent] = closestNode.actionsByEvent[normalizedEvent].filter(
                        action => action.type !== type.toLowerCase()
                    );
                    this._saveNodes();
                    ChatLib.chat(Prefix + "&aAction removed from node.");
                } else {
                    ChatLib.chat(Prefix + "&aNo matching actions found for that event type.");
                }
                break;
            }
            case "removenode": {
                if (!this.activeConfig) {
                    ChatLib.chat(Prefix + "&cNo active configuration. Set an active config first.");
                    return;
                }
                let closestNode = this.findClosestNode();
                if (!closestNode) {
                    ChatLib.chat(Prefix + "&aNo nodes found near you to remove.");
                    return;
                }
            
                this.loadedConfigs[this.activeConfig] = this.loadedConfigs[this.activeConfig].filter(node => node.id !== closestNode.id);
            
                this.nodes = this.loadedConfigs[this.activeConfig];
            
                this._saveNodes();
            
                ChatLib.chat(Prefix + `&aNode removed.`);
                break;
            }
            
            case "nodeinfo": {
                let closestNode = this.findClosestNode();
                if (closestNode) closestNode.printActionsSummary();
                else ChatLib.chat(Prefix + "&aNo nodes found near you.");
                break;
            }

            // Miscellaneous commands
            case "em": {
                this.editmode = !this.editmode;
                ChatLib.chat(Prefix + "&aEdit Mode " + (this.editmode ? "&aEnabled" : "&cDisabled"));
                break;
            }
            case "forcedungeon": {
                this.forcedungeon = !this.forcedungeon;
                ChatLib.chat(Prefix + "&aForce Dungeon " + (this.forcedungeon ? "&aEnabled" : "&cDisabled"));
                break;
            }

            // Default: show help
            default:
                this.showHelp();
                break;
        }
    }

    showHelp() {
        ChatLib.chat(Prefix + "&cAvailable commands:");

        ChatLib.chat(Prefix + "&6Config Commands:");
        ChatLib.chat(Prefix + "&e/route loadconfig <path>");
        ChatLib.chat(Prefix + "&e/route setactive <path>");
        ChatLib.chat(Prefix + "&e/route listconfigs");
        ChatLib.chat(Prefix + "&e/route unloadall");
        ChatLib.chat(Prefix + "&e/route unloadconfig <path>");

        ChatLib.chat(Prefix + "&6Node Management Commands:");
        ChatLib.chat(Prefix + "&e/route addnode <width>");
        ChatLib.chat(Prefix + "&e/route addaction <type> [eventType] <data>");
        ChatLib.chat(Prefix + "&e/route removeaction <type> [eventType]");
        ChatLib.chat(Prefix + "&e/route removenode");
        ChatLib.chat(Prefix + "&e/route nodeinfo");

        ChatLib.chat(Prefix + "&6Miscellaneous Commands:");
        ChatLib.chat(Prefix + "&e/route em");
        ChatLib.chat(Prefix + "&e/route forcedungeon");
    }

    parseActionData(type, args) {
        switch (type.toLowerCase()) {
            case "rotate": {
                let yaw = Number(args[0]);
                let pitch = Number(args[1]);
                if (isNaN(yaw)) yaw = Player.getYaw();
                if (isNaN(pitch)) pitch = Player.getPitch();
                return { yaw, pitch };
            }
            case "walk":
            case "jump": {
                return {};
            }
            case "hclip": {
                let yaw = Number(args[0]);
                let speed = Number(args[1]);
                if (isNaN(speed)) yaw = 2.7
                if (isNaN(yaw)) yaw = Player.getYaw();
                return { yaw, speed };
            }
            case "stop": {
                let motion = args[0] === "true";
                let centerBlock = args[1] === "true";
                return { motion, centerBlock };
            }
            case "bonzo":
            case "boom": {
                let yaw = Number(args[0]);
                let pitch = Number(args[1]);
                if (isNaN(yaw)) yaw = Player.getYaw();
                if (isNaN(pitch)) pitch = Player.getPitch();
                return { yaw, pitch };
            }
            case "leap": {
                let leapClass = args[0];
                if (!leapClass) {
                    ChatLib.chat(Prefix + "&aInvalid arguments for &c'leap'&a. Usage: &c<className>");
                }
                return { leapClass };
            }
            case "pet": {
                let petName = args[0];
                if (!petName) {
                    ChatLib.chat(Prefix + "&aInvalid arguments for &c'pet'&a. Usage: &c<petName>");
                }
                return { petName }
            }
            case "edge": {
                return {};
            }
            default: {
                ChatLib.chat(Prefix + `&aUnknown action type: &c'${type}'&a.`);
            }
        }
    }

    _loadConfig(path) {
        try {
            if (!path.endsWith(".json")) path += ".json";
            let fullPath = this.rootpath + path;

            if (!FileLib.exists(this.module, fullPath)) {
                ChatLib.chat(Prefix + `&cFile not found: &e${path}&c. Creating a new file.`);
                FileLib.write(this.module, fullPath, "[]", true);
            }

            let data = FileLib.read(this.module, fullPath);
            if (!data) {
                ChatLib.chat(Prefix + `&cFile is empty: &e${path}&c. Initializing empty configuration.`);
                data = "[]";
            }

            let parsed = JSON.parse(data);
            this.loadedConfigs[path] = parsed.map(nodeData => Node.fromJSON(nodeData));

            ChatLib.chat(Prefix + `&aConfig loaded: &e${path}`);
        } catch (error) {
            ChatLib.chat(Prefix + `&aError loading config &e${path}&a: &c${error}`);
        }
    }

    setActiveConfig(path) {
        try {
            if (!path.endsWith(".json")) path += ".json";

            if (!this.loadedConfigs[path]) {
                ChatLib.chat(Prefix + `&cConfig &e${path}&c is not loaded. Attempting to load or create it.`);
                this._loadConfig(path);
            }

            if (!this.loadedConfigs[path]) {
                ChatLib.chat(Prefix + `&cFailed to load or create config: &e${path}`);
                return;
            }

            this.activeConfig = path;
            this.nodes = this.loadedConfigs[path];
            this.nextId = this.nodes.reduce((max, node) => Math.max(max, node.id), 0) + 1;

            ChatLib.chat(Prefix + `&aActive configuration set to: &e${path}`);
        } catch (error) {
            ChatLib.chat(Prefix + `&cError setting active config: &e${path}&c. ${error}`);
        }
    }

    unloadConfig(path) {
        if (this.activeConfig === path) {
            this.activeConfig = null;
            this.nodes = [];
        }
        delete this.loadedConfigs[path];
    }

    unloadAllConfigs() {
        this.loadedConfigs = {};
        this.activeConfig = null;
        this.nodes = [];
    }

    renderNodes() {
        for (let key in this.loadedConfigs) {
            for (let i = 0; i < this.loadedConfigs[key].length; i++) {
                let node = this.loadedConfigs[key][i];
                RenderLib.drawEspBox(
                    node.x,
                    node.y + 0.01,
                    node.z,
                    node.width,
                    1,
                    0, 1, 1,
                    1,
                    false
                );
            }
        }
    }

checkProximity(eventType = null) {
    const playerX = Player.getX();
    const playerY = Player.getY();
    const playerZ = Player.getZ();

    for (let key in this.loadedConfigs) {
        for (let i = 0; i < this.loadedConfigs[key].length; i++) {
            const node = this.loadedConfigs[key][i];

            // Check if the player is inside the node's box
            if (isPlayerInsideBox(playerX, playerZ, playerY, node.x, node.z, node.y, node.width)) {
                // Execute actions for the specified event type
                node.executeActions(eventType);
            }
        }
    }
}

checkProximity(eventType = null) {
    const playerX = Player.getX();
    const playerY = Player.getY();
    const playerZ = Player.getZ();

    for (let key in this.loadedConfigs) {
        for (let i = 0; i < this.loadedConfigs[key].length; i++) {
            let node = this.loadedConfigs[key][i];

            // Check if the player is inside the node's box
            if (isPlayerInsideBox(playerX, playerZ, playerY, node.x, node.z, node.y, node.width)) {
                // Execute actions for the specified event type
                node.executeActions(eventType);
            }
        }
    }
}


    addNode(x, y, z, width) {
        if (!this.activeConfig) {
            ChatLib.chat(Prefix + "&cNo active configuration. Set an active config first.");
            return;
        }
        let node = new Node(x, y, z, width, this.nextId++);
        this.loadedConfigs[this.activeConfig].push(node);
        this._saveNodes();
        ChatLib.chat(Prefix + `&aNode added at &c(${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})&a with width &c${width}.`);
        return node;
    }

    findClosestNode() {
        let playerX = Player.getX();
        let playerY = Player.getY();
        let playerZ = Player.getZ();
        let closest = null;
        let minDist = Infinity;

        for (let key in this.loadedConfigs) {
            for (let i = 0; i < this.loadedConfigs[key].length; i++) {
                let node = this.loadedConfigs[key][i];
                let dist = Math.sqrt(
                    Math.pow(node.x - playerX, 2) +
                    Math.pow(node.y - playerY, 2) +
                    Math.pow(node.z - playerZ, 2)
                );
                if (dist < minDist) {
                    closest = node;
                    minDist = dist;
                }
            }
        }
        return closest;
    }

    _saveNodes() {
        if (!this.activeConfig) {
            ChatLib.chat(Prefix + "&cNo active config to save.");
            return;
        }
        try {
            let fullPath = this.rootpath + this.activeConfig;
            let data = JSON.stringify(this.loadedConfigs[this.activeConfig].map(node => node.toJSON()), null, 2);
            FileLib.write(this.module, fullPath, data);
        } catch (error) {
            ChatLib.chat(Prefix + `&aError saving nodes: &c${error}`);
        }
    }
};
