class Jupiter extends Solid {
    constructor(x, y) {
        super(x, y, 88, 88, "jupiter");
        this.hitboxes = [new CircularHitbox(this, this.getCenterX(), this.getCenterY(), this.width / 2)];
    }
}