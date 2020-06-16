
/**
 * Hitbox class.
 * contains a reference to the sprite it belongs to so that its position doesn't have to be constantly updated
 */
class Hitbox {

    constructor(sprite, xOffset, yOffset, width, height, isDeadly=false, rotation = 0) {
        this.sprite = sprite;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.width = width;
        this.height = height;
        this.isDeadly = isDeadly;
        this.rotation = rotation;
    }

    /** 
     * Collision detection
     * 
     * returns the smallest vector necessary to remove this hitbox from the one passed in.
     * if no collision, returns [0, 0]
     * 
     * @param {Hitbox} that 
     */
    getMinimumTranslationVector(that) {
        // TODO: add support for SAT collisions in the case of a rotated hitbox
        return this.getMinimumTranslationVectorAABB(that);
    }

    /**
     * Simple AABB collision. Only supports non-rotated hitboxes
     * 
     * @param {Hitbox} that 
     */
    getMinimumTranslationVectorAABB(that) {
        let mtv_x = 0;
        let mtv_y = 0;

        const thisMinX = this.sprite.x + this.xOffset;
        const thisMaxX = thisMinX + this.width;
        const thisMinY = this.sprite.y + this.yOffset;
        const thisMaxY = thisMinY + this.height;
        const thatMinX = that.sprite.x + that.xOffset;
        const thatMaxX = thatMinX + that.width;
        const thatMinY = that.sprite.y + that.yOffset;
        const thatMaxY = thatMinY + that.height;

        const left = thatMinX - thisMaxX;
        const right = thatMaxX - thisMinX;
        const top = thatMinY - thisMaxY;
        const bottom = thatMaxY - thisMinY;

        if (left < 0 && right > 0 && top < 0 && bottom > 0) {
            // alert(left + " " + right + " " + bottom + " " + top)
            if (Math.abs(left) < right) {
                mtv_x = left;
            }
            else {
                mtv_x = right;
            }
            if (Math.abs(top) < bottom) {
                mtv_y = top;
            }
            else {
                mtv_y = bottom;
            }
            if (Math.abs(mtv_x) < Math.abs(mtv_y)) {
                mtv_y = 0;
            }
            else {
                mtv_x = 0;
            }
        }
        return [mtv_x, mtv_y];
    }
}

class DeadlyHitbox extends Hitbox {
    constructor(sprite, xOffset, yOffset, width, height, rotation = 0) {
        super(sprite, xOffset, yOffset, width, height, true, rotation = 0)
    }
}