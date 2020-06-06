
var LEVEL_1 = new Level(
    1000, // width
    1700, // height
    new ParallaxBackground(["bg1_1", "bg1_2", "bg1_3"], [0.05, 0.1, 0.15]), // background
    -350, // player start pos. X
    700, // player start pos. Y
    0.25, // gravity constant
    [ // solids
        new Solid(500, 800, 300, 100),
        new Solid(1400, 700, 100, 300),
        new Solid(1200, 200, 100, 200),
        new Dog(-400, 800),
        new Jupiter(100, 500    )
    ],
    [] // actors
);