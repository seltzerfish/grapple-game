const LEVEL_1 = {
    width: 10000,
    height: 5000,
    playerStartX: -350,
    playerStartY: 200,
    solids: [
        new Solid(500,300,300,100),
        new Solid(1400,200,100,300),
        // new Solid(-1400,800,10000,30),
        new Dog(-400, 300),
        new Dog(100, 0, 150, 200)
    ],
    actors: []
}