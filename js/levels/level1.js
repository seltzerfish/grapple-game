
var LEVEL_1 = new Level(
    10000, // width
    2000, // height
    new ParallaxBackground([], []), // background
    -350, // player start pos. X
    200, // player start pos. Y
    0.25, // gravity constant
    [ // solids
        new Solid(500, 300, 300, 100),
        new Solid(1400, 200, 100, 300),
        new Dog(-400, 300),
        new Dog(100, 0, 150, 200)
    ],
    [] // actors
);