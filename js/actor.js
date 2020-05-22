
class Actor extends Sprite {

    constructor(x, y, width, height, srcImage) {
        super(x, y, width, height, srcImage);
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.topSpeed = 0;
        this.xAcceleration = 0;
        this.yAcceleration = 0;
        this.frictionCoefficient = 0;
        this.animationTimer = 0;
        this.animationFrameDuration = 20;
        this.animationFrames = [srcImage];
        this.level = null;
    }

    act() {
        // Abstract method; do not fill in. This method should be overridden in child classes.
    }

    updatePosition() {
        this.x += this.xVelocity;
        this.y += this.yVelocity;
    }

    updateVelocity() {
        this.xVelocity += this.xAcceleration;
        this.yVelocity += this.yAcceleration;
    }

    getAccelerationMagnitude() {
        return Math.sqrt(Math.pow(this.xAcceleration, 2) + Math.pow(this.yAcceleration, 2));
    }

    getAccelerationRadians() {
        return Math.atan2(this.yAcceleration, this.xAcceleration);
    }

    getVelocity() {
        return Math.sqrt(Math.pow(this.xVelocity, 2) + Math.pow(this.yVelocity, 2));
    }

    getVelocityRadians() {
        return Math.atan2(this.yVelocity, this.xVelocity);
    }

    isMovingUp() {
        return this.yVelocity < 0;
    }

    isMovingDown() {
        return this.yVelocity > 0;
    }

    isMovingLeft() {
        return this.xVelocity < 0;
    }

    isMovingRight() {
        return this.xVelocity > 0;
    }
    
    animate() {
        if (this.animationFrames.length > 1) {
            this.animationTimer += 1;
            const quotient = Math.floor(this.animationTimer / this.animationFrameDuration)
            const frame = quotient % this.animationFrames.length;
            this.srcImage = this.animationFrames[frame];
            if (this.animationTimer === this.animationFrameDuration * this.animationFrames.length) {
                this.animationTimer = 0;
            }
        }
    }

    handleCollisionsWithSolids(ignoreFriction=false) {
        let solid;
        for (solid of this.level.getPossibleSolidCollisions(this)) {
            if (this.isCollidingWith(solid)) {
                this.bounceOffSolid(solid);
                if (!ignoreFriction) {
                    this.applyFriction(solid);
                }
            }
        }
    }

    bounceOffSolid(solid) {
         // Move actor out of solid
         this.x += this.minTranslationX;
         this.y += this.minTranslationY;

         // bounce this off of solid
         const magnitude = this.getTranslationVectorMagnitude();
         if (this.minTranslationX !== 0 && Math.sign(this.minTranslationX) !== Math.sign(this.xVelocity)) {
             this.xVelocity *= -1 * Math.abs(this.minTranslationX / magnitude) * solid.bounceCoefficient * this.bounceCoefficient;
         }
         if (this.minTranslationY !== 0  && Math.sign(this.minTranslationY) !== Math.sign(this.yVelocity)) {
             this.yVelocity *= -1 * Math.abs(this.minTranslationY / magnitude) * solid.bounceCoefficient * this.bounceCoefficient;
         }
    }

    applyFriction(solid) {
        this.xVelocity *= (1 - solid.frictionCoefficient) * (1 - this.frictionCoefficient);
        this.yVelocity *= (1 - solid.frictionCoefficient) * (1 - this.frictionCoefficient);
    }

}