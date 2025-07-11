
import { registerWhen } from "../../../BloomCore/utils/Utils";
import Settings from "../../config";
import overlayUtils from "../utils/overlayUtils";

const KeyBoard = Java.type("org.lwjgl.input.Keyboard");
const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding");
const KeyInputEvent = Java.type("net.minecraftforge.fml.common.gameevent.InputEvent$KeyInputEvent");
const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");
const C0DPacketCloseWindow = Java.type("net.minecraft.network.play.client.C0DPacketCloseWindow")
const S2EPacketCloseWindow = Java.type("net.minecraft.network.play.server.S2EPacketCloseWindow")
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")

function resetStuff() {
    Object.values(keybinds).forEach(keybind => KeyBinding.func_74510_a(keybind, KeyBoard.isKeyDown(keybind)))
    inMelody = false
    lastClick = 0
    lastClickTicks = 0
}

const keybinds = {
    forward: Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(),
    left: Client.getMinecraft().field_71474_y.field_74370_x.func_151463_i(),
    right: Client.getMinecraft().field_71474_y.field_74366_z.func_151463_i(),
    back: Client.getMinecraft().field_71474_y.field_74368_y.func_151463_i(),
};

let inMelody = false
let lastClick = 0
let lastClickTicks = 0
let currentTick

const GuiChest = Java.type("net.minecraft.client.gui.inventory.GuiChest");

register("worldUnload", () => {
inMelody = false
})

register("tick", (ticks) => {
    if (!Settings().MelodyInvwalk) return;
    currentTick = ticks
    if (!inMelody) return;

    if ((currentTick - lastClickTicks) === +Settings.WASDdelay) {
        if ((((lastClick - Date.now()) + +Settings.WASDdelay * 50) > 15)) {
            lastClickTicks++
            return;
        }

        Object.values(keybinds).forEach(keybind => KeyBinding.func_74510_a(keybind, KeyBoard.isKeyDown(keybind)))
    }
})

register(KeyInputEvent, () => {
    if (!Settings().MelodyInvwalk) return;
    if (!inMelody) return;

    if (((currentTick - lastClickTicks) < +Settings.WASDdelay) && (((lastClick - Date.now()) + +Settings.WASDdelay * 50) > 15)) {
        Object.values(keybinds).forEach(keybind => KeyBinding.func_74510_a(keybind, false));
    }
});

register("packetSent", () => {
    if (!Settings().MelodyInvwalk) return;
    if (!inMelody) return;

    Object.values(keybinds).forEach(keybind => KeyBinding.func_74510_a(keybind, false));
    lastClick = Date.now()
    lastClickTicks = currentTick
}).setFilteredClass(C0EPacketClickWindow)

register("packetSent", () => {
    if (!Settings().MelodyInvwalk) return;
    if (inMelody) resetStuff()
}).setFilteredClass(C0DPacketCloseWindow)

register("packetReceived", () => {
    if (!Settings().MelodyInvwalk) return;
    if (inMelody) resetStuff()
}).setFilteredClass(S2EPacketCloseWindow)

register("packetReceived", (packet) => {
    if (!Settings().MelodyInvwalk) return;

    const title = ChatLib.removeFormatting(packet.func_179840_c().func_150254_d());
    const melodyMatch = title.match(/^Click the button on time!$/);

    if (melodyMatch !== null) {
        inMelody = true;
    } else {
        inMelody = false;
        lastClick = 0
        lastClickTicks = 0
    }
}).setFilteredClass(S2DPacketOpenWindow)

registerWhen(register(net.minecraftforge.client.event.RenderWorldLastEvent, () => {

    if ((Client.getMinecraft().field_71462_r instanceof GuiChest)) {
        Client.getMinecraft().func_147108_a(null)
    }
    
}), () => inMelody && Settings().MelodyInvwalk)


registerWhen(register("renderOverlay", () => {
    let text = "&4In Melody";

    const timeUntilMove = ((lastClick - Date.now()) + +Settings.WASDdelay * 50)

    if (timeUntilMove > 0) {
        text += ` &a(${(timeUntilMove / 1000).toFixed(2)}s)`
    }

    const scale = 1;
    Renderer.scale(scale);
    Renderer.drawStringWithShadow(text, (Renderer.screen.getWidth() / scale - Renderer.getStringWidth(text)) / 2, Renderer.screen.getHeight() / scale / 2 + 8);

    if (!Settings().melodyProgress) return;

    let text2
    if (Player?.getContainer()?.getItems()[25]?.getMetadata() == 5) text2 =  "&41/4"
    if (Player?.getContainer()?.getItems()[34]?.getMetadata() == 5) text2 =  "&42/4"
    if (Player?.getContainer()?.getItems()[43]?.getMetadata() == 5) text2 =  "&43/4"
    if (!text2) text2 = "&40/4"

    Renderer.drawStringWithShadow(text2, (Renderer.screen.getWidth() / scale - (Renderer.getStringWidth(text2))) / 2, Renderer.screen.getHeight() / scale / 2 + 19);
}), () => inMelody && Settings().MelodyInvwalk)