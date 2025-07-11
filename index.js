import Settings from "./config";

import "./features/boss/AutoP5"
import "./features/boss/AutoP4"
import "./features/boss/AutoPhoenix"
import "./features/boss/AutoRagnarock"
import "./features/boss/WitherESP"
import "./features/boss/RelicLook"
import "./features/boss/routeRing"


import "./features/commands/CalculateTax"
import "./features/commands/Crypt"
import "./features/commands/realban"
import "./features/commands/getPlayers"
import "./features/commands/pet"

import "./features/devices/Auto4"
import "./features/devices/HidePlayers"
// import "./features/devices/Terror4"

import "./features/dungeons/AutoRequeue"
import "./features/dungeons/InvincibilityTimer"
import "./features/dungeons/LeapMessage"
import "./features/dungeons/LeverAura"
import "./features/dungeons/NoInteract"
import "./features/dungeons/StormTimer"
import "./features/dungeons/TermAC"
import "./features/dungeons/FastLeap"
import "./features/dungeons/HClip"
import "./features/dungeons/BloodPet"
import "./features/dungeons/ClearDoor"
import "./features/dungeons/BloodHelper"

import "./features/chestlooter/ChestLooter"

import "./features/terminals/AutoTerms"
import "./features/terminals/AutoMelody"
import "./features/terminals/MelodyInvwalk"
import "./features/terminals/TerminalAura"
import "./features/terminals/TerminalTriggerbot"

import "./features/utils/autoP3"

import "./features/test"

register("command", () => {
    Settings().getConfig().openGui()

}).setName("Cyan");


