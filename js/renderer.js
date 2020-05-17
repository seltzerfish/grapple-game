const DEBUG = true;

class Renderer {
    constructor(world) {
        this.world = world;
    }

    render(ctx) {
        // clear whole canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawPlayer(ctx);

        if (DEBUG) {
            this.renderDebugInfo(ctx);
        }
    }

    drawPlayer(ctx) {
        if (this.world.player.isGrappled) {
            this.drawGrapple(ctx);
        }
        ctx.fillRect(this.world.player.x, this.world.player.y, this.world.player.width, this.world.player.height);
    }

    drawGrapple(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.world.player.x + (this.world.player.width / 2), this.world.player.y + 20);
        ctx.lineTo(this.world.player.grappledX, this.world.player.grappledY);
        ctx.stroke();
    }

    renderDebugInfo(ctx) {
        ctx.font = "30px Arial";
        this.world.player.topSpeed = Math.max(this.world.player.topSpeed, this.world.player.getVelocity());
        ctx.fillText("Velocity: " + this.world.player.getVelocity().toFixed(1), 10, 30);
        ctx.fillText("Top Velocity: " + this.world.player.topSpeed.toFixed(1), 10, 60);
        ctx.fillText(this.world.title, 300, 30);
        this.drawAccelerationCompass(ctx);
    }

    drawAccelerationCompass(ctx) {
        const scalingFactor = 35;
        const r =  ACCELERATION_CAP * scalingFactor;
        ctx.beginPath();
        ctx.arc(100, 150,r, 0, 2 * Math.PI);
        ctx.lineWidth = 2; 
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(100, 150);
        const x = this.world.player.xAcceleration * scalingFactor;
        const y = this.world.player.yAcceleration * scalingFactor;
        const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        const red = 255 * (dist / r);
        const green = 255 - (255 * (dist / r));
        ctx.strokeStyle = 'rgb(' + red + ", " + green + ", 0)"; 
        ctx.lineTo(100 + x, 150 + y);
        ctx.lineWidth = 5;
        ctx.stroke();


        ctx.lineWidth = 1;
        ctx.strokeStyle =  "black";



    }

}