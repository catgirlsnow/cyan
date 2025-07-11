 import Settings from "../../config";


register("chat", (player, event) => {
    if (!Settings().LeapMessage) return;
    
    ChatLib.command("pc Leaped to " + player)
   
  }).setCriteria(/^You have teleported to (\w+)!$/)