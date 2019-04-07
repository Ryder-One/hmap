import { HMap } from './hmap';

const jQ = $.noConflict(true);
declare var HMAP_DEVMODE: boolean;

declare var js: any;
const dev = (typeof HMAP_DEVMODE === 'undefined') ? false : (HMAP_DEVMODE) ? true : false;


// use the visitor2 font
const style = document.createElement('style');
style.appendChild(document.createTextNode('\
@font-face {\
    font-family: visitor2;\
    src: url(\'https://ryder-one.github.io/hmap/visitor2.ttf\') format(\'ttf\');\
}\
'));
document.head.appendChild(style);

// @ts-ignore https://github.com/Microsoft/TypeScript/issues/13569
const visitor2 = new FontFace('visitor2',
    'url(https://ryder-one.github.io/hmap/visitor2.ttf)');
visitor2.load().then(function(loadedFont: any) {
    // @ts-ignore same reason
    document.fonts.add(loadedFont);
});


/**
 * It's bootstrap time !!
 */
(function() {
    try {

        const map = new HMap(jQ, dev);

        if (dev === true) { // dev mode to play with the map
            map.location = 'desert';
            map.fetchMapData();
        } else {
            // wait for js.JsMap to be ready
            let counterCheckJsMap = 0;
            const checkJsMapExists = setInterval(function() {
                if (js && js.JsMap) { // when we land on a page with the map already there, start the code
                    clearInterval(checkJsMapExists);
                    map.location = map.getCurrentLocation();
                    map.fetchMapData();
                    map.setupInterceptor(); // intercept every ajax request haxe is doing to know if we should start the map or not
                } else if (++counterCheckJsMap > 20) { // timeout 2s
                    clearInterval(checkJsMapExists);
                    map.setupInterceptor(); // intercept every ajax request haxe is doing to know if we should start the map or not

                }
            }, 100);
        }
    } catch (err) {
        console.error('HMap::bootstrap', err);
    }
})();
