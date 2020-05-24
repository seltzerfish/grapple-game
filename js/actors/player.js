/**
 * Player class. Contains all movement logic and instance variables.
 */
class Player extends Actor {

    constructor(controller, x = 0, y = 300, w = 28, h = 44) {
        super(x, y, w, h, "playerSprite");
        this.controller = controller;
        this.grapple = null;
        this.animationFrameDuration = 20;
        this.animationFrames = ['playerSprite', 'idle']
        this.grappleStrengthX = 0.6;
        this.grappleStrengthY = 0.7;
        this.grappleLength = 650;
        this.accelerationCap = 1.5;
        this.extraPullStrength = 0.2;
    }

    act() {
        this.xAcceleration = 0;
        this.yAcceleration = 0;
        this.handleControllerInput();
        if (this.grapple) {
            this.handleGrappleMotion();
        }
        this.yAcceleration += this.level.gravity;
        this.capAcceleration();
        this.updateVelocity();
        this.updatePosition();
        this.handleCollisionsWithSolids(this.isSwinging());
        this.detectFallOutOfWorld();
    }

    handleControllerInput() {
        if (!this.grapple && this.controller.mouseDown) {
            this.grapple = new Grapple(this, this.level.camera.translateInputX(this.controller.mouseDownX),
                this.level.camera.translateInputY(this.controller.mouseDownY), this.grappleLength);
            this.grapple.level = this.level;
            this.level.actors.push(this.grapple);
        }
    }

    handleGrappleMotion() {
        const state = this.grapple.state;
        if (state === GrappleState.RETURNED) {
            this.grapple = null;
            this.level.actors.pop(); // TODO: make this less hacky
        }
        if (state === GrappleState.ATTACHED) {
            const grappleLength = this.getGrappleLength();
            this.xAcceleration += ((this.grapple.getCenterX() - this.getCenterX()) / grappleLength) * this.grappleStrengthX;
            this.yAcceleration += ((this.grapple.getCenterY() - this.getCenterY()) / grappleLength) * this.grappleStrengthY;

            let projection = this.getVelocityProjectionOntoGrappleMagnitude();
            if (projection < 0) {
                // player is moving away from grapple
                projection *= -1 * this.extraPullStrength;
                this.xAcceleration *= 1 + projection;
                this.yAcceleration *= 1 + projection;
            }
            this.rotation = this.getAccelerationRadians() + 1.5708;
        }
    }

    capAcceleration() {
        const accelerationMagnitude = this.getAccelerationMagnitude()
        if (accelerationMagnitude > this.accelerationCap) {
            const ratio = Math.sqrt(Math.pow(accelerationMagnitude, 2) / Math.pow(this.accelerationCap, 2));
            this.xAcceleration /= ratio;
            this.yAcceleration /= ratio;
        }
    }

    getGrappleLength() {
        return Math.sqrt(Math.pow(this.grapple.getCenterX() - this.getCenterX(), 2) + Math.pow(this.grapple.getCenterY() - this.getCenterY(), 2));
    }

    isSwinging() {
        if (this.grapple && this.grapple.state === GrappleState.ATTACHED) {
            return true;
        }
        return false;
    }

    // Used for measuring how quickly the player is moving away from the grapple point
    getVelocityProjectionOntoGrappleMagnitude() {
        const vDotG = (this.xVelocity * (this.grapple.getCenterX() - this.x)) + (this.yVelocity * (this.grapple.getCenterY() - this.y));
        return vDotG / Math.max(this.getGrappleLength(), 1);
    }

    animate() {
        if (!this.grapple && Math.round(this.getVelocity()) === 0) {
            this.rotation *= 0.8;
            super.animate();
        }
    }

    detectFallOutOfWorld() {
        if ((this.y + this.height) > this.level.height) {
            this.x = this.level.playerStartX;
            this.y = this.level.playerStartY;
            this.xVelocity = 0;
            this.yVelocity = 0;
        }
    }

    setLevel(level) {
        this.level = level;
        this.x = level.playerStartX;
        this.y = level.playerStartY;
    }
}