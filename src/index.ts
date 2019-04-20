import { HMap } from './hmap';
import { Toast } from './toast';

const FontFaceObserver = require('fontfaceobserver');

const jQ = $.noConflict(true);
declare var HMAP_DEVMODE: boolean;

const dev = (typeof HMAP_DEVMODE === 'undefined') ? false : (HMAP_DEVMODE) ? true : false;


/**
 * It's bootstrap time !!
 */
(function() {
    try {

        // Create the styles for the fonts
        const style = document.createElement('style');
        style.appendChild(document.createTextNode('\
        @font-face {\
            font-family: visitor2;\
            src: url(\'https://ryder-one.github.io/hmap/visitor2.woff2\') format(\'woff2\');\
			src: url(\'https://ryder-one.github.io/hmap/visitor2.woff\') format(\'woff\');\
        }\
        @font-face {\
            font-family: economica;\
            src: url(\'https://ryder-one.github.io/hmap/economica.woff2\') format(\'woff2\');\
        }\
        '));
        document.head.appendChild(style);

        // create fake content to load the fonts ( ... )
        jQ('body').append('<div style="font-family:visitor2;display:none;">visitor2</div>');
        jQ('body').append('<div style="font-family:economica;display:none;">economica</div>');

        const visitor2 = new FontFaceObserver('visitor2');
        const economica = new FontFaceObserver('economica');

        // load the fonts
        Promise.all([visitor2.load(), economica.load()]).then(function () {
            // start only when the fonts are loaded
            const map = new HMap(jQ, dev);
            if (dev === true) { // dev mode to play with the map
                map.location = 'desert';
                map.fetchMapData();
            } else {
                // wait for js.JsMap to be ready
                let counterCheckJsMap = 0;
                const checkLocationKnown = setInterval(function() {
                    if (map.getCurrentLocation() !== 'unknown') { // when we land on a page with the map already there, start the code
                        clearInterval(checkLocationKnown);
                        map.location = map.getCurrentLocation();
                        map.fetchMapData();
                        // intercept every ajax request haxe is doing to know if we should start the map or not
                        setTimeout(() => map.setupInterceptor());
                    } else if (++counterCheckJsMap > 10) { // timeout 2s
                        clearInterval(checkLocationKnown);
                        map.setupInterceptor(); // intercept every ajax request haxe is doing to know if we should start the map or not
                    }
                }, 200);
            }
        }).catch((err) => {
            Toast.show(jQ, 'Hmap - Cannot load the fonts. Try to reload the page by pressing CTRL + F5 or change your browser');
            console.error(err.message);
        });

    } catch (err) {
        console.error('HMap::bootstrap', err);
    }
})();
