/**
 * Handles input and updates player object
 */
class Controller {

    constructor(player) {
        this.mouseDown = false;
        this.clickX = 0;
        this.clickY = 0;
        this.player = player;
    }

    keyListener = function (event) {
        if (event.type == "mousedown") {
            this.player.isGrappled = true;
            this.player.grappledX = event.offsetX;
            this.player.grappledY = event.offsetY;
        }
        else if (event.type == "mouseup") {
            this.player.isGrappled = false;
        }
        else {}
    }

}