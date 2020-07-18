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
        const thisCenterX = this.sprite.x + this.xOffset;
        const thisCenterY = this.sprite.y + this.yOffset;
        const thatCenterX = that.sprite.x + that.xOffset;
        const thatCenterY = that.sprite.y + that.yOffset;
        const distFromCenters = MathUtil.distanceBetween(thisCenterX, thisCenterY, thatCenterX, thatCenterY);
        const sumOfRadii = this.radius + that.radius;
        if (distFromCenters > sumOfRadii) {
            // no collision
            return [0, 0];
        }
        // collision
        const angle = MathUtil.calculateTheta(thatCenterY - thisCenterY, thatCenterX - thisCenterX);
        const distToMove = sumOfRadii - distFromCenters;
        const mtv_x = -Math.cos(angle) * distToMove;
        const mtv_y = -Math.sin(angle) * distToMove
        return [mtv_x, mtv_y];
    }

    /**
     * Collision between a rectangle and circle (not necessarily in that order).
     * 
     * @param {CircularHitbox} that 
     */
    getMTV_RectangleAndCircle(that) {
        let circle;
        let rect;
        if (this instanceof CircularHitbox) {
            circle = this;
            rect = that;
        }
        else {
            circle = that;
            rect = this;
        }
        const rectX = rect.sprite.x + rect.xOffset; 
        const rectY = rect.sprite.y + rect.yOffset;
        const circX = circle.sprite.x + circle.xOffset;
        const circY = circle.sprite.y + circle.yOffset;
        const nearestX = Math.max(rectX, Math.min(circX, rectX + rect.width));
        const nearestY = Math.max(rectY, Math.min(circY, rectY + rect.height));
        const dist = MathUtil.distanceBetween(nearestX, nearestY, circX, circY);
        if (dist > circle.radius) {
            //no collision
            return [0, 0];
        }
        const mtvMag = circle.radius - dist;
        const mtvTheta = MathUtil.calculateTheta(circY - nearestY, circX - nearestX);
        let mtv = MathUtil.polarToCartesian(mtvMag, mtvTheta);
        if (Math.abs(mtv.x) < 0.000000000000001) {
            mtv.x = 0;
        }
        if (Math.abs(mtv.y) < 0.000000000000001) {
            mtv.y = 0;
        }
        
        // let mtv = {
        //     x: 0,
        //     y: 0
        // };
        // const xDist = circX - nearestX;
        // const yDist = circY - nearestY;
        // if (Math.abs(xDist) > Math.abs(yDist)) {
        //     mtv.x = (circle.radius - Math.abs(xDist)) * Math.sign(xDist);
        // }
        // else {
        //     mtv.y = (circle.radius - Math.abs(yDist)) * Math.sign(yDist);
        // }

        if (this instanceof CircularHitbox) {
            return [mtv.x, mtv.y];
        }
        return [-mtv.x, -mtv.y]
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
