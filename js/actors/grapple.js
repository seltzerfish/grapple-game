const States =  {
    EXTENDING: 1,
    ATTACHED: 2,
    RETURNING: 3,
    RETURNED: 4
}

class Grapple extends Actor {
    constructor(player, targetX, targetY) {
        super(player.getCenterX(), player.getCenterY(), 20, 20, "claw");
        this.player = player;
        this.state = States.EXTENDING;
        this.length = 300;
        this.speedFactor = 0.01;
        this.calculateEndpoint(targetX, targetY);
    }

    calculateEndpoint(targetX, targetY) {
        const diffX = targetX - this.x;
        const diffY = targetY - this.y;
        const mag = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
        this.endX = (diffX / mag) * this.length;
        this.endY = (diffY / mag) * this.length;
    }

    extend() {
        const diffX = targetX - this.x;
        const diffY = targetY - this.y;
        const mag = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
        if (mag < 3) {
            this.state = States.RETURNING;
        }
        else {
            this.xVelocity = this.speedFactor * diffX;
            this.yVelocity = this.speedFactor * diffY;
            this.updatePosition();
        }
        
    }

    returnToPlayer() {
        const diffX = this.player.getCenterX() - this.x;
        const diffY = this.player.getCenterY() - this.y;
        const mag = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
        if (mag < 10) {
            this.state = States.RETURNED;
        }
        else {
            this.xVelocity += diffX / mag;
            this.yVelocity += diffY / mag;
            this.updatePosition();
        }
    }
}

