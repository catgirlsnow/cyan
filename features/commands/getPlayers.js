register("command", () => {

    World.getAllPlayers().forEach((pl) => {
        if (pl.getUUID().toString()[14] === "2") return;
        ChatLib.chat(pl.getName())
    })
    
}).setCommandName("getplayers")