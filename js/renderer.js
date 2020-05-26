let DEBUG = false;

//TODO: decide on whether to use the term "render" or "draw" for all methods
class Renderer {
    constructor(level, ctx, camera) {
        this.ctx = ctx;
        this.level = level;
        this.camera = camera;
        this.accelerationGraph = [];
    }

    render() {
        this.clearCanvas();
        this.drawBackground();
        this.drawOtherSprites();
        this.drawPlayer();

        if (DEBUG) { this.renderDebugInfo(this.ctx) }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    drawBackground() {
        let bg = this.level.background;
        let layer;

        for (layer of bg.layers) {
            const img = document.getElementById(layer.image);
            this.fillCanvasWithImage(img, layer.x, layer.y);
        }
    }

    fillCanvasWithImage(img, x, y) {
        // get the repeated position closest to the viewport
        const xStart = x % img.width;
        const yStart = y % img.height;

        const repetitionsLeft = Math.max(0, Math.ceil(xStart / img.width));
        const repetitionsRight = Math.max(0, Math.ceil((canvas.width - (xStart + img.width)) / img.width));
        const repetitionsTop = Math.max(0, Math.ceil(yStart / img.height));
        const repetitionsBottom = Math.max(0, Math.ceil((canvas.height - (yStart + img.height)) / img.height));

        const beginDrawingX = xStart - (repetitionsLeft * img.width);
        const beginDrawingY = yStart - (repetitionsTop * img.height);
        const repetitionsX = 1 + repetitionsLeft + repetitionsRight;
        const repetitionsY = 1 + repetitionsTop + repetitionsBottom;

        // draw each image
        for (let i = 0; i < repetitionsX; i++) {
            for (let j = 0; j < repetitionsY; j++) {
                this.ctx.drawImage(img, beginDrawingX + (i * img.width), beginDrawingY + (j * img.height));
            }
        }
    }

    drawPlayer() {
        if (this.level.player.grapple) { this.drawGrappleWire() }
        this.renderSprite(this.level.player);
    }

    drawGrappleWire() {
        this.ctx.beginPath();
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = "#ced25c";

        this.ctx.moveTo(this.camera.translateX(this.level.player.getCenterX()),
            this.camera.translateY(this.level.player.getCenterY()));

        this.ctx.lineTo(this.camera.translateX(this.level.player.grapple.getWirePositionX()),
            this.camera.translateY(this.level.player.grapple.getWirePositionY()));

        this.ctx.stroke();
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1;


    }

    renderSprite(sprite) {
        if (sprite.rotation) {
            this.ctx.save();
            this.ctx.translate(this.camera.translateX(sprite.x) + Math.round(sprite.width / 2), this.camera.translateY(sprite.y) + Math.round(sprite.height / 2));
            this.ctx.rotate(sprite.rotation);
            const img = document.getElementById(sprite.srcImage);
            this.ctx.drawImage(img, -Math.round(sprite.width / 2), -Math.round(sprite.height / 2), sprite.width, sprite.height);
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

    drawOtherSprites() {
        for (let i = 0; i < this.level.solids.length; i++) {
            this.renderSprite(this.level.solids[i]);
        }
        for (let i = 0; i < this.level.actors.length; i++) {
            this.renderSprite(this.level.actors[i]);
        }
    }


    /**
     * !!!!!!!!!!!!!!    WARNING    !!!!!!!!!!!!!!
     * 
     * Past this point, the rest of the code in this class is for rendering debug visuals. 
     * It is hideous, inefficient, and unreadable.
     * Proceed with caution
    */


    renderDebugInfo() {
        this.ctx.font = "30px Arial";
        this.level.player.topSpeed = Math.max(this.level.player.topSpeed, this.level.player.getVelocity());
        this.ctx.fillText("Velocity: " + this.level.player.getVelocity().toFixed(1), 10, 30);
        this.ctx.fillText("Top Velocity: " + this.level.player.topSpeed.toFixed(1), 10, 60);
        this.ctx.fillText("x: " + this.level.player.x.toFixed(0), 300, 30);
        this.ctx.fillText("y: " + this.level.player.y.toFixed(0), 430, 30);
        this.drawHitboxes();
        this.drawGrappleLength();
        this.drawAccelerationCompass();
    }

    drawHitboxes() {
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 3;
        let sprites = this.level.solids;
        for (let i = 0; i < sprites.length; i++) {
            let sprite = sprites[i];
            for (let j = 0; j < sprite.hitboxes.length; j++) {
                let hitbox = sprite.hitboxes[j];
                this.ctx.strokeRect(this.camera.translateX(sprite.x + hitbox.xOffset), this.camera.translateY(sprite.y + hitbox.yOffset), hitbox.width, hitbox.height);
            }
        }
        let playerHitboxes = this.level.player.hitboxes;
        for (let i = 0; i < playerHitboxes.length; i++) {
            let hitbox = playerHitboxes[i];
            this.ctx.strokeRect(this.camera.translateX(this.level.player.x + hitbox.xOffset), this.camera.translateY(this.level.player.y + hitbox.yOffset), hitbox.width, hitbox.height);
        }
        sprites = this.level.actors;
        for (let i = 0; i < sprites.length; i++) {
            let sprite = sprites[i];
            for (let j = 0; j < sprite.hitboxes.length; j++) {
                let hitbox = sprite.hitboxes[j];
                this.ctx.strokeRect(this.camera.translateX(sprite.x + hitbox.xOffset), this.camera.translateY(sprite.y + hitbox.yOffset), hitbox.width, hitbox.height);
            }
        }
        playerHitboxes = this.level.player.hitboxes;
        for (let i = 0; i < playerHitboxes.length; i++) {
            let hitbox = playerHitboxes[i];
            this.ctx.strokeRect(this.camera.translateX(this.level.player.x + hitbox.xOffset), this.camera.translateY(this.level.player.y + hitbox.yOffset), hitbox.width, hitbox.height);
        }
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "black";
    }

    drawGrappleLength() {
        this.ctx.strokeStyle = "green";
        this.ctx.beginPath();
        this.ctx.arc(this.camera.translateX(this.level.player.getCenterX()), this.camera.translateY(this.level.player.getCenterY()), this.level.player.grappleLength - 60, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.strokeStyle = "black";
    }

    drawAccelerationCompass() {
        // Hacky AF. don't feel like refactoring. recommended not to touch too much
        const scalingFactor = 35;
        const r = this.level.player.accelerationCap * scalingFactor;
        this.ctx.beginPath();
        this.ctx.arc(100, 150, r, 0, 2 * Math.PI);
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(100, 150);
        const x = this.level.player.xAcceleration * scalingFactor;
        const y = this.level.player.yAcceleration * scalingFactor;
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
        this.ctx.beginPath();
        this.ctx.strokeStyle = "green";

        for (let i = 0; i < this.accelerationGraph.length; i++) {
            let entry = this.accelerationGraph[i];
            this.ctx.moveTo(startX + i, startY);
            // this.ctx.strokeStyle = entry[1];
            this.ctx.lineTo(startX + i, startY - (entry[0] * 1.5));

        }
        this.ctx.stroke();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "black";
        this.ctx.fillText("Acceleration", 30, 260);
    }
}


toggleDebug = function () {
    if (DEBUG) {
        DEBUG = false
    }
    else {
        DEBUG = true;
    }
}