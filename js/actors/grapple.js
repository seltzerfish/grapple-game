// state enum
const GrappleState = {
    EXTENDING: 1,
    ATTACHED: 2,
    RETURNING: 3,
    RETURNED: 4
}

class Grapple extends Actor {
    constructor(player, targetX, targetY, length) {
        super(player.arm.getHandPositionX(), player.arm.getHandPositionY(), 48, 40, "claw");
        this.hitboxes = [new CircularHitbox(this, Math.round(this.width / 2), Math.round(this.height / 2), 11)];
        this.x -= this.width / 2;
        this.y -= this.height / 2;
        this.player = player;
        this.state = GrappleState.EXTENDING;
        this.length = length;
        this.extendSpeedFactor = 0.09;
        this.returnAcceleration = 1.15;
        this.returningSpeed = 5;
        this.returningRotationSpeed = 0.15;
        this.calculateEndpoint(targetX, targetY);
        this.rotation = this.calculateRotation();
        this.calculateWirePositionOffsets();

    }

    act(level) {
        if (!this.player.controller.leftClickDown && (this.state === GrappleState.EXTENDING || this.state === GrappleState.ATTACHED)) {
            this.return();
        } else if (this.state === GrappleState.RETURNING) {
            this.returnToPlayer();
        }
        // check for collisions to attach to
        else if (this.state === GrappleState.EXTENDING) {
            let solid;
            for (solid of level.getPossibleSolidCollisions()) {
                if (this.isCollidingWith(solid)) {
                    this.attach();
                }
            }
        }
        // if no collisions, keep extending
        if (this.state === GrappleState.EXTENDING) {
            this.extend();
        }
    }

    calculateEndpoint(targetX, targetY) {
        const diffX = targetX - this.getCenterX();
        const diffY = targetY - this.getCenterY();
        const mag = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
        this.endX = Math.round(this.x + ((diffX / mag) * this.length));
        this.endY = Math.round(this.y + ((diffY / mag) * this.length));
    }

    attach() {
        this.state = GrappleState.ATTACHED;
        SoundUtil.playSound(SOUNDS.GRAPPLE_STRIKE);
        SoundUtil.stopLoopedSound(SOUNDS.NON_ATTACHED_GRAPPLE);
        SoundUtil.playLoopedSound(SOUNDS.ATTACHED_GRAPPLE);
    }

    extend() {
        const diffX = this.endX - this.x;
        const diffY = this.endY - this.y;
        const mag = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
        if (mag < 60) {
            this.return();
        } else {
            this.xVelocity = this.extendSpeedFactor * diffX;
            this.yVelocity = this.extendSpeedFactor * diffY;
            this.updatePosition();
        }
    }

    return() {
        if (this.state === GrappleState.ATTACHED) {
            SoundUtil.stopLoopedSound(SOUNDS.ATTACHED_GRAPPLE);
            SoundUtil.playLoopedSound(SOUNDS.NON_ATTACHED_GRAPPLE);
        }
        this.state = GrappleState.RETURNING;
    }

    calculateRotation() {
        return MathUtil.calculateTheta(this.y - this.endY, this.x - this.endX);
    }

    returnToPlayer() {
        // TODO: change rotation on the way back
        const diffX = this.player.arm.getHandPositionX() - this.getWirePositionX();
        const diffY = this.player.arm.getHandPositionY() - this.getWirePositionY();
        const goalRotation = MathUtil.calculateTheta(diffY, diffX);
        this.rotation += MathUtil.minimumRotationDifference(this.rotation, goalRotation) * this.returningRotationSpeed;
        this.calculateWirePositionOffsets();
        const mag = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
        this.returningSpeed *= this.returnAcceleration;
        if (this.returningSpeed < mag) {
            this.x += Math.round((diffX / mag) * this.returningSpeed);
            this.y += Math.round((diffY / mag) * this.returningSpeed);
        }
        else {
            this.x += Math.round(diffX);
            this.y += Math.round(diffY);
            this.state = GrappleState.RETURNED;
        }

    }

    calculateWirePositionOffsets() {
        const originX = this.getCenterX();
        const originY = this.getCenterY();
        this.wireOffsetY = Math.round(Math.sin(this.rotation) * (this.width / 2));
        this.wireOffsetX = Math.round(Math.cos(this.rotation) * (this.width / 2));
    }

    /**
     * Get the x position of the base of the hook, where the wire would be attached.
     */
    getWirePositionX() {
        return this.getCenterX() + this.wireOffsetX;
    }

    /**
     * Get the x position of the base of the hook, where the wire would be attached.
     */
    getWirePositionY() {
        return this.getCenterY() + this.wireOffsetY;
    }
}