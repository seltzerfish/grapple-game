// Throwaway class. For testing circular hitboxes

class BouncyBall extends Actor {
    constructor(x, y) {
        super(x, y, 40, 40, "jupiter");
        this.bounceCoefficient = 3;
        this.hitboxes = [new CircularHitbox(this, 20, 20, 20)];
        this.frictionCoefficient = 0;
    }

    act(level) {
        this.yAcceleration = level.gravity;
        this.xAcceleration = 0;
        this.updateVelocity();
        this.updatePosition();
        this.handleCollisionsWithSolids(level);
    }   
}