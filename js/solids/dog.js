/** 
 * Dummy class for testing multiple hitboxes for a sprite.
 */

class Dog extends Solid {
    constructor(x, y, width = 300, height = 400, srcImage = "dog") {
        super(x, y, width, height, srcImage);
        this.hitboxes.pop();
        this.hitboxes.push(new Hitbox(this, 0.07 * width, 0.05 * height, 0.35 * width, 0.5 * height));
        this.hitboxes.push(new Hitbox(this, 0.15 * width, 0.55 * height, 0.45 * width, 0.3 * height));
        this.hitboxes.push(new Hitbox(this, 0.6 * width, 0.78 * height, 0.4 * width, 0.05 * height));
    }
}