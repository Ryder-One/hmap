import { HMap } from './hmap';

const jQ = $.noConflict(true);
declare var HMAP_DEVMODE: boolean;

declare var js: any;
const dev = (typeof HMAP_DEVMODE === 'undefined') ? false : (HMAP_DEVMODE) ? true : false;


/**
 * It's bootstrap time !!
 */
(function() {
    try {

        // quick and dirty ES6 support check
        try {
            const foo = new Function('(a = 0) => a');
        } catch (err) {
            console.error('HMap - Browser has no ES6 support');
            return;
        }

        // use the visitor2 font
        const style = document.createElement('style');
        style.appendChild(document.createTextNode('\
        @font-face {\
            font-family: visitor2;\
            src: url(\'https://ryder-one.github.io/hmap/visitor2.ttf\') format(\'ttf\');\
        }\
        '));

        // use the agency font
        style.appendChild(document.createTextNode('\
        @font-face {\
            font-family: agency-fb;\
            src: url(\'https://ryder-one.github.io/hmap/agency-fb.ttf\') format(\'ttf\');\
        }\
        '));
        document.head.appendChild(style);

        // @ts-ignore https://github.com/Microsoft/TypeScript/issues/13569
        const visitor2 = new FontFace('visitor2', 'url(https://ryder-one.github.io/hmap/visitor2.ttf)');
        visitor2.load().then(function(loadedvisitor2: any) {
            // @ts-ignore same reason
            document.fonts.add(loadedvisitor2);

            // @ts-ignore same reason
            const agency = new FontFace('agency-fb', 'url(https://ryder-one.github.io/hmap/agency-fb.ttf)');
            agency.load().then(function(loadedagency: any) {
                // @ts-ignore same reason
                document.fonts.add(loadedagency);

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

            });
        });

    } catch (err) {
        console.error('HMap::bootstrap', err);
    }
})();
