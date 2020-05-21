const States =  {
    EXTENDING: 1,
    ATTACHED: 2,
    RETURNING: 3,
    RETURNED: 4
}

class Grapple extends Actor {
    constructor(player, targetX, targetY) {
        super(player.getCenterX(), player.getCenterY(), 50, 80, "claw");
        this.hitboxes = [new Hitbox(this, 15, 25, 20, 20)];
        this.x -= this.width / 2;
        this.y -= this.height / 2;
        this.player = player;
        this.state = States.EXTENDING;
        this.length = 530;
        this.extendSpeedFactor = 0.1;
        this.returnAcceleration = 2;
        this.returningSpeed = 0;
        this.calculateEndpoint(targetX, targetY);
    }

    calculateEndpoint(targetX, targetY) {
        const diffX = targetX - this.getCenterX();
        const diffY = targetY - this.getCenterY();
        const mag = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
        this.endX = this.x + ((diffX / mag) * this.length);
        this.endY = this.y + ((diffY / mag) * this.length);
    }

    extend() {
        const diffX = this.endX - this.x;
        const diffY = this.endY - this.y;
        const mag = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
        if (mag < 30) {
            this.state = States.RETURNING;
        }
        else {
            this.xVelocity = this.extendSpeedFactor * diffX;
            this.yVelocity = this.extendSpeedFactor * diffY;
            this.updatePosition();
        }
    }

    returnToPlayer() {
        const diffX = this.player.getCenterX() - this.getCenterX();
        const diffY = this.player.getCenterY() - this.getCenterY();
        const mag = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
        if (mag < 30) {
            this.state = States.RETURNED;
        }
        else {
            this.returningSpeed += this.returnAcceleration;
            if (Math.abs((diffX / mag) * this.returningSpeed) < Math.abs(diffX)) {
                this.x += (diffX / mag) * this.returningSpeed;
            }
            else {
                this.x += diffX;
            }
            if (Math.abs((diffY / mag) * this.returningSpeed) < Math.abs(diffY)) {
                this.y += (diffY / mag) * this.returningSpeed;
            }
            else {
                this.y += diffY;
            }

        }
    }
}

