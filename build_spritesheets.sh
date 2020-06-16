# TODO: add Image Spritesheet logic

# Audio Spritesheet:
audiosprite --output static/sounds/sfxSpritesheet --loop  -f howler --export ogg static/sounds/sfx/*.wav
echo -e "SFX_SPRITESHEET = "$(cat static/sounds/sfxSpritesheet.json) > static/sounds/sfxSpritesheet.js
sed -i 's/"urls"/src/g' static/sounds/sfxSpritesheet.js