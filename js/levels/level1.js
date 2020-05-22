
const width = 10000;
const height = 2000;
const playerStartX = -350;
const playerStartY = 200;
const gravity = 0.25;
const solids = [
    new Solid(500, 300, 300, 100),
    new Solid(1400, 200, 100, 300),
    new Dog(-400, 300),
    new Dog(100, 0, 150, 200)
];
const actors = [];

var LEVEL_1 = new Level(width, height, playerStartX, playerStartY, gravity, solids, actors);