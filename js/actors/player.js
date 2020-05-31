/**
 * Player class. Contains all movement logic and instance variables.
 */
class Player extends Actor {

    constructor(controller, x = 0, y = 300, w = 42, h = 66) {
        super(x, y, w, h, "playerSprite");
        this.hitboxes = [new Hitbox(this, 0, 0, this.width - 4, this.height - 4)];
        this.controller = controller;
        this.grapple = null;
        this.animationFrameDuration = 20;
        this.animationFrames = ['playerSprite'];
        this.grappleStrengthX = 0.6;
        this.grappleStrengthY = 0.7;
        this.grappleLength = 650;
        this.accelerationCap = 1.5;
        this.extraPullStrength = 0.2;
        this.turningThreshold = 2;
        this.arm = new Arm(this, this.controller);
    }

    act(level) {
        this.xAcceleration = 0;
        this.yAcceleration = 0;
        this.handleControllerInput(level);
        if (this.grapple) {
            this.handleGrappleMotion(level);
        }
        this.yAcceleration += level.gravity;
        this.capAcceleration();
        this.updateVelocity();
        this.updatePosition();
        this.handleCollisionsWithSolids(level, this.isSwinging());
        this.arm.act(level);
        this.detectFallOutOfWorld(level);
    }

    handleControllerInput(level) {
        if (!this.grapple && this.controller.mouseDown) {
            this.grapple = new Grapple(this, level.camera.translateInputX(this.controller.mouseDownX),
                level.camera.translateInputY(this.controller.mouseDownY), this.grappleLength);
            this.grapple.level = level;
            level.actors.push(this.grapple);
            this.arm.openHand();
        }
    }

    handleGrappleMotion(level) {
        const state = this.grapple.state;
        if (state === GrappleState.RETURNED) {
            this.grapple = null;
            level.actors.pop(); // TODO: make this less hacky
            this.arm.closeHand();
        }
        if (state === GrappleState.ATTACHED) {
            const grappleLength = Math.max(this.getGrappleLength(), 1);
            this.xAcceleration += ((this.grapple.getWirePositionX() - this.getCenterX()) / grappleLength) * this.grappleStrengthX;
            this.yAcceleration += ((this.grapple.getWirePositionY() - this.getCenterY()) / grappleLength) * this.grappleStrengthY;

            let projection = this.getVelocityProjectionOntoGrappleMagnitude();
            if (projection < 0) {
                // player is moving away from grapple
                projection *= -1 * this.extraPullStrength;
                this.xAcceleration *= 1 + projection;
                this.yAcceleration *= 1 + projection;
            }
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
        return MathUtil.distanceBetween(this.grapple.getWirePositionX(), this.grapple.getWirePositionY(), this.getCenterX(), this.getCenterY());
    }

    isSwinging() {
        if (this.grapple && this.grapple.state === GrappleState.ATTACHED) {
            return true;
        }
        return false;
    }

    // Used for measuring how quickly the player is moving away from the grapple point
    getVelocityProjectionOntoGrappleMagnitude() {
        const vDotG = (this.xVelocity * (this.grapple.getWirePositionX() - this.x)) + (this.yVelocity * (this.grapple.getWirePositionY() - this.y));
        return vDotG / Math.max(this.getGrappleLength(), 1);
    }

    animate() {

        if (this.xVelocity < -1 * this.turningThreshold) {
            this.arm.pinToRightSide();
            if (this.isSwinging()) {
                this.srcImage = "playerSpriteGrappledMirrored";
            }
            else {
                this.srcImage = "playerSpriteMirrored";
            }
        }
        else if (this.xVelocity > this.turningThreshold) {
            this.arm.pinToLeftSide();
            if (this.isSwinging()) {
                this.srcImage = "playerSpriteGrappled";
            }
            else {
                this.srcImage = "playerSprite";
            }
        }
        super.animate();
    }

    detectFallOutOfWorld(level) {
        if ((this.y + this.height) > level.height) {
            this.x = level.playerStartX;
            this.y = level.playerStartY;
            this.xVelocity = 0;
            this.yVelocity = 0;
        }
    }
}