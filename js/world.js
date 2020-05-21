
// TODO: change these values back to const upon game release
let GRAPPLE_STRENGTH_X = 0.5;
let GRAPPLE_STRENGTH_Y = 0.6;
let GRAVITY = 0.2;
let ACCELERATION_CAP = 1.5;
let EXTRA_PULL_STRENGTH = 0.2;

class World {
    constructor(player, controller, camera) {
        this.player = player;
        this.controller = controller;
        this.camera = camera;
        this.level = LEVEL_1;
        this.player.x = this.level.playerStartX;
        this.player.y = this.level.playerStartY;
        this.collisionHandler = new CollisionHandler(this.level, this.player);
    }

    update() {
        this.updatePlayer();
        this.handleControllerInput();
        this.collisionHandler.handleCollisions();
        this.detectFallOutOfWorld();
        this.camera.updatePosition();
    }

    handleControllerInput() {
        if (!this.player.grapple && this.controller.mouseDown) {
            this.player.grapple = new Grapple(this.player, this.camera.translateInputX(this.controller.mouseDownX), 
            this.camera.translateInputY(this.controller.mouseDownY));
            this.level.actors.push(this.player.grapple);
        }
        else if (this.player.grapple && !this.controller.mouseDown && (this.player.grapple.state === States.EXTENDING || this.player.grapple.state === States.ATTACHED)) {
            this.player.grapple.state = States.RETURNING;
        }
    }

    updatePlayer() {
        this.player.xAcceleration = 0;
        this.player.yAcceleration = 0;

        if (this.player.grapple) {
            this.handleGrappleMotion();
        }
        else {
            this.player.updateIdleSprite();
        }
        this.player.yAcceleration += GRAVITY;
        this.capPlayerAcceleration(); // this should probably also be a method of the player class
        this.player.updateVelocity();
        this.player.updatePosition();  
    }

    handleGrappleMotion() {
        const state = this.player.grapple.state;
        if (state === States.EXTENDING) {
            this.player.grapple.extend();
        }
        else if (state === States.RETURNING) {
            this.player.grapple.returnToPlayer();
        }
        else if (state === States.RETURNED) {
            this.player.grapple = null;
            this.level.actors.pop(); // TODO: make this less hacky
        }
        if (state === States.ATTACHED) {
            const grappleLength = this.player.getGrappleLength();
            this.player.xAcceleration += ((this.player.grapple.getCenterX() - this.player.getCenterX()) / grappleLength) * GRAPPLE_STRENGTH_X;
            this.player.yAcceleration += ((this.player.grapple.getCenterY() - this.player.getCenterY()) / grappleLength) * GRAPPLE_STRENGTH_Y;

            let projection = this.player.getVelocityProjectionOntoGrappleMagnitude();
            if (projection < 0) {
                // player is moving away from grapple
                projection *= -1 * EXTRA_PULL_STRENGTH;
                this.player.xAcceleration *= 1 + projection;
                this.player.yAcceleration *= 1 + projection;
            }
            this.player.rotation = this.player.getAccelerationRadians() + 1.5708;
        }
        
    }

    capPlayerAcceleration() {
        const accelerationMagnitude = this.player.getAccelerationMagnitude()
        if (accelerationMagnitude > ACCELERATION_CAP) {
            const ratio = Math.sqrt(Math.pow(accelerationMagnitude, 2) / Math.pow(ACCELERATION_CAP, 2));
            this.player.xAcceleration /= ratio;
            this.player.yAcceleration /= ratio;
        }
    }

    detectFallOutOfWorld() {
        if ((this.player.y + this.player.height) > this.level.height) {
            this.player.x = this.level.playerStartX;
            this.player.y = this.level.playerStartY;
            this.player.xVelocity = 0;
            this.player.yVelocity = 0;
        }
    }

    // TODO: move this to renderer
    setDefaultValues() {
        document.getElementById("gravity").value = GRAVITY;
        document.getElementById("grapStrengthX").value = GRAPPLE_STRENGTH_X;
        document.getElementById("grapStrengthY").value = GRAPPLE_STRENGTH_Y;
        document.getElementById("maxAcc").value = ACCELERATION_CAP;
        document.getElementById("extraPullStrengthSpan").style.display = "inline";
        document.getElementById("extraPullStrength").value = EXTRA_PULL_STRENGTH;
    }
}


// TODO: move these somewhere else. possibly renderer
function updateGravity() {
    GRAVITY = parseFloat(document.getElementById("gravity").value);
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
function updateExtraPullStrength() {
    EXTRA_PULL_STRENGTH = parseFloat(document.getElementById("extraPullStrength").value);
}
