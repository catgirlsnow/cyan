// Make sure these go to the right directory 
import Settings from "../Amaterasu/core/Settings"
import DefaultConfig from "../Amaterasu/core/DefaultConfig"
const config = new DefaultConfig("Cyan", "data/settings.json")

config
.addSwitch({
    category: "Dungeons",
    configName: "AutoCamp",
    title: "Auto Camp",
    description: "Automatically Blood Camp after dialogue skip",
    subcategory: "BloodCamp"
})
.addSwitch({
    category: "Dungeons",
    configName: "CampHelper",
    title: "Blood Camp Helper",
    description: "Show where blood mobs will spawn",
    subcategory: "BloodCamp"
})
.addSlider({
    category: "Dungeons",
    configName: "CampDelay",
    title: "Auto Camp Delay",
    description: "Delay before hitting",
    subcategory: "BloodCamp",
    options: [0, 5],
    value: 1
})
.addSwitch({
    category: "Dungeons",
    configName: "LeverAura",
    title: "Lever Aura",
    description: "Automatically flick levers in P3",
    subcategory: "Aura"
})
.addSwitch({
    category: "Dungeons",
    configName: "LeapMessage",
    title: "Leap Message",
    description: "Announces Leaps",
    subcategory: "General"
})
.addSwitch({
    category: "Dungeons",
    configName: "BloodPet",
    title: "Blood open pet",
    description: "Select black cat on blood open when Mage in M7",
    subcategory: "General"
})
.addSwitch({
    category: "Dungeons",
    configName: "NoInteract",
    title: "No Interact",
    description: "No pearl interact",
    subcategory: "General"
})
.addSwitch({
    category: "Dungeons",
    configName: "InvincibleTimer",
    title: "Invincibility Timer",
    description: "Displays immunity timer provided by bonzo mask and phoenix pet above crosshair",
    subcategory: "General"
})
.addSwitch({
    category: "Dungeons",
    configName: "procMessage",
    title: "Proc Message",
    description: "Announces in party chat when you proc an invincibility item",
    subcategory: "General"
})
.addSwitch({
    category: "Dungeons",
    configName: "stormTimer",
    title: "Storm Timer",
    description: "Counts down time until terminals start",
    subcategory: "General"
})
.addSwitch({
    category: "Dungeons",
    configName: "AutoRequeue",
    title: "Auto Requeue",
    description: "Automatically Requeues into the next dungeon",
    subcategory: "Requeue"
})
.addTextInput({
    category: "Dungeons",
    configName: "requeueTime",
    title: "Requeue Downtime",
    description: "Downtime between autorequeue",
    value: "10",
    placeHolder: "10",
    subcategory: "Requeue"
})
.addSwitch({
    category: "Dungeons",
    configName: "termAC",
    title: "Term Auto Clicker",
    description: "Automatically clicks between 4-5 cps when holding down right click with terminator",
    subcategory: "AC"
})
.addSwitch({
    category: "Boss",
    configName: "witherESP",
    title: "Wither ESP",
    description: "Draw a box around withers",
    subcategory: "ESP"
})
.addSwitch({
    category: "Boss",
    configName: "AutoRag",
    title: "Auto Ragnarock",
    description: "Auto Rag for Wither King",
    subcategory: "Ragnarock"
})
.addSwitch({
    category: "Boss",
    configName: "RelicTriggerbot",
    title: "Relic Triggerbot",
    description: "Automatically pick up relics when looking at one",
    subcategory: "Relics"
})
.addSwitch({
    category: "Boss",
    configName: "DragonTimer",
    title: "Dragon Timer",
    description: "Serverside timer till dragon spawn",
    subcategory: "P5"
})
.addSwitch({
    category: "Boss",
    configName: "RelicLook",
    title: "Relic Look",
    description: "Headsnaps on orange or red towards cauldron",
    subcategory: "Relics"
})
.addSwitch({
    category: "Boss",
    configName: "RunMid",
    title: "Relic Run",
    description: "Run to mid after placing relic",
    subcategory: "Relics"
})
.addSwitch({
    category: "Boss",
    configName: "AutoPhoenix",
    title: "Auto Phoenix",
    description: "Auto equip Phoenix in P3",
    subcategory: "P3"
})
.addSwitch({
    category: "Boss",
    configName: "AutoGoldor",
    title: "Automatic Goldor",
    description: "Automatically shoot Goldor",
    subcategory: "P3"
})
.addSwitch({
    category: "Boss",
    configName: "AutoP4",
    title: "Automatic P4",
    description: "Automatically shoot Necron and leap down",
    subcategory: "P4"
})
.addSwitch({
    category: "Boss",
    configName: "AutoCat",
    title: "Auto Black Cat",
    description: "Equip Black Cat after leaping to healer",
    subcategory: "P4"
})
.addSwitch({
    category: "Boss",
    configName: "AutoRunRelic",
    title: "Auto Relic",
    description: "Run towards your relic after leaping down",
    subcategory: "P4"
})
.addSwitch({
    category: "Devices",
    configName: "hidePlayerDevs",
    title: "Hide Players",
    description: "Hide Players on SS and 4th dev",
    subcategory: "General"
})
.addSwitch({
    category: "Devices",
    configName: "AutoArrow",
    title: "Toggle Auto 4",
    description: "Toggle",
    subcategory: "Auto 4"
})
.addSwitch({
    category: "Devices",
    configName: "Pre4ToggleLeap",
    title: "Pre4 Auto Leap",
    description: "Toggle",
    subcategory: "Auto 4"
})
.addTextInput({
    category: "Devices",
    configName: "Pre4IGNLeap",
    title: "Pre4 Auto Leap",
    description: "Leap to IGN / Class",
    value: "",
    placeHolder: "",
    subcategory: "Auto 4"
})
.addSwitch({
    category: "Devices",
    configName: "Pre4LeapMelody",
    title: "Auto Leap to Melody",
    description: "Toggle",
    subcategory: "Auto 4"
})
.addSwitch({
    category: "Devices",
    configName: "AutoPrefire",
    title: "Auto Prefire",
    description: "Toggle Prefire (useless unless high ping)",
    subcategory: "Auto 4"
})
.addSwitch({
    category: "Terminals",
    configName: "ForceP3",
    title: "Force P3",
    description: "Will disregard in P3 checks",
    subcategory: "General"
})
.addSwitch({
    category: "Terminals",
    configName: "TerminalAura",
    title: "Terminal Aura",
    description: "Automatically opens terminals near you",
    subcategory: "Aura"
})
.addSwitch({
    category: "Terminals",
    configName: "TerminalTriggerbot",
    title: "Terminal Triggerbot",
    description: "Click on terminal you are looking at.",
    subcategory: "Triggerbot"
})
.addSwitch({
    category: "Terminals",
    configName: "AutoTerm",
    title: "Auto Terms",
    description: "Automatically completes terminals for you",
    subcategory: "Auto"
})
.addSlider({
    category: "Terminals",
    configName: "ClickDelay",
    title: "Click Delay",
    description: "Delay in ms terminals",
    subcategory: "Auto",
    options: [50, 300],
    value: 140
})
.addSlider({
    category: "Terminals",
    configName: "FirstClickDelay",
    title: "First Click Delay",
    description: "First click delay",
    subcategory: "Auto",
    options: [300, 500],
    value: 310
})
.addSlider({
    category: "Terminals",
    configName: "BreakThreshold",
    title: "Break Threshold",
    description: "Fix time",
    subcategory: "Auto",
    options: [500, 1500],
    value: 500
})

.addSwitch({
    category: "Terminals",
    configName: "AutoMelody",
    title: "Melody",
    description: "Toggle Auto Melody",
    subcategory: "Melody"
})
.addSwitch({
    category: "Terminals",
    configName: "MelodySkip",
    title: "Melody",
    description: "Toggle Auto Melody Skip",
    subcategory: "Melody"
})
.addSwitch({
    category: "Terminals",
    configName: "FirstSlotMelody",
    title: "First Slot Melody",
    description: "Don't skip on the first slot of Melody",
    subcategory: "Melody"
})
.addSwitch({
    category: "Terminals",
    configName: "TerminalInvwalk",
    title: "Invwalk",
    description: "Enable moving in terminals",
    subcategory: "Invwalk"
})
.addSwitch({
    category: "Terminals",
    configName: "MelodyInvwalk",
    title: "Melody Invwalk",
    description: "Enable moving in melody",
    subcategory: "Melody Invwalk"
})
.addTextInput({
    category: "Terminals",
    configName: "WASDdelay",
    title: "Melody Move Delay",
    description: "Ticks you cant move after clicking in melody, recommended is 6 ticks but use higher if your getting limboed",
    value: "",
    placeHolder: "",
    subcategory: "Melody Invwalk"
})
.addSwitch({
    category: "Terminals",
    configName: "melodyProgress",
    title: "Show Melody Progres",
    description: "Display melody progress",
    subcategory: "Melody Invwalk"
})
.addSwitch({
    category: "FastLeap",
    configName: "FastLeap",
    title: "Fast Leap",
    description: "Left click to leap",
    subcategory: "Fast Leap"
})
.addSwitch({
    category: "FastLeap",
    configName: "DoorOpener",
    title: "Last Door",
    description: "Fast leap to last door opener",
    subcategory: "Fast Leap"
})
.addSwitch({
    category: "FastLeap",
    configName: "PositionalFastLeap",
    title: "P3 Leap",
    description: "Customizable P3 Fast Leap",
    subcategory: "Fast Leap"
})
.addTextInput({
    category: "FastLeap",
    configName: "S1Leap",
    title: "S1 Leap",
    description: "Leap to this player in S1",
    value: "",
    placeHolder: "",
    subcategory: "Leap"
})
.addTextInput({
    category: "FastLeap",
    configName: "S2Leap",
    title: "S2 Leap",
    description: "Leap to this player in S2",
    value: "",
    placeHolder: "",
    subcategory: "Leap"
})
.addTextInput({
    category: "FastLeap",
    configName: "S3Leap",
    title: "S3 Leap",
    description: "Leap to this player in S3",
    value: "",
    placeHolder: "",
    subcategory: "Leap"
})
.addTextInput({
    category: "FastLeap",
    configName: "S4Leap",
    title: "S4 Leap",
    description: "Leap to this player in S4",
    value: "",
    placeHolder: "",
    subcategory: "Leap"
})

.addSwitch({
    category: "Chest Looter",
    configName: "ChestLooter",
    title: "Chest Looter",
    description: "Automatically loot chests on dungeon end",
    subcategory: "General"
})
.addSwitch({
    category: "Chest Looter",
    configName: "useKismet",
    title: "Use Kismets",
    description: "Reroll in F7 & M7",
    subcategory: "General"
})
.addSwitch({
    category: "Chest Looter",
    configName: "useChestKey",
    title: "Use Dungeon Chest Keys",
    description: "Open a second chest",
    subcategory: "General"
})
.addTextInput({
    category: "Chest Looter",
    configName: "rerollThreshold",
    title: "Reroll Threshold",
    description: "Reroll Threshold",
    value: "",
    placeHolder: "",
    subcategory: "Settings"
})
.addTextInput({
    category: "Chest Looter",
    configName: "ChestKeyThreshold",
    title: "Chest Key Threshold",
    description: "Reroll Threshold",
    value: "",
    placeHolder: "",
    subcategory: "Settings"
})
.addSwitch({
    category: "Chest Looter",
    configName: "looterDebug",
    title: "Looter Debug Messages",
    description: "Looter Debug Messages",
    subcategory: "Settings"
})




const setting = new Settings("Cyan", config, "data/scheme-nwjn.json") // make sure to set your command with [.setCommand("commandname")]

export default () => setting.settings