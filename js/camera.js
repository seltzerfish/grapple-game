
class Camera {
    constructor(anchor) {
        this.anchor = anchor;
        this.x = 0;
        this.y = 0;
        this.linearFollowStrength = 0.2;
        this.exponentialFollowStrength = 0.001;
        this.zoom = 1;
        this.zoomStrength = 0.1;
        this.zoomOffsetX = 0;
        this.zoomOffsetX = 0;
    }


    updatePosition() {
        const xDistance = this.anchor.getCenterX() - this.x;
        const yDistance = this.anchor.getCenterY() - this.y;
        this.moveTowardsAnchorLinearly(xDistance, yDistance);
    }

    
    moveTowardsAnchorLinearly(xDistance, yDistance) {
        this.x += Math.round(this.linearFollowStrength * xDistance);
        this.y += Math.round(this.linearFollowStrength * yDistance);
    }

    // currently unused but leaving the code for now in case we wanna use it later
    moveTowardsAnchorExponentially(xDistance, yDistance) {
        const exponentialTravelX = this.exponentialFollowStrength * Math.pow(xDistance, 2 ) * Math.sign(xDistance);
        const exponentialTravelY = this.exponentialFollowStrength * Math.pow(yDistance, 2) * Math.sign(yDistance);
        this.x += Math.round(exponentialTravelX);
        this.y += Math.round(exponentialTravelY);
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