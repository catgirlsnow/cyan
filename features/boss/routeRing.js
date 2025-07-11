// import routeHandler from "../utils/routeUtils"


// register("command", (...args) => {
//     if (!args.length) return;

//     if (args[0] === "add") {
//         const x = Player.getX();
//         const y = Player.getY();
//         const z = Player.getZ();
//         let data = {};

//         if (args[1] === "hclip") {
//             data.dist = args[2]
//             const route = { type: "hclip", data, x, y, z };
//             routeHandler.addRoute(route);
//         } else if (args[1] === "rotate") {
//             data.yaw = parseFloat(args[2]);
//             data.pitch = parseFloat(args[3]);
//             const route = { type: "rotate", data, x, y, z };
//             routeHandler.addRoute(route);
//         } else if (args[1] === "command") {
//             data.command = args.slice(2).join(" ");
//             const route = { type: "command", data, x, y, z };
//             routeHandler.addRoute(route);
//         } else if (args[1] === "jump") {
//             const route = { type: "jump", data, x, y, z}
//             routeHandler.addRoute(route)
//         }
        
//         else {
//             ChatLib.chat("Invalid route type.");
//         }
//     } else if (args[0] === "remove") {
//         routeHandler.removeRoute();
//     } else if (args[0] === "em") {
//         routeHandler.toggleEM()
//     }
// }).setName("route");


