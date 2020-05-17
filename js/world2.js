const GRAPPLE_STRENGTH_X = 0.5;
const GRAPPLE_STRENGTH_Y = 0.5;
const GRAVITY = 0.25
const BOUNCE_FACTOR = -0.2;
const ACCELERATION_CAP = 2;
const FRICTION = 0.2;

const INVERSE_ACC_STRENGTH_X = 250;
const INVERSE_ACC_STRENGTH_Y = 300;

// INVERSE ACCELERATION w/ GRAPPLE LENGTH
class World {
    constructor(player, controller) {
        this.player = player;
        this.controller = controller;
        this.title = "inverse acceleration w/ grapple length";
    }

    update() {
        this.handleControllerInput();
        this.handlePlayerMotion();
        this.detectCollisions();
    }

    handleControllerInput() {
        if (!this.player.isGrappled && this.controller.mouseDown) {
            this.player.grapple(this.controller.mouseDownX, this.controller.mouseDownY);
        }
        else if (this.player.isGrappled && !this.controller.mouseDown) {
            this.player.ungrapple();
        }
    }

    handlePlayerMotion() {
        this.player.xAcceleration = 0;
        this.player.yAcceleration = GRAVITY;

        if (this.player.isGrappled) {
            this.handleGrappleMotion();
        }
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
        this.player.yAcceleration += (INVERSE_ACC_STRENGTH_Y / Math.max(grappleLength, 1)) * this.player.yAcceleration;
        this.player.xAcceleration += (INVERSE_ACC_STRENGTH_X / Math.max(grappleLength, 1)) * this.player.xAcceleration;
        this.capPlayerAcceleration();
        
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
        // wall / floor collision
        if (this.player.x < 0) {
            this.player.xVelocity *= BOUNCE_FACTOR;
            this.player.x = 0;
        }
        if ((this.player.x + this.player.width) > canvas.width) {
            this.player.xVelocity *= BOUNCE_FACTOR;
            this.player.x = canvas.width - this.player.width;
        }
        if (this.player.y < 0) {
            this.player.yVelocity *= BOUNCE_FACTOR;
            this.player.y = 0;
        }
        if ((this.player.y + this.player.height) > canvas.height) {
            this.player.yVelocity *= BOUNCE_FACTOR;
            this.player.y = canvas.height - this.player.height;
        }
    }
}