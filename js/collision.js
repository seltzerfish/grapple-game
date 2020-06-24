/**
 * Abstract parent class for collision geometry.
 */
class CollidableShape {

    constructor(sprite, xOffset, yOffset, isDeadly=false) {
        if (this.constructor === CollidableShape) {
            throw new Error('CollidableShape class is Abstract. Use an Hitbox or CircularHitbox instead.');
        }
        this.sprite = sprite;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.isDeadly = isDeadly;
    }

    /** 
     * Collision detection
     * 
     * returns the smallest vector necessary to remove this hitbox from the one passed in.
     * if no collision, returns [0, 0]
     * 
     * @param {CollidableShape} that 
     */
    getMinimumTranslationVector(that) {
        // TODO: add support for SAT collisions in the case of a rotated hitbox
        if (this instanceof Hitbox && that instanceof Hitbox) {
            return this.getMTV_AABB(that);
        }
        else if (this instanceof CircularHitbox && that instanceof CircularHitbox) {
            return this.getMTV_TwoCircles(that);
        }
        else {
            return this.getMTV_RectangleAndCircle(that);
        }
    }

    /**
     * Simple AABB collision. Only supports non-rotated hitboxes
     * 
     * @param {Hitbox} that 
     */
    getMTV_AABB(that) {
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

    /**
     * Collision between 2 circles.
     * 
     * @param {CircularHitbox} that 
     */
    getMTV_TwoCircles(that) {
        return [0, 0];
    }

    getMTV_RectangleAndCircle(that) {
        return [0, 0];
    }
}

class Hitbox extends CollidableShape {
    constructor(sprite, xOffset, yOffset, width, height, isDeadly=false, rotation=0) {
        super(sprite, xOffset, yOffset, isDeadly);
        this.width = width;
        this.height = height;
        this.rotation = rotation;
    }
}

class CircularHitbox extends CollidableShape {
    constructor(sprite, xOffset, yOffset, radius, isDeadly=false) {
        super(sprite, xOffset, yOffset, isDeadly);
        this.radius = radius;
    }
}

class DeadlyHitbox extends Hitbox {
    constructor(sprite, xOffset, yOffset, width, height, rotation = 0) {
        super(sprite, xOffset, yOffset, width, height, true, rotation = 0);
    }
}

class DeadlyCircularHitbox extends CircularHitbox {
    constructor(sprite, xOffset, yOffset, radius) {
        super(sprite, xOffset, yOffset, radius, true);
    }
}
