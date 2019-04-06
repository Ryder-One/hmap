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
    src: url(\'https://github.com/Ryder-One/hmap/blob/dfd537424bac4b6bf7c85efcba93ffd3862edc2c/assets/visitor2.ttf?raw=true\') format(\'ttf\');\
}\
'));
document.head.appendChild(style);

// @ts-ignore https://github.com/Microsoft/TypeScript/issues/13569
const visitor2 = new FontFace('visitor2',
    'url(https://github.com/Ryder-One/hmap/blob/dfd537424bac4b6bf7c85efcba93ffd3862edc2c/assets/visitor2.ttf?raw=true)');
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
            map.fetchMapData();
        } else {
            // wait for js.JsMap to be ready
            let counterCheckJsMap = 0;
            const checkJsMapExists = setInterval(function() {
                if (js && js.JsMap && js.JsMap.sh) { // when js.JsMap.sh does not exists, that can mean we are not outside
                    clearInterval(checkJsMapExists);
                    map.setupInterceptor();
                    map.fetchMapData();
                } else if (js && js.JsMap) {
                    console.log('JS MAP is there', js.JsMap);
                    clearInterval(checkJsMapExists);
                } else if (++counterCheckJsMap > 100) { // timeout 10s on haxe loading
                    clearInterval(checkJsMapExists);
                    console.warn('HMap::bootstrap - JsMap not detected : exiting', js, js.JsMap);
                }
            }, 100); // 10 sec then give up
        }
    } catch (err) {
        console.error('HMap::bootstrap', err);
    }
})();
