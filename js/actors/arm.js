/**
 * Player class. Contains all movement logic and instance variables.
 */
class Arm extends Actor {

    constructor(player, controller, x = 0, y = 300, w = 20, h = 36) {
        super(x, y, w, h, "armClosed");
        this.hitboxes = [];
        this.player = player;
        this.controller = controller;
        this.pinToLeftSide();
        this.playerOffsetY = Math.round(this.player.height * 0.4);
        this.rotationOffsetX = Math.round(this.width / 2);
        this.rotationOffsetY = Math.round(this.height * 0.1);
        this.distanceFromShoulderToHand = Math.round(this.height * 0.7);
    }

    act(level) {
        this.x = this.player.x + this.playerOffsetX;
        this.y = this.player.y + this.playerOffsetY;
        if (this.player.grapple) {
            this.pointTowards(this.player.grapple.getCenterX(), this.player.grapple.getCenterY());
        }
        else {
            this.pointTowards(level.camera.translateInputX(this.controller.mouse.x),
                level.camera.translateInputY(this.controller.mouse.y));
        }
    }

    openHand() {
        this.srcImage = "armOpen";
    }

    closeHand() {
        this.srcImage = "armClosed";
    }

    /**
     * Get the position at which the grapple should spawn, and where the line should be drawn
     */
    getHandPositionX() {
        return Math.round(this.getPointOfRotationX() + (Math.cos(this.rotation + Math.PI / 2) * this.distanceFromShoulderToHand));

    }

    getHandPositionY() {
        return Math.round(this.getPointOfRotationY() + (Math.sin(this.rotation + Math.PI / 2) * this.distanceFromShoulderToHand));
    }

    pointTowards(x, y) {
        this.rotation = MathUtil.calculateTheta(this.getPointOfRotationY() - y,
            this.getPointOfRotationX() - x) + Math.PI / 2;
    }

    pinToRightSide() {
        this.playerOffsetX = this.player.width * 0.5;
    }

    pinToLeftSide() {
        this.playerOffsetX = Math.round(this.player.width * 0.05);
    }

}