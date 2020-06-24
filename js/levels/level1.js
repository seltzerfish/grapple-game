
var LEVEL_1 = new Level(
    1000, // width
    1900, // height
    new ParallaxBackground(["bg1_1", "bg1_2", "bg1_3"], [0.05, 0.1, 0.15]), // background
    640, // player start pos. X
    740, // player start pos. Y
    0.25, // gravity constant
    [ // solids
        new PartialDeadlySolid(500, 800, 300, 100, false, true, false, false),
        new PartialDeadlySolid(1400, 700, 100, 300, false, true, false, true),
        new PartialDeadlySolid(1200, 200, 100, 200),
        new PartialDeadlySolid(2000, 500, 400, 100, false, true, false, false),
        new Solid(-900, 900, 100, 100),
        new Solid(-500, 600, 100, 100),
        new DeadlySolid(-400, 1300, 1400, 100),
        new DeadlySolid(-400, 1700, 1400, 100),
        new Solid(1000, 1200, 500, 100),
        new Solid(1000, 1800, 500, 100),
        new Solid(1500, 1200, 100, 700),
        new Dog(-1100, 1300),
        new Jupiter(85, 500),   
    ],
    [] // actors
);