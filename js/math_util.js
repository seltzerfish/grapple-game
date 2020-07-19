/**
 * Math utility class
 */
class MathUtil {

    static calculateTheta(opposite, adjacent) {
        return Math.atan2(opposite, adjacent);
    }

    static distanceBetween(x1, y1, x2=0, y2=0) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    static choose(array) {
        return array[Math.floor(Math.random()*array.length)];
    }


    static cartesianToPolar(x, y) {
        return {
            r: this.distanceBetween(x, y), 
            theta: this.calculateTheta(y, x)
        };
    }

    static polarToCartesian(r, theta) {
        return {
            x: r * Math.cos(theta),
            y: r * Math.sin(theta)
        };
    }

    /** 
     * Needed because JS represents rotation in radians in a range of -PI to PI.
     * In other words, JS doesn't know that a rotation of -PI is the same as a 
     * rotation of PI. So we have to handle this ourselves.
     */ 
    static minimumRotationDifference(startRadians, goalRadians) {
        if (Math.abs(goalRadians - startRadians) > Math.PI) {
            return ((Math.PI - Math.abs(startRadians)) + (Math.PI - Math.abs(goalRadians))) 
                    * Math.sign(startRadians); 
        }
        else {
            return goalRadians - startRadians;
        }
    }
}