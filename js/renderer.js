maxVelocity = 3;
class Renderer {
    constructor(world) {
        this.world = world;
        console.log(this.world.player);
    }
    
    /**
     * 
     * @param {!Context} ctx
     */
    render(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (this.world.player.isGrappled) {
            ctx.beginPath();
            ctx.moveTo(this.world.player.x + (this.world.player.width / 2), this.world.player.y + 20)
            ctx.lineTo(this.world.player.grappledX, this.world.player.grappledY);
            ctx.stroke();
        }
        ctx.fillRect(this.world.player.x, this.world.player.y, this.world.player.width, this.world.player.height);
    
        ctx.font = "30px Arial";
        maxVelocity = Math.max(maxVelocity, this.world.player.getVelocity());
        ctx.fillText("Velocity: " + this.world.player.getVelocity().toFixed(1) , 10, 30); 
        ctx.fillText("Top Velocity: " + maxVelocity.toFixed(1) , 10, 60);
        ctx.fillText(this.world.title, 300, 30);
    }

}