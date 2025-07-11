import Settings from "../../config";



register("playerInteract", (action, vector3d, event) => {
	if (!Settings().NoInteract) return;
    if (action.toString() !== "RIGHT_CLICK_BLOCK") return;
		if (Player?.getHeldItem()?.getName()?.includes("Ender Pearl")) {
			cancel(event)
		}	
})