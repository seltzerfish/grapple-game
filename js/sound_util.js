const SOUNDS = {
    THRUST: "thrust",
    GRAPPLE_STRIKE: "rimshot",
    GAME_OVER: "echo",
    ATTACHED_GRAPPLE: "attached_loop",
    NON_ATTACHED_GRAPPLE: "grapple_loop",
    SCREAM: ["scream1", "scream2", "scream3", "scream4", "scream5", "scream6", "scream7", "scream8"],
}

const LOOPED_SOUNDS = new Map();
const SFX = new Howl(SFX_SPRITESHEET);
SFX.volume(0.7); // TODO: move this to pause menu

class SoundUtil {
    static playSound(src) {
        if (Array.isArray(src)) {
            src = MathUtil.choose(src);
        }
        SFX.play(src);
    }

    static playLoopedSound(src) {
        if (Array.isArray(src)) {
            src = MathUtil.choose(src);
        }
        let sound = SFX.play(src);
        SFX.loop(true, sound);
        LOOPED_SOUNDS.set(src, sound);
    }

    static stopLoopedSound(src) {
        if (LOOPED_SOUNDS.has(src)) {
            SFX.stop(LOOPED_SOUNDS.get(src));
            LOOPED_SOUNDS.delete(src);
        }
    }
}