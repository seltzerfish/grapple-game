const DEBUG = true;

//TODO: decide on whether to use the term "render" or "draw" for all methods
class Renderer {
    constructor(world, ctx, camera) {
        this.ctx = ctx;
        this.world = world;
        this.camera = camera;
        this.accelerationGraph = [];
    }

    render(ctx) {
        this.clearCanvas();
        this.drawPlayer();
        this.drawSpritesOnLevel();
        if (DEBUG) { this.renderDebugInfo(ctx) }
    }

    clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    drawPlayer() {
        if (this.world.player.isGrappled) { this.drawGrapple(ctx) }
        this.renderSprite(this.world.player);
    }

    drawGrapple(ctx) {
        ctx.beginPath();

        ctx.moveTo(this.camera.translateX(this.world.player.x) + (this.world.player.width / 2),
            this.camera.translateY(this.world.player.y) + 20);

        ctx.lineTo(this.camera.translateX(this.world.player.grappledX),
            this.camera.translateY(this.world.player.grappledY));

        ctx.stroke();
    }

    renderSprite(sprite) {
        if (sprite.rotation) {
            this.ctx.save();
            this.ctx.translate(this.camera.translateX(sprite.x)  + sprite.width/2, this.camera.translateY(sprite.y) + sprite.height/2);
            this.ctx.rotate(sprite.rotation);
            const img = document.getElementById(sprite.srcImage);
            this.ctx.drawImage(img, -(sprite.width/2), -(sprite.height/2), sprite.width, sprite.height);
            this.ctx.restore();
        }
        else if (sprite.srcImage == "") {
            this.ctx.fillRect(this.camera.translateX(sprite.x), this.camera.translateY(sprite.y), sprite.width, sprite.height);
        }
        else {
            const img = document.getElementById(sprite.srcImage);
            this.ctx.drawImage(img, this.camera.translateX(sprite.x), this.camera.translateY(sprite.y), sprite.width, sprite.height);
        }

    }

    drawSpritesOnLevel() {
        for (let i = 0; i < this.world.level.sprites.length; i++) {
            this.renderSprite(this.world.level.sprites[i]);
        }
    }

    renderDebugInfo(ctx) {
        ctx.font = "30px Arial";
        this.world.player.topSpeed = Math.max(this.world.player.topSpeed, this.world.player.getVelocity());
        ctx.fillText("Velocity: " + this.world.player.getVelocity().toFixed(1), 10, 30);
        ctx.fillText("Top Velocity: " + this.world.player.topSpeed.toFixed(1), 10, 60);
        this.drawAccelerationCompass(ctx);
    }

    drawAccelerationCompass(ctx) {
        // Hacky AF. recommended not to touch too much
        const scalingFactor = 35;
        const r = ACCELERATION_CAP * scalingFactor;
        ctx.beginPath();
        ctx.arc(100, 150, r, 0, 2 * Math.PI);
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
        this.accelerationGraph.push([dist, ctx.strokeStyle]);
        ctx.lineTo(100 + x, 150 + y);
        ctx.lineWidth = 7;
        ctx.stroke();

        if (this.accelerationGraph.length > 160) {
            this.accelerationGraph.shift();
        }
        ctx.lineWidth = 2;

        let startX = 30;
        let startY = 390;
        for (let i = 0; i < this.accelerationGraph.length; i++) {
            let entry = this.accelerationGraph[i];
            ctx.beginPath();
            ctx.moveTo(startX + i, startY);
            ctx.strokeStyle = entry[1];
            ctx.lineTo(startX + i, startY - (entry[0] * 1.5));
            ctx.stroke();
        }

        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.fillText("Acceleration", 30, 260);


    }

}