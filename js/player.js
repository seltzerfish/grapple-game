/**
 * Player class.
 * 
 * Contains relevant instance variables and convenience methods.
 */
class Player {
    constructor() {
        this.spriteName = "";
        this.width = 30;
        this.height = 30;
        this.x = 300;
        this.y = 0;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.xAcceleration = 0;
        this.yAcceleration = 0;
        this.isGrappled = false;
        this.grappledX = 0;
        this.grappledY = 0
    }

    getCenterX() {
        return this.x + (this.width / 2)
    }

    getCenterY() {
        return this.y + (this.height / 2)
    }

    getAccelerationMagnitude() {
        return Math.sqrt(Math.pow(this.xAcceleration, 2) + Math.pow(this.yAcceleration, 2));
    }

    getAccelerationRadians() {
        Math.atan2(this.yAcceleration, this.xAcceleration);
    }

    getVelocity() {
        return Math.sqrt(Math.pow(this.xVelocity, 2) + Math.pow(this.yVelocity, 2));
    }

    getVelocityRadians() {
        return Math.atan2(this.yVelocity, this.xVelocity);
    }

    getGrappleLength() {
        return Math.sqrt(Math.pow(this.grappledX - this.x, 2) + Math.pow(this.grappledY - this.y, 2));
    }

}