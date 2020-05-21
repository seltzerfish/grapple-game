const DEBUG = true;

//TODO: decide on whether to use the term "render" or "draw" for all methods
class Renderer {
    constructor(world, ctx, camera) {
        this.ctx = ctx;
        this.world = world;
        this.camera = camera;
        this.accelerationGraph = [];
    }

    render() {
        this.clearCanvas();
        this.drawPlayer();
        this.drawSpritesOnLevel();
        if (DEBUG) { this.renderDebugInfo(this.ctx) }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    drawPlayer() {
        if (this.world.player.isGrappled) { this.drawGrapple(ctx) }
        this.renderSprite(this.world.player);
    }

    drawGrapple() {
        this.ctx.beginPath();

        this.ctx.moveTo(this.camera.translateX(this.world.player.x) + (this.world.player.width / 2),
            this.camera.translateY(this.world.player.y) + 20);

        this.ctx.lineTo(this.camera.translateX(this.world.player.grappledX),
            this.camera.translateY(this.world.player.grappledY));

        this.ctx.stroke();
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
        for (let i = 0; i < this.world.level.solids.length; i++) {
            this.renderSprite(this.world.level.solids[i]);
        }
    }

    renderDebugInfo() {
        this.ctx.font = "30px Arial";
        this.world.player.topSpeed = Math.max(this.world.player.topSpeed, this.world.player.getVelocity());
        this.ctx.fillText("Velocity: " + this.world.player.getVelocity().toFixed(1), 10, 30);
        this.ctx.fillText("Top Velocity: " + this.world.player.topSpeed.toFixed(1), 10, 60);
        this.ctx.fillText("x: " + this.world.player.x.toFixed(0), 300, 30);
        this.ctx.fillText("y: " + this.world.player.y.toFixed(0), 430, 30);
        this.drawHitboxes();
        this.drawAccelerationCompass();
    }
    
    drawHitboxes() {
        let sprites = this.world.level.solids;
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 3;
        for (let i = 0; i < sprites.length; i++) {
            let sprite = sprites[i];
            for (let j = 0; j < sprite.hitboxes.length; j++) {
                let hitbox = sprite.hitboxes[j];
                this.ctx.strokeRect(this.camera.translateX(sprite.x + hitbox.xOffset), this.camera.translateY(sprite.y + hitbox.yOffset), hitbox.width, hitbox.height);
            }
        }
        let playerHitboxes = this.world.player.hitboxes;
        for (let i = 0; i < playerHitboxes.length; i++) {
            let hitbox = playerHitboxes[i];
            this.ctx.strokeRect(this.camera.translateX(this.world.player.x + hitbox.xOffset), this.camera.translateY(this.world.player.y + hitbox.yOffset), hitbox.width, hitbox.height);
        }
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "black";
    }

    drawAccelerationCompass() {
        // Hacky AF. don't feel like refactoring. recommended not to touch too much
        const scalingFactor = 35;
        const r = ACCELERATION_CAP * scalingFactor;
        this.ctx.beginPath();
        this.ctx.arc(100, 150, r, 0, 2 * Math.PI);
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(100, 150);
        const x = this.world.player.xAcceleration * scalingFactor;
        const y = this.world.player.yAcceleration * scalingFactor;
        const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        const red = 255 * (dist / r);
        const green = 255 - (255 * (dist / r));
        this.ctx.strokeStyle = 'rgb(' + red + ", " + green + ", 0)";
        this.accelerationGraph.push([dist, this.ctx.strokeStyle]);
        this.ctx.lineTo(100 + x, 150 + y);
        this.ctx.lineWidth = 7;
        this.ctx.stroke();

        if (this.accelerationGraph.length > 160) {
            this.accelerationGraph.shift();
        }
        this.ctx.lineWidth = 2;

        let startX = 30;
        let startY = 390;
        for (let i = 0; i < this.accelerationGraph.length; i++) {
            let entry = this.accelerationGraph[i];
            this.ctx.beginPath();
            this.ctx.moveTo(startX + i, startY);
            this.ctx.strokeStyle = entry[1];
            this.ctx.lineTo(startX + i, startY - (entry[0] * 1.5));
            this.ctx.stroke();
        }

        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "black";
        this.ctx.fillText("Acceleration", 30, 260);


    }

}