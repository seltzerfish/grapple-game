class Sprite {

    constructor(x = 0, y = 0, width = 50, height = 50, srcImage = '', rotation = 0, bounceCoefficient = 0.25, frictionCoefficient = 0.15) {
        if (this.constructor === Sprite) {
            throw new Error('Sprite class is Abstract. Use an Actor or Solid instead.');
        }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.srcImage = srcImage;
        this.rotation = rotation;
        this.bounceCoefficient = bounceCoefficient;
        this.frictionCoefficient = frictionCoefficient;
        this.minTranslationX = 0;
        this.minTranslationY = 0;
        this.hitboxes = [new Hitbox(this, 0, 0, width, height)]; // default hitbox is the sprite image boundary
    }

    getCenterX() {
        return Math.round(this.x + (this.width / 2));
    }

    getCenterY() {
        return Math.round(this.y + (this.height / 2));
    }

    isCollidingWith(otherSprite) {
        // TODO: make this method smarter so that it doesn't check all pairs of hitboxes
        let thisHitbox;
        let thatHitbox;
        this.minTranslationX = 0;
        this.minTranslationY = 0;
        for (thisHitbox of this.hitboxes) {
            for (thatHitbox of otherSprite.hitboxes) {
                const mtv = thisHitbox.getMinimumTranslationVector(thatHitbox);
                this.minTranslationX += mtv[0];
                this.minTranslationY += mtv[1];
            }
        }
        if (this.minTranslationX !== 0 || this.minTranslationY !== 0) {
            return true;
        }
        return false;
    }

    getTranslationVectorMagnitude() {
        return Math.sqrt(Math.pow(this.minTranslationX, 2) + Math.pow(this.minTranslationY, 2));
    }
}
