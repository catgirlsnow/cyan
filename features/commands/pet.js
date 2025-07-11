import Settings from "../../config";
import petHelper from "../utils/petUtils"

register("command", (arg) => {
    petHelper.queuePet(arg)
}).setName("/pet")