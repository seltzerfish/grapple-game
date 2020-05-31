/**
 * Handles input and updates player object
 */
class Controller {

    constructor() {
        this.mouseDown = false;
        this.mouseDownX = 0;
        this.mouseDownY = 0;
        this.mouse = {
            x: 0,
            y: 0
        };
    }

    setMouseDown(event) {
        this.mouseDown = true;
        this.mouseDownX = event.offsetX;
        this.mouseDownY = event.offsetY;
    }

    setMouseUp() {
        this.mouseDown = false;
        this.mouseDownX = 0;
        this.mouseDownY = 0;
    }

    updateMousePos(event) {
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY;
    }
}