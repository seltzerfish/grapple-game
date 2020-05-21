class CollisionHandler {
    constructor(level, player) {
        this.level = level;
        this.player = player;
    }

    handleCollisions() {
        this.handlePlayerCollisionsWithSolids();
        // TODO: handle player collisions with actors, handle actor collisions with solids
    }

    handlePlayerCollisionsWithSolids() {
        let solid;
        for (solid of this.level.solids) {
            this.handleActorCollisionWithSolid(this.player, solid, this.player.isGrappled);
        }
    }

    handleActorCollisionWithSolid(actor, solid, ignoreFriction=false) {
        if (actor.isCollidingWith(solid)) {
            // Move actor out of solid
            actor.x += actor.minTranslationX;
            actor.y += actor.minTranslationY;

            // bounce actor off of solid
            const magnitude = actor.getTranslationVectorMagnitude();
            if (actor.minTranslationX !== 0 && Math.sign(actor.minTranslationX) !== Math.sign(actor.xVelocity)) {
                actor.xVelocity *= -1 * Math.abs(actor.minTranslationX / magnitude) * solid.bounceCoefficient * actor.bounceCoefficient;
            }
            if (actor.minTranslationY !== 0  && Math.sign(actor.minTranslationY) !== Math.sign(actor.yVelocity)) {
                actor.yVelocity *= -1 * Math.abs(actor.minTranslationY / magnitude) * solid.bounceCoefficient * actor.bounceCoefficient;
            }

            if (!ignoreFriction) {
                // apply friction
                actor.xVelocity *= (1 - solid.frictionCoefficient) * (1 - actor.frictionCoefficient);
                actor.yVelocity *= (1 - solid.frictionCoefficient) * (1 - actor.frictionCoefficient);
            }
           
        }
    }
    

}