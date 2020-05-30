//will eventually make into a class
//multipurpose
//will hold vectors, trig calcs, etc to reduce the same code w/in different objects;
function calculateRotation(y, x, shift) {
    let _shift;
    if (shift === null) {
        _shift = 0;
    } else {
        _shift = shift;
    }
    return Math.atan2(y, x) + _shift;
}