import { registerWhen } from "../../../BloomCore/utils/Utils";
import Settings from "../../config";
import overlayUtils from "../utils/overlayUtils";
const phoenixCooldown = 3000; 
const bonzoCooldown = 3000; 
let phoenixProc = false;
let phoenixProcced = 0;
let bonzoProc = false;
let bonzoProcced = 0;
let timeRemaining = 0;

register("chat", (message) => {
  if (!Settings().InvincibleTimer) return;

  bonzoProc = true;
  bonzoProcced = new Date().getTime();
  
  if (!Settings().procMessage) return
  ChatLib.command("pc Bonzo Procced")
  shouldPhoenix = true

}).setCriteria(/^Your (?:⚚ )?Bonzo's Mask saved your life!$/)

register("chat", (message) => {
  if (!Settings().InvincibleTimer) return;

  phoenixProc = true;
  phoenixProcced = new Date().getTime();

  if (!Settings().procMessage) return
  ChatLib.command("pc Phoenix Procced")

}).setCriteria("Your Phoenix Pet saved you from certain death!")


registerWhen(register("renderOverlay", () => {

  const currentTime = new Date().getTime();

  if (!(phoenixProc || bonzoProc)) return;
    const procTime = phoenixProc ? phoenixProcced : bonzoProcced;
    const cooldown = phoenixProc ? phoenixCooldown : bonzoCooldown;
    const duration = currentTime - procTime;

    if (duration > cooldown) {
      phoenixProc = bonzoProc = false;
    } else {
      timeRemaining = (cooldown - duration) / 1000;
    }

  if (timeRemaining < 0.1) return;


  Renderer.scale(1);
  Renderer.drawString('&f' + timeRemaining.toFixed(1), (Renderer.screen.getWidth() - Renderer.getStringWidth(timeRemaining.toFixed(1)))  / 2, 255, true);
  
}), () => Settings().InvincibleTimer && (phoenixProc || bonzoProc))




registerWhen(register("renderOverlay", () => {
    const currentTime = new Date().getTime();

    const procTime = phoenixProc ? phoenixProcced : bonzoProcced;
    const cooldown = phoenixProc ? phoenixCooldown : bonzoCooldown;
    const duration = currentTime - procTime;

    if (duration > cooldown) {
      phoenixProc = bonzoProc = false;
    } else {
      timeRemaining = (cooldown - duration) / 1000;
    }

    if (timeRemaining < 0.1) return;

    Renderer.scale(1);
    Renderer.drawString('&f' + timeRemaining.toFixed(1), (Renderer.screen.getWidth() - Renderer.getStringWidth(timeRemaining.toFixed(1))) / 2, 255, true);
  }), () => Settings().InvincibleTimer && (phoenixProc || bonzoProc));
