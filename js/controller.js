/**
 * Handles input and updates player object
 */
class Controller {

    constructor() {
        this.leftClickDown = false;
        this.leftClickDownX = 0;
        this.leftClickDownY = 0;
        this.rightClickDown = false;
        this.rightClickDownX = 0;
        this.rightClickDownY = 0;
        this.mouse = {
            x: 0,
            y: 0
        };
    }

    handleMouseDown(event) {
        if (event.button === 0) {
            this.leftClickDown = true;
            this.leftClickDownX = event.offsetX;
            this.leftClickDownY = event.offsetY;
        }
        else if (event.button === 2) {
            this.rightClickDown = true;
            this.rightClickDownX = event.offsetX;
            this.rightClickDownY = event.offsetY;
        }
    }

    handleMouseUp(event) {
        if (event.button === 0) {
            this.leftClickDown = false;
            this.leftClickDownX = 0;
            this.leftClickDownY = 0;
        }
        else if (event.button === 2) {
            this.rightClickDown = false;
            this.rightClickDownX = 0;
            this.rightClickDownY = 0;
        }
    }

    updateMousePos(event) {
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY;
    }

    preventRightClickMenu(event) {
        event.preventDefault();
    }
}