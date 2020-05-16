
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 40;




const GRAPPLE_STRENGTH = 0.6;
const GRAVITY = 0.25
const BOUNCE_FACTOR = -0.2;

//TODO: debug esc menu with parameter tunings
//TODO: ragdoll physics


/* 
Inverse Acceleration Scaling: The closer you get to the point where
you grappled, the more you accelereate. 
**/
const INVERSE_ACCELERATION_SCALING = true;
const INVERSE_ACC_STRENGTH_X = 50;
const INVERSE_ACC_STRENGTH_Y = 80;
const MAX_ACCELERATION = 3;
const FRICTION = 0.2;

const playerSprite = document.getElementById("sprite");
var player = {
    w: 30,
    h: 30,
    x: 300,
    y: 0,
    Vx: 0,
    Vy: 0,
    accX: 0,
    accY: 0,

    grappled: false,
    grappledX: 0,
    grappledY: 0
};




function limitStrength(uX, uY) {
    const accStrength = Math.sqrt(Math.pow(uX, 2) + Math.pow(uY, 2));
    if (accStrength > MAX_ACCELERATION) {
        uX = Math.sqrt(Math.pow(uX, 2) * (MAX_ACCELERATION / accStrength));   
        uY = Math.sqrt(Math.pow(uY, 2) * (MAX_ACCELERATION / accStrength));   
    }
}

function playerIsMovingTowardsGrappleVertically() {
    if (!player.grappled) {
        return false;
    }
    if (player.grappledY - player.y > 0 && player.Vy > 0) {
        return true;
    }
    if (player.grappledY - player.y < 0 && player.Vy < 0) {
        return true;
    }
    return false;
}
function playerIsMovingTowardsGrappleHorizontally() {
    if (!player.grappled) {
        return false;
    }
    if (player.grappledX - player.x > 0 && player.Vx > 0) {
        return true;
    }
    if (player.grappledX - player.x < 0 && player.Vx < 0) {
        return true;
    }
    return false;
}

function updatePlayer() {
    if (controller.left) {
        player.Vx -= 1;
    }
    if (controller.right) {
        player.Vx += 1;
    }

    player.Vy += GRAVITY 

    if (player.grappled) {
        const grappleLength = Math.sqrt(
            Math.pow(player.x - player.grappledX, 2) +
            Math.pow(player.y - player.grappledY, 2)
        );
        
        let uX = (player.grappledX - player.x) / grappleLength;
        let uY = (player.grappledY - player.y) / grappleLength;
        if (INVERSE_ACCELERATION_SCALING) {
            // if (playerIsMovingTowardsGrappleHorizontally()) {
            //     uX += (INVERSE_ACC_STRENGTH_X / grappleLength) * (uX / Math.abs(uX));
            // }
            uX += (INVERSE_ACC_STRENGTH_X / grappleLength) * (uX / Math.abs(uX));
            // if (playerIsMovingTowardsGrappleVertically()) {
            //     uY += (INVERSE_ACC_STRENGTH_Y / grappleLength) * (uY / Math.abs(uY));
            // }
            uY += (INVERSE_ACC_STRENGTH_Y / grappleLength) * (uY / Math.abs(uY));
        }
        
        limitStrength(uX, uY);
        player.Vx += uX * GRAPPLE_STRENGTH;
        player.Vy += uY * GRAPPLE_STRENGTH;
        console.log(player.grappledX, player.grappledY);
    }
    // friction
    if (player.y === canvas.height - player.h && !player.grappled) {
        player.Vx *= 1 - FRICTION;
    }
    
    player.x += player.Vx;
    player.y += player.Vy;

    // wall / floor collision
    if (player.x < 0 ) {
        player.Vx *= BOUNCE_FACTOR;
        player.x = 0;
    }
    if ((player.x + player.w) > canvas.width) {
        player.Vx *= BOUNCE_FACTOR;
        player.x = canvas.width - player.w;
    }
    if (player.y < 0 ) {
        player.Vy *= BOUNCE_FACTOR;
        player.y = 0;
    }
    if ((player.y + player.h) > canvas.height) {
        player.Vy *= BOUNCE_FACTOR;
        player.y = canvas.height - player.h;
    }

}

function calculateVelocity() {
    return Math.sqrt(
        Math.pow(player.Vx, 2) +
        Math.pow(player.Vy, 2)
    );
}

var maxVelocity = 0;

function drawPlayer() {
    if (player.grappled) {
        ctx.beginPath();
        ctx.moveTo(player.x + (player.w / 2), player.y + 20)
        ctx.lineTo(player.grappledX, player.grappledY);
        ctx.stroke();
    }
    ctx.fillRect(player.x, player.y, player.w, player.h);

    ctx.font = "30px Arial";
    maxVelocity = Math.max(maxVelocity, calculateVelocity());
    ctx.fillText("Velocity: " + calculateVelocity().toFixed(1) , 10, 30); 
    ctx.fillText("Top Velocity: " + maxVelocity.toFixed(1) , 10, 60);
    ctx.fillText("inverse acceleration scaling w/ grapple length", 300, 30);

}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayer();
    drawPlayer();
    requestAnimationFrame(update);

}



update();
window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.addEventListener("mousedown", controller.keyListener);
window.addEventListener("mouseup", controller.keyListener);
