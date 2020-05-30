/**
 * Player class. Contains all movement logic and instance variables.
 */
class Arm extends Actor {

    constructor(player, x = 0, y = 300, w = 20 * 0.8, h = 36 * 0.8) {
        super(x, y, w, h, "armOpen");
        this.hitboxes = [new Hitbox(this, 0, 0, this.width - 4, this.height - 4)];
        this.animationFrameDuration = 20;
        this.animationFrames = ['armOpen'];
        this.player = player;
        this.flipped = false;
        this.xOffset = 4;
        this.yOffset = 28;
        this.rotation = 0;
        this.xOrigin = 10 * 0.8;
        this.yOrigin = 2;

    }

    act() {
        this.x = this.player.x + this.xOffset;
        this.y = this.player.y + this.yOffset;
        this.rotation = calculateRotation(this.y - this.player.level.camera.translateInputY(this.player.controller.mouse.y),
            this.x - this.player.level.camera.translateInputX(this.player.controller.mouse.x), Math.PI / 2);
        this.updatePosition();
    }

    animate() {
        super.animate();
    }

}