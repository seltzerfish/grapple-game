/**
 * Unmoving, impassable sprites. Should be used for all terrain objects.
 */

class Solid extends Sprite {
    constructor(x, y, width, height, srcImage, canBeGrappled=true) {
        super(x, y, width, height, srcImage);
        this.canBeGrappled = canBeGrappled;
    }

}