/**
 * Heads Up Display.
 * Only renders when something has changed.
 */

class Hud {
    constructor(player) {
        this.player = player;
        this.chargeIndicators = player.maxThrustCharges;
        this.filledChargeIndicators = player.maxThrustCharges;
        this.heartIndicators != this.player.maxHearts;
        this.filledHeartIndicators != this.player.maxHearts;
        this.x = 60;
        this.spacing = 80;
        this.update();
    }

    maybeUpdate() {
        if (this.filledChargeIndicators != this.player.thrustCharges ||
            this.filledHeartIndicators != this.player.hearts) {
            this.update();
        }
    }

    update() {
        hudctx.clearRect(0, 0, hud.width, hud.height);
        this.drawChargeIndicators();
        this.drawHeartIndicators();
    }

    drawChargeIndicators() {
        for (let i = 0; i < this.chargeIndicators; i++) {
            const targetImage = i < this.player.thrustCharges ? "thrustIndicatorFull" : "thrustIndicatorEmpty";
            const img = document.getElementById(targetImage);
            hudctx.drawImage(img, this.x + (this.spacing * i), hud.height - 80);
        }
        this.filledChargeIndicators = this.player.thrustCharges;
    }

    drawHeartIndicators() {
        for (let i = 0; i < this.player.hearts; i++) {
            const targetImage = i < this.player.thrustCharges ? "thrustIndicatorFull" : "thrustIndicatorEmpty";
            const img = document.getElementById("heartIndicator");
            hudctx.drawImage(img, this.x + (this.spacing * i), 30);
        }
    }
}
