"use strict";

var time = null;
var timedelta = 0;
var animationFrameRequest = null;
var gameStateUpdated = false;
var renderFunction = null;
var canvas;
var ctx;
var controller;
var player;
var world;
var renderer;

window.onload = function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 40;
    player = new Player();
    controller = new Controller(player);
    world = new World(player);
    renderer = new Renderer(world);
    window.addEventListener("keydown", controller.keyListener);
    window.addEventListener("keyup", controller.keyListener);
    window.addEventListener("mousedown", controller.keyListener);
    window.addEventListener("mouseup", controller.keyListener);
    window.requestAnimationFrame(loop);
}

function loop() {
  world.update();
  renderer.render(ctx);
  requestAnimationFrame(loop);
}




