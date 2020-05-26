
class Camera {
    constructor(anchor) {
        this.anchor = anchor;
        this.x = 0;
        this.y = 0;
        this.followStrength = 0.0005;
    }

    updatePosition() {
        const xDistance = this.anchor.getCenterX() - this.x;
        const yDistance = this.anchor.getCenterY() - this.y;
        this.x += Math.round(Math.min(this.followStrength * Math.pow(xDistance, 2) * Math.sign(xDistance), xDistance));
        this.y += Math.round(Math.min(this.followStrength * Math.pow(yDistance, 2) * Math.sign(yDistance), yDistance));
    }

    // Translate absolute position to relative position (to the camera).
    translateX(x) {
        return x - this.x + (canvas.width / 2);
    }
    translateY(y) {
        return y - this.y + (canvas.height / 2);
    }

    // Translate position relative to the camera to absolute position on the canvas
    translateInputX(x) {
        return x + this.x - (canvas.width / 2);
    }
    translateInputY(y) {
        return y + this.y - (canvas.height / 2);
    }

}