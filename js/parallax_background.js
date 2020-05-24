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
            this.layers[i].x = Math.round(camera.x) * this.layers[i].speed * -1;
            this.layers[i].y = Math.round(camera.y) * this.layers[i].speed * -1;
        }
    }
}

class BackgroundLayer {
    constructor(image, speed) {
        this.image = image;
        this.speed = speed;
        this.x = 0;
        this.y = 0;
    }
}