import Settings from "../../config";
import {getDistanceToCoord} from  "../../../BloomCore/utils/Utils"

const ssStandPos = [108.63, 120, 94]
const standingAtSS = () => getDistanceToCoord(...ssStandPos) < 1.8
const fourStandPos = [63.5, 127, 35.5]
const standingAt4Dev = () => getDistanceToCoord(...fourStandPos) < 1.8

const EntityPlayer = Java.type("net.minecraft.entity.player.EntityPlayer")
let isRegistered = false

register("tick", () => {
  if (!Settings().hidePlayerDevs) return;

  const shouldRegister = standingAtSS() || standingAt4Dev();
  if (shouldRegister && !isRegistered) {
    isRegistered = true;
    cancelRender.register();
  } else if (!shouldRegister && isRegistered) {
    isRegistered = false;
    cancelRender.unregister();
  }
});

const cancelRender = register("renderEntity", (entity) => {
  const mcEntity = entity.getEntity()
  if (entity.getUUID().toString()[14] == "2" || entity.getName() == Player.getName()) return;
  mcEntity.func_70107_b(entity.getX(), entity.getY()+99999, entity.getZ())
}).setFilteredClass(EntityPlayer).unregister()

