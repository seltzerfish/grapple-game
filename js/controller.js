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
        this.tabDown = false;
        this.zDown = false;
        this.xDown = false;
        const img = document.getElementById("crosshair");
        this.cursorOffsetX = Math.round(img.width / 2);
        this.cursorOffsetY = Math.round(img.height / 2);
    }

    handleMouseDown(event) {
        if (event.button === 0) {
            this.leftClickDown = true;
            this.leftClickDownX = event.offsetX + this.cursorOffsetX;
            this.leftClickDownY = event.offsetY + this.cursorOffsetY;
        }
        else if (event.button === 2) {
            this.rightClickDown = true;
            this.rightClickDownX = event.offsetX + this.cursorOffsetX;
            this.rightClickDownY = event.offsetY + this.cursorOffsetY;
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
        this.mouse.x = event.offsetX + this.cursorOffsetX;
        this.mouse.y = event.offsetY + this.cursorOffsetY;
    }

    handleKeyDown(event) {
        if (event.which === 9) {
            event.preventDefault();
            this.tabDown = true;
        }
        if (event.which === 90) {
            event.preventDefault();
            this.zDown = true;
            this.leftClickDownX = this.mouse.x;
            this.leftClickDownY = this.mouse.y;
        }
        if (event.which === 88) {
            event.preventDefault();
            this.xDown = true;
            this.rightClickDownX = this.mouse.x;
            this.rightClickDownY = this.mouse.y;
        }
    }

    handleKeyUp(event) {
        if (event.which === 9) {
            this.tabDown = false;
        }
        if (event.which === 90) {
            this.zDown = false;
        }
        if (event.which === 88) {
            this.xDown = false;
        }
    }

    preventRightClickMenu(event) {
        event.preventDefault();
    }
}