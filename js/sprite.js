class Sprite {
    
    constructor(x=0, y=0, width=50, height=50, srcImage="", isPassable=false, rotation=0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.srcImage = srcImage;
        this.isPassable = false;
        this.rotation = rotation;
    }

    getCenterX() {
        return this.x + (this.width / 2)
    }

    getCenterY() {
        return this.y + (this.height / 2)
    }
}

class MovingSprite extends Sprite {

    constructor(x, y, width, height, srcImage, isPassable) {
        super(x, y, width, height, srcImage, isPassable);
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.topSpeed = 0;
        this.xAcceleration = 0;
        this.yAcceleration = 0;
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
}