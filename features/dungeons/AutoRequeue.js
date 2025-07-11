import Settings from "../../config";
const prefix = "&8[&3Cyan&8] ";
let DT 

register("chat", (message) => {
    if (!Settings().AutoRequeue) return;
    if (DT) {
        DT = false
        return;
    }

    const downtime = (isNaN(parseInt(Settings.requeueTime)) ? 10 : parseInt(Settings.requeueTime)) * 1000
    ChatLib.chat(prefix + "&aRequeuing in " + downtime/1000 + "s")

    setTimeout(() => {
        ChatLib.command("instancerequeue")
    }, downtime);
  }).setCriteria(/^\s*> EXTRA STATS \s*<\s*$/)
  
  
register("command", (user) => {
    ChatLib.chat(prefix + "&cAutoRequeue Disabled")
    DT = true
}).setName("dt").setAliases("downtime");