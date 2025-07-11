import Settings from "../../config";
import petUtils from "../utils/petUtils";
import { getClass, getFloor } from "../utils/utils";


register("chat", () => {
    if (!Settings().BloodPet) return;
    const playerClass = getClass()
    if (!playerClass.includes("Mage") || getFloor() !== "M7") return;

    petUtils.queuePet("cat")

}).setCriteria("The BLOOD DOOR has been opened!")

