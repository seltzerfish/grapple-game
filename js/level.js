/** 
 * Level class. Contains references to all actors/solids within.
 * Also sets the variable physics parameters. 
 * Updates all sprites to a new timestep when update() is called.
 * 
 * Will also eventually contain a grid system to make collision detection more efficient.
 * i.e actors should only consider collisions between themselves and other sprites near them, rather than
 * every sprite on the map.
 */
class Level {

    constructor(width, height, background, playerStartX, playerStartY, gravity, solids = [], actors = []) {
        this.width = width;
        this.height = height;
        this.background = background;
        this.playerStartX = playerStartX;
        this.playerStartY = playerStartY;
        this.gravity = gravity;
        this.solids = solids;
        this.actors = actors;

        // These values must be set after instantiation in main.js
        this.camera = null;
        this.player = null;
        this.controller = null;
    }

    update() {
        this.handleControllerInput();
        this.camera.updatePosition();
        this.background.update(this.camera);
        
        let actor;
        for (actor of this.actors) {
            actor.act(this);
            actor.animate();
        }
    }

    handleControllerInput() {
        // nothing here yet. eventually will detect things like hitting the esc key for pausing.
    }

    /**
     * Return all solids that are close enough to the given actor that collision is possible.
     * @param {Actor} actor 
     */
    getPossibleSolidCollisions(actor) {
        // TODO: implement a grid system to make this smarter.
        return this.solids;
    }

    /**
     * Return all actors that are close enough to the given actor that collision is possible.
     * @param {Actor} actor 
     */
    getPossibleActorCollisions(actor) {
        // TODO: implement a grid system to make this smarter.
        return this.actors;
    }
}