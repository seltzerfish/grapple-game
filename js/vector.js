/*
    when working w/the vector operations they can
    accept either one two arguments.
    if argument.length === 0 then v is expected to be a vector object.
    if argument.length === 1 then v and y are expected to be numerical values.
*/
class Vector {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v, y) {
        if (arguments.length === 1) {
            return new Vector(this.x + v.x, this.y + v.y);
        } else {
            return new Vector(this.x + y, this.y + y);
        }
    }

    subtract(v, y) {
        if (arguments.length === 1) {
            return new Vector(this.x - v.x, this.y - v.y);
        } else {
            return new Vector(this.x - v, this.y - y);
        }
    }

    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    divide(scalar) {
        if (scalar === 0) {
            return;
        }
        return new Vector(this.x / scalar, this.y / scalar);
    }

    getMag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    norm() {
        if (this.mag() > 0) {
            return this.divide(this.mag());
        }
    }

    getDot(v, y) {
        if (arguments.length === 1) {
            return this.x * v + this.y * y;
        }
        return this.x * v.x + this.y * v.y;
    }
}