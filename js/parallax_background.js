class ParallaxBackground {

    constructor(images, imageSpeeds) {
        if (images.length !== imageSpeeds.length) {
            throw new Error('length mismatch between background layers and layer speeds');
        }
        this.layers = [];
        for (let i = 0; i < images.length; i++) {
            this.layers.push(new BackgroundLayer(images[i], imageSpeeds[i]));
        }
    }

    update(camera) {
        for (let i = 0; i < this.layers.length; i++) {
            const x = Math.round(camera.x * this.layers[i].relativeSpeed * -1);
            const y = Math.round(camera.y * this.layers[i].relativeSpeed * -1);
            this.layers[i].setPosition(x, y);
        }
    }
}

class BackgroundLayer {
    constructor(image, relativeSpeed) {
        this.image = image;
        this.relativeSpeed = relativeSpeed;
        this.x = 0;
        this.y = 0;
        this.xOffset = MathUtil.getRandomInt(100000);
        this.yOffset = MathUtil.getRandomInt(100000);
    }

    setPosition(x, y) {
        this.x = x + this.xOffset;
        this.y = y + this.yOffset;
    }
}