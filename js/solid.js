/**
 * Unmoving, impassable sprites. Should be used for all terrain objects.
 */

class Solid extends Sprite {
    constructor(x, y, width, height, srcImage) {
        super(x, y, width, height, srcImage);
        this.deadlyPixelMargin = 20;
    }

    makeTopDeadly() {
        this.hitboxes.push(new DeadlyHitbox(this, 
            0, 0, this.width, this.deadlyPixelMargin));
    }

    makeBottomDeadly() {
        this.hitboxes.push(new DeadlyHitbox(this, 
            0, this.height - this.deadlyPixelMargin, this.width, this.deadlyPixelMargin));
    }

    makeLeftSideDeadly() {
        this.hitboxes.push(new DeadlyHitbox(this, 
            0, this.deadlyPixelMargin, this.deadlyPixelMargin, this.height - (this.deadlyPixelMargin * 2)));
    }

    makeRightSideDeadly() {
        this.hitboxes.push(new DeadlyHitbox(this, 
            this.width - this.deadlyPixelMargin, this.deadlyPixelMargin,  this.deadlyPixelMargin, this.height - (this.deadlyPixelMargin * 2)))
    }
}