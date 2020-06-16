class DeadlySolid extends Solid {
    constructor(x, y, width, height, srcImage) {
        super(x, y, width, height, srcImage, true);
        this.hitboxes = [new DeadlyHitbox(this, 0, 0, width, height)];
    }
}