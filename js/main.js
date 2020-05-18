"use strict";

var time = null;
var timedelta = 0;
var animationFrameRequest = null;
var gameStateUpdated = false;
var renderFunction = null;
var canvas;
var ctx;
var game;

class Game {
  constructor() {
    this.player = new Player();
    this.controller = new Controller();
    this.world = new World(this.player, this.controller);
    this.world.setDefaultValues();
    this.renderer = new Renderer(this.world);
    window.addEventListener("mousedown", (event) => this.controller.keyListener(event));
    window.addEventListener("mouseup", (event) => this.controller.keyListener(event));
  }
}

window.onload = function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 100;
  game = new Game();
  window.requestAnimationFrame(loop);

}

function loop() {
  game.world.update();
  game.renderer.render(ctx);
  window.requestAnimationFrame(loop);
}



