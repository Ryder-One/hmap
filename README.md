# HMap

An HTML5 map for Die2Nite

All the assets are copyrighted by Motion Twin

## DISCLAIMER

I made this map because we have no news from Motion Twin (MT) for a couple years now, and the end - death - of flash is already announced. I like the game and I can see the community worrying day after day. Some are already leaving because they think the game will die with flash.

This code is open source because this is the rule that moderators use to allow an addon.

If Motion Twin sees an offense in this project and officially asks me to remove the code and delete this project I will do it.

If Motion Twin officially gives me their blessing to continue this project, then I will remove this disclaimer and licence the code under an open source licence. The assets will always be the exclusive copyright of Motion Twin. I strongly discourage forking the project with the assets until then.

## How to use

At the moment the project is just a userscript and it's working with tampermonkey only.

You need to install tampermonkey first, then use this URL to install the script.

<https://github.com/Ryder-One/hmap/releases/latest/download/hmap.user.js>

It has been tested successfully with tampermonkey. You can learn how to use it here : <https://tampermonkey.net/faq.php>

IT IS CURRENTLY NOT WORKING WITH GREASEMONKEY

## Browser support

I tried to target a wide set of browsers with babel, so my code should be compatible with every major browsers.

## Things to do

* The kills (of zombies) are not displayed on the map, I will do it
* The souls are not visible on the map. Can a shaman send me some screenshots of it please ?
* The construction site "upgraded map" is not done, since I never encouter this blueprint before ... Can someone send me some screenshots and the debug informations from a map with this upgrade please ?

## Help needeed

Due to a lack of personnal time, I won't do these things by myself.

* Expeditions (use external tools for that)
* The paranoid effects (static effect, distortion effect, blur..)
* Easing on the parallax effect, easing on the green arrow
* Greasemokey compatibility

Any help is appreciated.

## Known issues

The map is still in a very early stage, so there are probably a lot of issues. Please read the list of issues carefully before posting new ones.

Below are issues I don't want to fix or I can't fix :

* The fog of war is not as good as the original (neither is the blood, the night mode, and other assets I made) I'm limited by my artistic talent
* Blurry text : due to the font itself, cannot fix ( <https://stackoverflow.com/questions/55894889/strange-blurry-text-in-html-canvas-and-svg> )
* Popups are displayed behind the broken glass : too much refactoring if I want to bring them over the glass
* Some glitches in the shadows appear when moving with the map (white or black glitches) : I have no idea why

If you want to fix these issues, feel free to PR

## Contributing

If you are a developer and you want to help me, here is something to start.

```bash
npm install
npm run serve
```

Then you can test the code locally with <http://localhost:3000>

I didn't use Gulp or Grunt, this is just plain tools called one after another. Since this is very straightforward, I won't answer questions about it. If you cannot run the map in dev mode, then you probably cannot help me.

Please if you have something interesting to share, do a pull request instead of forking silently the project.

I did a major switch during the project, from HTML canvas to SVG elements. This information can help you understand the code better, since it's originally designed to work with HTML canvas (layers, draw functions, etc.). Refactoring everything does not worth the time.
