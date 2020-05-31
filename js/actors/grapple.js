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
        this.hitboxes = [new Hitbox(this, Math.round(this.width / 2) - 10, Math.round(this.height / 2) - 10, 20, 20)];
        this.x -= this.width / 2;
        this.y -= this.height / 2;
        this.player = player;
        this.state = GrappleState.EXTENDING;
        this.length = length;
        this.extendSpeedFactor = 0.07;
        this.returnAcceleration = 2;
        this.returningSpeed = 0;
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
        this.state = GrappleState.RETURNING;
    }

    calculateRotation() {
        return MathUtil.calculateTheta(this.y - this.endY, this.x - this.endX);
    }

    returnToPlayer() {
        // TODO: change rotation on the way back
        const diffX = this.player.arm.getHandPositionX() - this.getWirePositionX();
        const diffY = this.player.arm.getHandPositionY() - this.getWirePositionY();
        const mag = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
        this.returningSpeed += this.returnAcceleration;
        if (Math.abs((diffX / mag) * this.returningSpeed) < Math.abs(diffX)) {
            this.x += Math.round((diffX / mag) * this.returningSpeed);
        } else {
            this.x += Math.round(diffX);
            this.state = GrappleState.RETURNED;
        }
        if (Math.abs((diffY / mag) * this.returningSpeed) < Math.abs(diffY)) {
            this.y += Math.round((diffY / mag) * this.returningSpeed);
        } else {
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