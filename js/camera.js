
class Camera {
    constructor(anchor) {
        this.anchor = anchor;
        this.x = 0;
        this.y = 0;
        this.followStrength = 0.001;
        this.zoom = 1;
        this.zoomStrength = 0.1;
        this.zoomOffsetX = 0;
        this.zoomOffsetX = 0;
    }


    updatePosition() {
        const xDistance = this.anchor.getCenterX() - this.x;
        const yDistance = this.anchor.getCenterY() - this.y;
        this.x += Math.round(Math.min(this.followStrength * Math.pow(xDistance, 2) * Math.sign(xDistance), xDistance));
        this.y += Math.round(Math.min(this.followStrength * Math.pow(yDistance, 2) * Math.sign(yDistance), yDistance));
    }

    updateZoom(targetZoom) {
        const diff = targetZoom - this.zoom;
        this.zoom += diff * this.zoomStrength;
        this.zoomOffsetX = Math.round((1 - this.zoom) * canvas.width * 0.5);
        this.zoomOffsetY = Math.round((1 - this.zoom) * canvas.height * 0.5);
    }

    // Translate absolute position to relative position (to the camera).
    translateX(x) {
        return Math.round((x - this.x + (canvas.width / 2)) * this.zoom) + this.zoomOffsetX;
    }
    translateY(y) {
        return Math.round((y - this.y + (canvas.height / 2)) * this.zoom) + this.zoomOffsetY;
    }

    // Translate position relative to the camera to absolute position on the canvas
    translateInputX(x) {
        return (this.x + (x - (canvas.width / 2)) / this.zoom);
    }

    translateInputY(y) {
        return (this.y + (y- (canvas.height / 2)) / this.zoom);
    }

}