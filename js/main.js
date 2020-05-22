"use strict";

var canvas;
var ctx;
var game;

class Game {
  constructor() {
    this.controller = new Controller();
    this.player = new Player(this.controller);
    this.camera = new Camera(this.player);
    this.setupLevel(LEVEL_1);
    
    // this.level.setDefaultValues();
    this.renderer = new Renderer(this.level, ctx, this.camera);
    window.addEventListener("mousedown", (event) => this.controller.keyListener(event));
    window.addEventListener("mouseup", (event) => this.controller.keyListener(event));
  }

  setupLevel(level) {
    this.level = level;
    this.player.setLevel(this.level);
    this.level.camera = this.camera;
    this.level.controller = this.controller;
    this.level.player = this.player;
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
  game.level.update();
  game.renderer.render(ctx);
  window.requestAnimationFrame(loop);
}



