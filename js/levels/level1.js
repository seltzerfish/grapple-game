
var LEVEL_1 = new Level(
    10000, // width
    3000, // height
    new ParallaxBackground(["bg1_1", "bg1_2", "bg1_3"], [0.05, 0.1, 0.15]), // background
    -350, // player start pos. X
    200, // player start pos. Y
    0.25, // gravity constant
    [ // solids
        new Solid(500, 300, 300, 100),
        new Solid(1400, 200, 100, 300),
        new Solid(1200, -300, 100, 200),
        new Dog(-400, 300),
        new Jupiter(100, 0)
    ],
    [] // actors
);