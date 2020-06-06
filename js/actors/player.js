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
        this.grappleLength = 650;
        this.accelerationCap = 1.5;
        this.extraPullStrength = 0.2;
        this.maxHearts = 3;
        this.hearts = this.maxHearts;
        this.maxThrustCharges = 3;
        this.thrustCharges = this.maxThrustCharges;
        this.rightClickReleased = true;
        this.thrustChargesFull = true;
        this.thrustRechargeTimer = 0;
        this.thrustRechargeDelay = 100;
        this.thrustRechargeRate = 40;
        this.thrustPower = 7;
        this.movingLeft = false;
        this.movingRight = false;
        this.arm = new Arm(this, this.controller);
        this.turningThresholdSpeed = 2;
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
        this.handleThrustRecharging();
    }

    handleControllerInput(level) {
        if (!this.grapple) {
            if (this.controller.leftClickDown) {
                this.createGrapple(level)
            }
            else if (this.controller.rightClickDown && this.rightClickReleased) {
                this.tryToThrust(level);
            }
            else if (!this.rightClickReleased && !this.controller.rightClickDown) {
                this.rightClickReleased = true;
            }
        }
    }

    createGrapple(level) {
        this.grapple = new Grapple(this, level.camera.translateInputX(this.controller.leftClickDownX),
            level.camera.translateInputY(this.controller.leftClickDownY), this.grappleLength);
        this.grapple.level = level;
        level.actors.push(this.grapple);
        this.arm.openHand();
    }

    tryToThrust(level) {
        this.rightClickReleased = false;
        if (this.thrustCharges > 0) {
            this.thrust(level.camera.translateInputX(this.controller.rightClickDownX),
                level.camera.translateInputY(this.controller.rightClickDownY), level);
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
        if (this.isMovingLeft(-this.turningThresholdSpeed)) {
            this.movingLeft = true;
            this.movingRight = false;
        }
        else if (this.isMovingRight(this.turningThresholdSpeed)) {
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
        this.thrustCharges = this.maxThrustCharges;
        if (this.grapple) {
            this.removeGrapple(level);
        }
        this.hearts = Math.max(0, this.hearts - 1);
    }

    thrust(x, y, level) {
        this.thrustCharges -= 1;
        const mag = MathUtil.distanceBetween(this.getCenterX(), this.getCenterY(), x, y);
        const thrustDirectionX = (this.getCenterX() - x) / mag;
        const thrustDirectionY = (this.getCenterY() - y) / mag;
        this.xVelocity += thrustDirectionX * this.thrustPower;
        this.yVelocity += thrustDirectionY * this.thrustPower;
        this.thrustChargesFull = false;
        this.thrustRechargeTimer = 0;
        const numFlames = MathUtil.getRandomInt(3);
        for (let i = 0; i < numFlames + 3; i++) {
            level.actors.push(new ThrustFlame(this.arm.getHandPositionX(), this.arm.getHandPositionY(), -thrustDirectionX, -thrustDirectionY));
        }
    }

    handleThrustRecharging() {
        if (!this.thrustChargesFull) {
            this.thrustRechargeTimer += 1;
            if (this.thrustRechargeTimer > this.thrustRechargeDelay) {
                this.rechargeThrusts();
            }
        }
    }

    rechargeThrusts() {
        const timeDelta = this.thrustRechargeTimer - this.thrustRechargeDelay;
        if (timeDelta % this.thrustRechargeRate === 0) {
            this.thrustCharges += 1
        }
        if (this.thrustCharges >= this.maxThrustCharges) {
            this.thrustChargesFull = true;
        }
    }
}