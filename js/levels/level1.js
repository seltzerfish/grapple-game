var LEVEL_1 = (function() {
  "use strict"

  // ideally would have a js compiler that could pull in json deps automatically.
  // For now, this is a copy-paste from leveldev/parse_test.json
  let level_json = {"solids": [{"x": 0, "y": 900, "width": 250, "height": 100}, {"x": 200, "y": 520, "width": 100, "height": 100}, {"x": 470, "y": 240, "width": 470, "height": 100}, {"x": 780, "y": 500, "width": 160, "height": 100}]}

  let solids = level_json["solids"].map(obj => new Solid(obj.x, obj.y, obj.width, obj.height))
  return new Level(
      1000, // width
      1900, // height
      new ParallaxBackground(["bg1_1", "bg1_2", "bg1_3"], [0.05, 0.1, 0.15]), // background
      27, // player start pos. X
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

