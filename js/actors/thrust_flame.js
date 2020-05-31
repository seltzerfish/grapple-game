class ThrustFlame extends Actor {

    constructor(x, y, directionX, directionY) {
        super(x, y, 30, 30);
        this.timeAlive = 0;
        this.speed = 10;
        this.directionRandomness = 10;
        this.durationRandomness = 30;
        this.sizeRandomness = 30;
        this.width = this.addRandomOffset(this.width, this.sizeRandomness);
        this.height = this.addRandomOffset(this.height, this.sizeRandomness);
        this.hitboxes = [new Hitbox(this, 0, 0, this.width, this.height)]; // TODO: remove this after we get art
        this.x -= Math.round(this.width / 2);
        this.y -= Math.round(this.height / 2);
        this.xVelocity = this.addRandomOffset(directionX * this.speed, this.directionRandomness);
        this.yVelocity = this.addRandomOffset(directionY * this.speed, this.directionRandomness);
        this.timeToLive = this.addRandomOffset(30, this.durationRandomness);
    }

    act(level) {
        if (this.timeAlive > this.timeToLive) {
            level.markSpriteForDeletion(this); // commit sudoku
            return;
        }
        this.timeAlive += 1;
        this.updatePosition();
    }

    addRandomOffset(value, randomness) {
        return value + ((Math.random() * randomness) - (randomness / 2));
    }

}