import { Forward, Jump, calcYawPitch, getDistance2D, snapTo } from "./utils";

export default new class Pathfinder {
    constructor() {
        this.pathFind = false;
        this.pathQueue = [];
        this.currentPath = []

        register("step", () => {
            if (!this._inQueue()) return;


            let [yaw, apitch] = calcYawPitch({ x: this.currentPath[0], y: this.currentPath[1], z: this.currentPath[2] });

            let pitch = Player.getPitch()
            if (!this.currentPath[6]) {
                pitch = apitch
            }

            if (this.currentPath[3]) { 
                pitch = 18;
            }

            snapTo(yaw, pitch);
        });

        register("tick", () => {
            if (!this._inQueue()) return;

            const playerX = Player.getX();
            const playerZ = Player.getZ();
            const targetX = this.currentPath[0];
            const targetZ = this.currentPath[2];

            if (getDistance2D(playerX, playerZ, targetX, targetZ) < 1.5) {
                this.finishPath();
                return;
            }

            Forward.setState(true);

            if (!this.currentPath[3]) return; 

            const lookingAt = Player.lookingAt();
            if (!lookingAt) return;

            if (lookingAt instanceof Block) {
                Jump.setState(true);
            } else {
                Jump.setState(false);
            }

        });
    }

    _inQueue() {
        return this.pathQueue.length > 0;
    }

    _handlePath() {
        this.currentPath = this.pathQueue[0]
    }

    finishPath() {
        if (this.currentPath[4]) { 
            snapTo(this.currentPath[5][0], this.currentPath[5][1]);
        }

        this.pathQueue.shift()
        this._handlePath()

        Forward.setState(false);
        Jump.setState(false);
    }

    addPath(x, y, z, shouldJump = false, shouldSnap = false, yawPitch = [0, 0], ignoreY = true) {
        this.pathQueue.push([x, y, z, shouldJump, shouldSnap, yawPitch, ignoreY]);
        this._handlePath()
    }
};
