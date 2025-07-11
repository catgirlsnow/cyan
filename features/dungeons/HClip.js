import { Prefix, KeyBinding, stopWalk } from "../utils/utils"; 


export const clip = (direction = Player.getYaw(), speedMultiplier = 2.7) => {
    ChatLib.chat(`${Prefix}${"Clipping!"}`);

    let speed = Player.getPlayer().field_71075_bZ.func_75094_b() * speedMultiplier;
    const radians = direction * Math.PI / 180
    const x = -Math.sin(radians) * speed
    const z = Math.cos(radians) * speed

    stopWalk()
    Player.getPlayer().func_70016_h(0, Player.getPlayer().field_70181_x, 0)

    Client.scheduleTask(0, () => {
        Player.getPlayer().func_70016_h(x, Player.getPlayer().field_70181_x, z)
        KeyBinding.func_74510_a(forward, (Keyboard.isKeyDown(forward)))
    })
}

register("command", () => {
    clip()
}).setName("hclip")