/**
 * Player class. Contains all movement logic and instance variables.
 */
class Player extends Actor {

    constructor(controller, x = 0, y = 300, w = 36, h = 56) {
        super(x, y, w, h, "playerSprite");
        this.hitboxes = [new Hitbox(this, 0, 0, this.width - 6, this.height - 4)];
        this.controller = controller;
        this.grapple = null;
        this.animationFrameDuration = 20;
        this.animationFrames = ['playerSprite'];
        this.grappleStrengthX = 0.5;
        this.grappleStrengthY = 0.6;
        this.grappleLength = 540;
        this.accelerationCap = 1.5;
        this.extraPullStrength = 0.2;
        this.turningThreshold = 2;
        this.thrustCharges = 10000; // TODO: reduce to a reasonable number and add refill logic.
        this.readyToThrust = true;
        this.thrustPower = 7;
        this.movingLeft = false;
        this.movingRight = false;
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
        this.detectFallOutOfWorld(level);
        this.arm.act(level);
    }

    handleControllerInput(level) {
        if (!this.grapple) {
            if (this.controller.leftClickDown) {
                this.grapple = new Grapple(this, level.camera.translateInputX(this.controller.leftClickDownX),
                    level.camera.translateInputY(this.controller.leftClickDownY), this.grappleLength);
                this.grapple.level = level;
                level.actors.push(this.grapple);
                this.arm.openHand();
            }
            else if (this.controller.rightClickDown && this.readyToThrust && this.thrustCharges > 0) {
                this.readyToThrust = false;
                this.thrustCharges -= 1;
                this.thrust(level.camera.translateInputX(this.controller.rightClickDownX),
                    level.camera.translateInputY(this.controller.rightClickDownY), level);
            }
            else if (!this.readyToThrust && !this.controller.rightClickDown) {
                this.readyToThrust = true;
            }
        }
    }

    handleGrappleMotion(level) {
        const state = this.grapple.state;
        if (state === GrappleState.RETURNED) {
            this.removeGrapple(level);
        }
        else if (state === GrappleState.ATTACHED) {
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

    removeGrapple(level) {
        level.markSpriteForDeletion(this.grapple);
        this.grapple = null;
        this.arm.closeHand();
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
        this.updateDirection();
        if (this.movingLeft) {
            if (this.isSwinging()) {
                this.srcImage = "playerSpriteGrappledMirrored";
            }
            else {
                this.srcImage = "playerSpriteMirrored";
            }
        }
        else {
            if (this.isSwinging()) {
                this.srcImage = "playerSpriteGrappled";
            }
            else {
                this.srcImage = "playerSprite";
            }
        }
        super.animate();
    }

    updateDirection() {
        if (this.isMovingLeft(-this.turningThreshold)) {
            this.movingLeft = true;
            this.movingRight = false;
        }
        else if (this.isMovingRight(this.turningThreshold)) {
            this.movingRight = true;
            this.movingLeft = false;
        }
    }

    detectFallOutOfWorld(level) {
        if ((this.y) > level.height) {
            this.die(level);
        }
    }

    die(level) {
        this.x = level.playerStartX;
        this.y = level.playerStartY;
        this.xVelocity = 0;
        this.yVelocity = 0;
        if (this.grapple) {
            this.removeGrapple(level);
        }
    }

    thrust(x, y, level) {
        const mag = MathUtil.distanceBetween(this.getCenterX(), this.getCenterY(), x, y);
        const thrustDirectionX = (this.getCenterX() - x) / mag;
        const thrustDirectionY = (this.getCenterY() - y) / mag;
        this.xVelocity += thrustDirectionX * this.thrustPower;
        this.yVelocity += thrustDirectionY * this.thrustPower;

        const numFlames = MathUtil.getRandomInt(3);
        for (let i = 0; i < numFlames + 3; i++) {
            level.actors.push(new ThrustFlame(this.arm.getHandPositionX(), this.arm.getHandPositionY(), -thrustDirectionX, -thrustDirectionY));
        }
    }
}