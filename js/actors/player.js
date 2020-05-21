/**
 * Player class.
 * 
 * Contains relevant instance variables and convenience methods.
 */
class Player extends Actor {

    constructor() {
        super(0, 300, 30, 40, "playerSprite");
        this.grapple = null;
        this.animationFrameDuration = 20;
        this.animationFrames = ['playerSprite', 'idle']
        this.bounceCoefficient = 1;
        this.grappleLength = 500;
    }

    // grapple(x, y) {
    //     this.srcImage = "playerSpriteGrappled";
    //     this.isGrappled = true;
    //     this.grappledX = x;
    //     this.grappledY = y;
    //     this.rotation = this.getAccelerationRadians() + 1.5708;
    // }

    // ungrapple() {
    //     this.srcImage = "playerSprite";
    //     this.isGrappled = false;
    // }

    getGrappleLength() {
        return Math.sqrt(Math.pow(this.grapple.x - this.x, 2) + Math.pow(this.grapple.y - this.y, 2));
    }

    isSwinging() {
        if (this.grapple && this.grapple.state === States.ATTACHED) {
            return true;
        }
        return false;
    }

    /**
     * Used for measuring how quickly the player is moving away from the grapple point
     * See https://en.wikipedia.org/wiki/Vector_projection for more.
     */
    getVelocityProjectionOntoGrappleMagnitude() {
        const vDotG = (this.xVelocity * (this.grapple.getCenterX() - this.x)) + (this.yVelocity * (this.grapple.getCenterY() - this.y));
        return vDotG / Math.max(this.getGrappleLength(), 1);
    }   

    updateIdleSprite() {
        // this.rotation = this.getVelocityRadians()+ 1.5708;
        // this.rotation = this.getVelocityRadians()+ 1.5708;
        if (Math.round(this.getVelocity()) === 0) {
            this.rotation *= 0.8;
            this.animate();
        }
    }

}