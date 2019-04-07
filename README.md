# HMap 

An HTML5 map for Die2Nite

All the assets are copyrighted by Motion Twin

## DISCLAIMER

I made this map because we have no news from Motion Twin (MT) for a couple years now, and the end - death - of flash
is already announced. I like the game and I can see the community worrying day after day. Some are already leaving because 
they think the game will die with flash.

This code is open source because this is the rule that moderators use to allow an addon.

If Motion Twin sees an offense in this project and officially asks me to remove the code and delete this project I will do it.

If Motion Twin officially gives me their blessing to continue this project, then I will remove this disclaimer and licence 
the code under an open source licence. The assets will always be the exclusive copyright of Motion Twin.

 ## How to use
 
 At the moment the project is just a userscript, you can use your favorite userscript extension to install it.
 
 https://github.com/Ryder-One/hmap/releases/latest/download/hmap.user.js
 
 It has been tested with tampermonkey. You can learn how to use it here : https://tampermonkey.net/faq.php
  
 ## Known issues
 
 The map is still in a very early stage, so there are a lot of issues. Please read this list carefully before posting
 new ones.
 
  * The explorable ruins are'nt done
  * All the tools (grid, expeditions courses, ..) are'nt done
  * The kills are not displayed on the map
  * The paranoid effects are'nt done (static effect, distortion effect, blur..)
  * The fog of war is not as good as the original
 
 ## Contributing
 
 If you are a developer and you want to help me, here is something to start.
 
 ```
 npm install -g browserify typescript tslint
 ```
 
 Then pull the code, and run the build with 
 
 ```
 npm install
 npm run build
 ```
 
 You can test the code locally with test-map.html
 
 Please if you have something interesting to share, do a pull request instead of forking silently the project. 
