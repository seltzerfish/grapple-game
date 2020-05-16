

// CONSTANT ACCELERATION
class World {
    constructor(player) {
        this.player = player;
        this.title = "constant acceleration";
    }

    update() {
        this.updatePlayerPosition();
        this.detectCollisions();
    }

    updatePlayerPosition() {
        this.player.yVelocity += GRAVITY;

        if (this.player.isGrappled) {
            const grappleLength = this.player.getGrappleLength();
            
            // acceleration towards grappled point
            this.player.xAcceleration = ((this.player.grappledX - this.player.x) / grappleLength) * GRAPPLE_STRENGTH;
            this.player.yAcceleration = ((this.player.grappledY - this.player.y) / grappleLength) * GRAPPLE_STRENGTH; 
    
            this.player.xVelocity += this.player.xAcceleration;
            this.player.yVelocity += this.player.yAcceleration;
        }
        else {
            this.player.xAcceleration = 0;
            this.player.yAcceleration = 0;
        }
        // friction
        if (this.player.y === canvas.height - this.player.height && !this.player.isGrappled) {
            this.player.xVelocity *= 1 - FRICTION;
        }
        this.player.x += this.player.xVelocity;
        this.player.y += this.player.yVelocity;
    }

    detectCollisions() {
        // wall / floor collision
        if (this.player.x < 0 ) {
            this.player.xVelocity *= BOUNCE_FACTOR;
            this.player.x = 0;
        }
        if ((this.player.x + this.player.width) > canvas.width) {
            this.player.xVelocity *= BOUNCE_FACTOR;
            this.player.x = canvas.width - this.player.width;
        }
        if (this.player.y < 0 ) {
            this.player.yVelocity *= BOUNCE_FACTOR;
            this.player.y = 0;
        }
        if ((this.player.y + this.player.height) > canvas.height) {
            this.player.yVelocity *= BOUNCE_FACTOR;
            this.player.y = canvas.height - this.player.height;
        }
    }
}