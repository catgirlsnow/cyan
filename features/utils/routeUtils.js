// import RenderLib from "RenderLib";
// import { Prefix, doJump, getDistance3D, snapTo } from "./utils";
// import Settings from "../../../Amaterasu/core/Settings";
// import { clip } from "../dungeons/HClip";

// export default new class routeHandler {
//     constructor() {
//         this.module = "Cyan";
//         this.path = "data/routes.json";
//         this.closestNodes = [];
//         this.allNodes = [];
//         this.nextId = 1;
//         this.cooldownRoute = []
//         this.editMode = false

//         register("worldLoad", () => {
//             this._loadRoutes();
//         });

//         register("renderWorld", () => {
//             this._renderNodes();
//         });

//         register("step", () => {            
//             this._updateClosestNodes()
//         }).setDelay(1)

//         register("step", () => {
//             this._checkProximity()
//         })

//         register("chat", (player, event) => {
//             this._updateClosestNodes()
//         }).setCriteria(/^You have teleported to (\w+)!$/)

//     }

//     _handleRoute(route) {
//         if (this.editMode) return; 
//         switch (route.type) {
//             case 'hclip':
//                 const {dist} = route.data
//                 clip(dist)
                
//                 break;
//             case 'rotate':
//                 const { yaw, pitch } = route.data;

//                 snapTo(yaw, pitch)
//                 break;
//             case 'jump':
//                 doJump()

//                 break;
//             case 'command':
//                 const { command } = route.data;
//                 ChatLib.chat(command)
//                 Player.getPlayer().func_71165_d(command)
//                 break;
//         //     default:
//         //         ChatLib.chat(Prefix + "&c Unknown route type: " + route.type);
//         //         break;
//         }
//     }

//     _validateRoute(route) {
//         const { type, data } = route;
//         switch (type) {
//             case 'hclip':
//                 return true; 
//             case 'rotate':
//                 return data && typeof data.pitch === 'number' && typeof data.yaw === 'number';
//             case 'command':
//                 return data && typeof data.command === 'string';
//             case 'jump':
//                 return true
//             default:
//                 return false; 
//         }
//     }

//     _updateClosestNodes() {
//         const playerX = Player.getX();
//         const playerY = Player.getY();
//         const playerZ = Player.getZ();

//         let distances = this.allNodes.map(node => {
//             let { x, y, z } = node;
//             let distance = getDistance3D(playerX, playerY, playerZ, x, y, z);
//             return { node, distance };
//         });


//         distances.sort((a, b) => a.distance - b.distance);


//         this.closestNodes = distances.slice(0, 25).map(item => item.node);

//     }

//     _checkProximity() {
//         const playerX = Player.getX();
//         const playerY = Player.getY();
//         const playerZ = Player.getZ();
//         const radius = 1.5;

//         for (let node of this.closestNodes) {
//             let { x, y, z, id } = node;
//             let distance = getDistance3D(playerX, playerY, playerZ, x, y, z);
//             if (distance <= radius) {
//                 if (!this.cooldownRoute.includes(id)) {
//                     this.cooldownRoute.push(id);
//                     this._handleRoute(node);
//                     Client.scheduleTask(20, () => {
//                         this.cooldownRoute.shift()
//                     })
//                 }
//             }
//         }

//     }


//     _saveRoutes() {
//         try {
//             const data = JSON.stringify(this.allNodes);
//             FileLib.write(this.module, this.path, data);
//             ChatLib.chat(Prefix + "&a Routes saved successfully.");
//         } catch (error) {
//             ChatLib.chat(Prefix + "&c Error saving routes: " + error);
//         }
//     }

//     _loadRoutes() {
//         try {
//             const data = FileLib.read(this.module, this.path);
//             if (data) {
//                 this.allNodes = JSON.parse(data);
//                 // ChatLib.chat(Prefix + "&a Routes loaded successfully.");
//                 const maxId = this.allNodes.reduce((max, route) => Math.max(max, route.id), 0);
//                 this.nextId = maxId + 1;
//             }
//         } catch (error) {
//             ChatLib.chat(Prefix + "&c Error loading routes: " + error);
//         }
//     }

//     _generateId() {
//         return this.nextId++;
//     }
//     _renderNodes() {
//         for (let i = 0; i < this.allNodes.length; i++) {
//             let node = this.allNodes[i];
//             let { x, y, z } = node;
    
//             if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
//                 RenderLib.drawCyl(x, y + 0.01, z, 1.2, 1.2, 0.01, 50, 1, 90, 0, 0, 0, 0, 1, 1, false, true);
//             } else {
//                 ChatLib.chat(Prefix + "&c Invalid node data: " + JSON.stringify(node));
//             }
//         }
//     }
    

//     addRoute(route) {
//         route.id = this._generateId();

//         const isValid = this._validateRoute(route);
//         if (isValid) {
//             this.allNodes.push(route);
//             this._saveRoutes(); // Call _saveRoutes to save the route
//             ChatLib.chat(Prefix + "&a Route added: " + JSON.stringify(route));
//         } else {
//             ChatLib.chat(Prefix + "&c Invalid route: " + JSON.stringify(route));
//         }
//     }

//     removeRoute() {
//         const playerX = Player.getX();
//         const playerY = Player.getY();
//         const playerZ = Player.getZ();

//         let closestDistance = Infinity;
//         let closestRouteIndex = -1;

//         for (let i = 0; i < this.allNodes.length; i++) {
//             let { x, y, z } = this.allNodes[i];
//             let distance = getDistance3D(playerX, playerY, playerZ, x, y, z);

//             if (distance < closestDistance) {
//                 closestDistance = distance;
//                 closestRouteIndex = i;
//             }
//         }

//         if (closestRouteIndex !== -1) {
//             const removedRoute = this.allNodes.splice(closestRouteIndex, 1)[0];
//             this._saveRoutes();
//             ChatLib.chat(Prefix + "&a Route removed: " + JSON.stringify(removedRoute));
//         } else {
//             ChatLib.chat(Prefix + "&c No routes to remove.");
//         }
//     }

//     toggleEM() {
//         this.editMode = !this.editMode
//         ChatLib.chat(`${Prefix} &aEdit mode set to ${this.editMode ? "&aEnabled" : "&cDisabled"}.`)
//     }
// };
