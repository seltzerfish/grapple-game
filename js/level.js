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
        this.spritesToBeDeleted = [];

        // These values must be set after instantiation in main.js
        this.camera = null;
        this.player = null;
        this.controller = null;
    }

    update() {
        if (this.spritesToBeDeleted.length > 0) {
            this.deleteSprites();
        }
        this.handleControllerInput();
        this.camera.updatePosition();
        this.background.update(this.camera);

        for (let actor of this.actors) {
            actor.act(this);
            actor.animate();
        }
    }

    handleControllerInput() {
        if (this.controller.tabDown) {
            this.zoomCameraToShowEntireLevel();
        }
        else {
            this.camera.anchor = this.player;
            this.camera.updateZoom(1);
        }
    }

    zoomCameraToShowEntireLevel() {
        const levelCenterX = Math.floor(this.width / 2);
        const levelCenterY = Math.floor(this.height / 2);
        const centerAnchor = new Actor(levelCenterX, levelCenterY, 1, 1);
        this.camera.anchor = centerAnchor;
        this.camera.updateZoom(0.4);
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

    markSpriteForDeletion(sprite) {
        this.spritesToBeDeleted.push(sprite)
    }

    deleteSprites() {
        for (let sprite of this.spritesToBeDeleted) {
            if (sprite instanceof Actor) {
                this.removeActor(sprite);
            }
            else if (sprite instanceof Solid) {
                this.removeSolid(sprite);
            }
        }
    }

    removeActor(actor) {
        let index = this.actors.indexOf(actor);
        if (index > -1) {
            this.actors.splice(index, 1);
        }
    }

    removeSolid(solid) {
        let index = this.solids.indexOf(actor);
        if (index > -1) {
            this.solids.splice(index, 1);
        }
    }
}