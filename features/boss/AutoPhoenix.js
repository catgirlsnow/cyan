import Settings from "../../config";
import petHelper from "../utils/petUtils"
import { Prefix } from "../utils/utils";

let lastequip = 0

register("chat", (message) => {
	if (!Settings().AutoPhoenix) return;
	if (Date.now() - lastequip < 5000) return;

	petHelper.queuePet("phoenix")
	lastequip = Date.now()
	
}).setCriteria(/^Your (?:⚚ )?Bonzo's Mask saved your life!$/)
