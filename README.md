# Grapple Game (working title)

A wacky space puzzle platformer where your only method of navigating the great unknown is your trusty grappling hook and a scrap thruster. Made with HTML5/Javascript.

## Prerequisites
* [Visual Studio Code](https://code.visualstudio.com/)
  * [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
* [Google Chrome](https://www.google.com/chrome/)

## Running the Game
To run the game, simply host a debug server on [index.html](index.html). Click on the 'Go Live' button in the bottom right of Visual Studio Code, or right click on `index.html` and click 'Open with Live Server'. This should open the game in your default browser. (Note: code changes will be reflected in real time.)

## Troubleshooting
**The game doesn't load / runs weirdly.**  
Disable adblock and run in Google Chrome. Browser compatibility is limited right now.

## Adding new sounds
When adding new sounds, you must run `./build_spritesheets.sh` before you will be able to access them in `sound_util.js`.
Note that this script requires [audiosprite](https://github.com/tonistiigi/audiosprite) to run.

## Adding new levels
Use Inkscape to place rectangles and circles in an SVG file (there are some SVGs in `leveldev/` for reference). For rectangles, specific colors correspond to different types of Solid. Compile your SVG to JSON via `parse_svg.py <my_file>.svg`. This creates `<my_file>.json`.

The parsing is very limited: Make sure you don't use any of the rotate functionality in Inkscape (SVG `translate()`s are ignored by the parser). Also, only shapes from the layer with id `layer1` will be considered.
