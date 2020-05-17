/**
 * Handles input and updates player object
 */
class Controller {

    constructor() {
        this.mouseDown = false;
        this.mouseDownX = 0;
        this.mouseDownY = 0;
    }

    keyListener = function (event) {
        if (event.type == "mousedown") {
            this.mouseDown = true;
            this.mouseDownX = event.offsetX;
            this.mouseDownY = event.offsetY;
        }
        else if (event.type == "mouseup") {
            this.mouseDown = false;
            this.mouseDownX = 0;
            this.mouseDownY = 0;
        }
        else { }
    }

}