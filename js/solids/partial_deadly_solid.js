class PartialDeadlySolid extends Solid{
    constructor(x, y, w, h, topDeadly=false, bottomDeadly=true, leftDeadly=true, rightDeadly=true, srcImage) {
        super(x, y, w, h, srcImage);
        const lineWidth = 60;
        if (topDeadly) {
            this.makeTopDeadly();
        }
        if (bottomDeadly) {
            this.makeBottomDeadly();
        }
        if (leftDeadly) {
            this.makeLeftSideDeadly();
        }
        if (rightDeadly) {
            this.makeRightSideDeadly();
        }
    }
}