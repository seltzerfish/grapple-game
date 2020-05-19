
// TODO: change these values back to const upon game release
let GRAPPLE_STRENGTH_X = 0.5;
let GRAPPLE_STRENGTH_Y = 0.5;
let GRAVITY = 0.2;
let BOUNCE_FACTOR = -0.2;
let ACCELERATION_CAP = 2;
let FRICTION = 0.2;
let EXTRA_PULL_STRENGTH = 0.16;

class World {
    constructor(player, controller, camera) {
        this.player = player;
        this.controller = controller;
        this.camera = camera;
        this.level = LEVEL_1;
    }

    update() {
        this.handleControllerInput();
        this.handlePlayerMotion();
        this.detectCollisions();
        this.camera.updatePosition();
    }

    handleControllerInput() {
        if (!this.player.isGrappled && this.controller.mouseDown) {
            this.player.grapple(this.camera.translateInputX(this.controller.mouseDownX), 
            this.camera.translateInputY(this.controller.mouseDownY));
        }
        else if (this.player.isGrappled && !this.controller.mouseDown) {
            this.player.ungrapple();
        }
    }

    handlePlayerMotion() {
        this.player.xAcceleration = 0;
        this.player.yAcceleration = 0;

        if (this.player.isGrappled) {
            this.handleGrappleMotion();
        }
        else {
            // This shouldn't be here. this should be in the player class, but i dont feel like implementing a method for that rn
            this.player.rotation = this.player.getVelocityRadians()+ 1.5708;
        }
        this.player.yAcceleration += GRAVITY;
        this.capPlayerAcceleration(); // this should probably also be a method of the player class
        this.player.xVelocity += this.player.xAcceleration;
        this.player.yVelocity += this.player.yAcceleration;

        // friction
        if (this.player.y === canvas.height - this.player.height && !this.player.isGrappled) {
            this.player.xVelocity *= 1 - FRICTION;
        }
        // update position
        this.player.x += this.player.xVelocity;
        this.player.y += this.player.yVelocity;
    }

    handleGrappleMotion() {
        const grappleLength = this.player.getGrappleLength();
        this.player.xAcceleration += ((this.player.grappledX - this.player.x) / grappleLength) * GRAPPLE_STRENGTH_X;
        this.player.yAcceleration += ((this.player.grappledY - this.player.y) / grappleLength) * GRAPPLE_STRENGTH_Y;

        let projection = this.player.getVelocityProjectionOntoGrappleMagnitude();
        if (projection < 0) {
            // player is moving away from grapple
            projection *= -1 * EXTRA_PULL_STRENGTH;
            this.player.xAcceleration *= 1 + projection;
            this.player.yAcceleration *= 1 + projection;
        }
        this.player.rotation = this.player.getAccelerationRadians() + 1.5708;
    }

    capPlayerAcceleration() {
        const accelerationMagnitude = this.player.getAccelerationMagnitude()
        if (accelerationMagnitude > ACCELERATION_CAP) {
            const ratio = Math.sqrt(Math.pow(accelerationMagnitude, 2) / Math.pow(ACCELERATION_CAP, 2));
            this.player.xAcceleration /= ratio;
            this.player.yAcceleration /= ratio;
        }
    }

    detectCollisions() {
        // Turning off wall  and ceiling boundaries for now, but keeping floor.


        // if (this.player.x < 0) {
        //     this.player.xVelocity *= BOUNCE_FACTOR;
        //     this.player.x = 0;
        // }
        // if ((this.player.x + this.player.width) > canvas.width) {
        //     this.player.xVelocity *= BOUNCE_FACTOR;
        //     this.player.x = canvas.width - this.player.width;
        // }
        // if (this.player.y < 0) {
        //     this.player.yVelocity *= BOUNCE_FACTOR;
        //     this.player.y = 0;
        // }
        if ((this.player.y + this.player.height) > canvas.height) {
            this.player.yVelocity *= BOUNCE_FACTOR;
            this.player.y = canvas.height - this.player.height;
        }
    }

    // TODO: move this to renderer
    setDefaultValues() {
        document.getElementById("gravity").value = GRAVITY;
        document.getElementById("bounce").value = BOUNCE_FACTOR;
        document.getElementById("grapStrengthX").value = GRAPPLE_STRENGTH_X;
        document.getElementById("grapStrengthY").value = GRAPPLE_STRENGTH_X;
        document.getElementById("maxAcc").value = ACCELERATION_CAP;
        document.getElementById("friction").value = FRICTION;
        document.getElementById("extraPullStrengthSpan").style.display = "inline";
        document.getElementById("extraPullStrength").value = EXTRA_PULL_STRENGTH;
    }
}


// TODO: move these somewhere else. possibly renderer
function updateGravity() {
    GRAVITY = parseFloat(document.getElementById("gravity").value);
}
function updateBounce() {
    BOUNCE_FACTOR = parseFloat(document.getElementById("bounce").value);
}
function updateGrapStrengthX() {
    GRAPPLE_STRENGTH_X = parseFloat(document.getElementById("grapStrengthX").value);
}
function updateGrapStrengthY() {
    GRAPPLE_STRENGTH_Y = parseFloat(document.getElementById("grapStrengthY").value);
}
function updateMaxAcc() {
    ACCELERATION_CAP = parseFloat(document.getElementById("maxAcc").value);
}
function updateFriction() {
    FRICTION = parseFloat(document.getElementById("friction").value);
}
function updateExtraPullStrength() {
    EXTRA_PULL_STRENGTH = parseFloat(document.getElementById("extraPullStrength").value);
}
