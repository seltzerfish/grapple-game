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
        if (DEBUG) {
            this.renderDebugInfo(this.ctx)
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    drawBackground() {
        let bg = this.level.background;
        let layer;

        for (layer of bg.layers) {
            const img = document.getElementById(layer.image);
            const zoomFactor = Math.pow(this.camera.zoom, layer.relativeSpeed);
            // pretty sure this is wrong somehow
            const x = Math.round((layer.x * zoomFactor) + (this.camera.zoomOffsetX * layer.relativeSpeed));
            const y = Math.round((layer.y * zoomFactor) + (this.camera.zoomOffsetY * layer.relativeSpeed));
            const w = (img.width * zoomFactor);
            const h = (img.height * zoomFactor);
            this.fillCanvasWithImage(img, x, y, w, h);
        }
    }

    fillCanvasWithImage(img, x, y, w, h) {
        // get the repeated position closest to the viewport
        const xStart = x % w;
        const yStart = y % h;

        const repetitionsLeft = Math.max(0, Math.ceil(xStart / w));
        const repetitionsRight = Math.max(0, Math.ceil((canvas.width - (xStart + w)) / w));
        const repetitionsTop = Math.max(0, Math.ceil(yStart / h));
        const repetitionsBottom = Math.max(0, Math.ceil((canvas.height - (yStart + h)) / h));

        const beginDrawingX = xStart - (repetitionsLeft * w);
        const beginDrawingY = yStart - (repetitionsTop * h);
        const repetitionsX = 1 + repetitionsLeft + repetitionsRight;
        const repetitionsY = 1 + repetitionsTop + repetitionsBottom;

        // draw each image
        for (let i = 0; i < repetitionsX; i++) {
            for (let j = 0; j < repetitionsY; j++) {
                this.ctx.drawImage(img, beginDrawingX + (i * w), beginDrawingY + (j * h), w, h);
            }
        }
    }

    drawPlayer() {
        if (this.level.player.grapple) {
            this.drawGrappleWire();
        }
        this.renderSprite(this.level.player.arm);
    }

    drawGrappleWire() {
        this.ctx.beginPath();
        this.ctx.lineWidth = Math.max(4 * this.camera.zoom, 1);
        this.ctx.strokeStyle = "#ced25c";

        this.ctx.moveTo(this.camera.translateX(this.level.player.arm.getHandPositionX()),
            this.camera.translateY(this.level.player.arm.getHandPositionY()));

        this.ctx.lineTo(this.camera.translateX(this.level.player.grapple.getWirePositionX()),
            this.camera.translateY(this.level.player.grapple.getWirePositionY()));

        this.ctx.stroke();
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1;
    }

    renderSprite(sprite) {

        if (sprite.rotation) {
            this.drawRotatedSprite(sprite);
        } else if (sprite.srcImage === "") { // TODO: remove this block once everything has an image
            let hitbox;
            for (hitbox of sprite.hitboxes) {
                this.ctx.fillStyle = (hitbox.isDeadly) ? "#d703fc" : "white";
                const zoomFactor = this.camera.zoom;
                const x = this.camera.translateX(sprite.x + hitbox.xOffset);
                const y = this.camera.translateY(sprite.y + hitbox.yOffset)
                const w = Math.round(hitbox.width * zoomFactor);
                const h = Math.round(hitbox.height * zoomFactor);
                this.ctx.fillRect(x, y, w, h);
            }
        } else {
            const zoomFactor = this.camera.zoom;
            const x = this.camera.translateX(sprite.x);
            const y = this.camera.translateY(sprite.y);
            const w = Math.round(sprite.width * zoomFactor);
            const h = Math.round(sprite.height * zoomFactor);
            const img = document.getElementById(sprite.srcImage);
            this.ctx.drawImage(img, x, y, w, h);
        }
    }


    /**
     * Moves to the sprite's point of rotation (position plus rotationOffset),
     * rotates the context by sprite.rotation, 
     * then draws the sprite from the top left corner (point of rotation minus rotationOffset) 
     */
    drawRotatedSprite(sprite) {
        const img = document.getElementById(sprite.srcImage);
        this.ctx.save();
        this.ctx.translate(this.camera.translateX(sprite.getPointOfRotationX()), this.camera.translateY(sprite.getPointOfRotationY()));
        this.ctx.rotate(sprite.rotation);
        const zoomFactor = this.camera.zoom;
        const x = -Math.round(sprite.rotationOffsetX * zoomFactor);
        const y = -Math.round(sprite.rotationOffsetY * zoomFactor);
        const w = Math.round(sprite.width * zoomFactor);
        const h = Math.round(sprite.height * zoomFactor);
        this.ctx.drawImage(img, x, y, w, h);
        this.ctx.restore();
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
        this.drawMousePosition();
    }

    drawHitboxes() {
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 4;
        let sprites = this.level.solids;
        for (let i = 0; i < sprites.length; i++) {
            let sprite = sprites[i];
            for (let j = 0; j < sprite.hitboxes.length; j++) {
                let hitbox = sprite.hitboxes[j];
                if (hitbox instanceof Hitbox) {
                    this.ctx.strokeRect(this.camera.translateX(sprite.x + hitbox.xOffset),
                    this.camera.translateY(sprite.y + hitbox.yOffset), hitbox.width * this.camera.zoom,
                    hitbox.height * this.camera.zoom);
                }
                else if (hitbox instanceof CircularHitbox) {
                    this.ctx.beginPath();
                    this.ctx.arc(this.camera.translateX(sprite.x + hitbox.xOffset),
                    this.camera.translateY(sprite.y + hitbox.yOffset), hitbox.radius * this.camera.zoom, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }
        }
        sprites = this.level.actors;
        for (let i = 0; i < sprites.length; i++) {
            let sprite = sprites[i];
            for (let j = 0; j < sprite.hitboxes.length; j++) {
                let hitbox = sprite.hitboxes[j];
                if (hitbox instanceof Hitbox) {
                    this.ctx.strokeRect(this.camera.translateX(sprite.x + hitbox.xOffset),
                    this.camera.translateY(sprite.y + hitbox.yOffset), hitbox.width * this.camera.zoom,
                    hitbox.height * this.camera.zoom);
                }
                else if (hitbox instanceof CircularHitbox) {
                    this.ctx.beginPath();
                    this.ctx.arc(this.camera.translateX(sprite.x + hitbox.xOffset),
                    this.camera.translateY(sprite.y + hitbox.yOffset), hitbox.radius * this.camera.zoom, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }
        }
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "black";
    }

    drawGrappleLength() {
        this.ctx.strokeStyle = "green";
        this.ctx.beginPath();
        this.ctx.arc(this.camera.translateX(this.level.player.getCenterX()), this.camera.translateY(this.level.player.getCenterY()), (this.level.player.grappleLength - 60) * this.camera.zoom, 0, 2 * Math.PI);
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

    drawMousePosition() {
        this.ctx.fillStyle = "yellow";
        this.ctx.fillRect(this.camera.translateX(this.camera.translateInputX(this.level.controller.mouse.x)) - 5,
            this.camera.translateY(this.camera.translateInputY(this.level.controller.mouse.y)) - 5, 10, 10);
        this.ctx.fillStyle = "white";

    }
}


toggleDebug = function () {
    if (DEBUG) {
        DEBUG = false
    } else {
        DEBUG = true;
    }
}
