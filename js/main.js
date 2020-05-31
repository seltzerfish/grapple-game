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
    window.addEventListener("mousedown", (event) => this.controller.setMouseDown(event));
    window.addEventListener("mouseup", (event) => this.controller.setMouseUp());
    window.addEventListener('mousemove', (event) => this.controller.updateMousePos(event));
  }

  setupLevel(level) {
    this.level = level;
    this.level.camera = this.camera;
    this.level.controller = this.controller;
    this.level.player = this.player;
    this.player.x = this.level.playerStartX;
    this.player.y = this.level.playerStartY;
    this.level.actors.push(this.player);
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