
class Camera {
    constructor(anchor) {
        this.anchor = anchor;
        this.x = 0;
        this.y = 0;
    }

    updatePosition() {
        this.x = this.anchor.getCenterX();
        this.y = this.anchor.getCenterY();
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