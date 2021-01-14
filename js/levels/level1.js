var LEVEL_1 = (function() {
  "use strict";

  // ideally would have a js compiler that could pull in json deps automatically.
  // For now, this is a copy-paste from leveldev/parse_test.json
  let level_json = {"solids": [{"x": 680, "y": 720, "width": 100, "height": 80, "shape": 4}, {"x": 234, "y": 940, "width": 846, "height": 488, "shape": 1}, {"x": 1077, "y": 1410, "width": 1510, "height": 22, "shape": 1}, {"x": 1051, "y": 558, "width": 166, "height": 133, "shape": 1}, {"x": 2009, "y": 94, "width": 166, "height": 133, "shape": 1}, {"x": 2941, "y": -662, "width": 166, "height": 133, "shape": 3}, {"x": 3486, "y": -392, "width": 166, "height": 133, "shape": 1}, {"x": 1639, "y": 380, "width": 73, "height": 73, "shape": 2}, {"x": 2517, "y": -210, "width": 73, "height": 73, "shape": 2}, {"x": 2625, "y": -7, "width": 56, "height": 302, "shape": 4}]}

  let solids = level_json["solids"].map(obj => {
    if (obj.shape == 1) {
      return new Solid(obj.x, obj.y, obj.width, obj.height);
    } else if (obj.shape == 2) {
      return new Jupiter(obj.x, obj.y);
    } else if (obj.shape == 3) {
      return new Dog(obj.x, obj.y);
    } else if (obj.shape == 4) {
      return new DeadlySolid(obj.x, obj.y, obj.width, obj.height);
    }
  })
  return new Level(
      3000, // width
      1500, // height
      new ParallaxBackground(["bg1_1", "bg1_2", "bg1_3"], [0.05, 0.1, 0.15]), // background
      777, // player start pos. X
      848, // player start pos. Y
      0.25, // gravity constant
      solids, // solids
      [] // actors
  )
})()

var old_LEVEL_1 = new Level(
    1000, // width
    1900, // height
    new ParallaxBackground(["bg1_1", "bg1_2", "bg1_3"], [0.05, 0.1, 0.15]), // background
    -1043, // player start pos. X
    1200, // player start pos. Y
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


