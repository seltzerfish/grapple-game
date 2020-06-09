/**
 * Unmoving, impassable sprites. Should be used for all terrain objects.
 */

class Solid extends Sprite {
    constructor(x, y, width, height, srcImage, isDeadly=false) {
        super(x, y, width, height, srcImage);
        this.isDeadly = isDeadly;
    }
}