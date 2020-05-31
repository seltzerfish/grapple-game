class Vector {

    constructor(x, y) {
        if (arguments.length === 0) {
            this.x = 0;
            this.y = 0;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    add(v, y) {
        if (arguments.length === 1) {
            this.x += v.x;
            this.y += v.y;
        } else {

            this.x = this.x + v;
            this.y = this.y + y;
        }
    }

    subtract(v, y) {
        if (arguments.length === 1) {
            this.x -= v.x;
            this.y -= v.y;
        } else {
            this.x -= v;
            this.y -= y;
        }
    }

    multiply(s) {
        this.x *= s;
        this.y *= s;
    }

    divide(s) {
        if (s === 0) {
            return;
        }
        this.x /= s;
        this.y /= s;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    norm() {
        if (this.mag() > 0) {
            return this.divide(this.mag());
        }
    }

    dot(v, y) {
        if (arguments.length === 1) {
            return this.x * v + this.y * y;
        }
        return this.x * v.x + this.y * v.y;
    }
}