const prefix = "&8[&3Cyan&8] ";

register("command", (user) => {
    if (!user) {
        user = Player.getName();
    }
    const cryptClickable = new TextComponent(prefix + "&aClick to open &c" + user + "&a's SkyCrypt").setClick("open_url", "https://sky.shiiyu.moe/stats/" + user);
    ChatLib.chat(cryptClickable);
}).setName("crypt");

 