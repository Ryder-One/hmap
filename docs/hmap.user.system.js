System.register("arrow", [], function (exports_1, context_1) {
    "use strict";
    var HMapArrow;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            /**
             * @TODO ATM this class is useless and will be replaced by an interface
             */
            HMapArrow = class HMapArrow {
                constructor(ax, ay, rx, ry, w, h, t, a, over = false) {
                    this.ax = ax;
                    this.ay = ay;
                    this.rx = rx;
                    this.ry = ry;
                    this.w = w;
                    this.h = h;
                    this.t = t;
                    this.a = a;
                    this.over = over;
                }
            };
            exports_1("HMapArrow", HMapArrow);
        }
    };
});
System.register("environment", [], function (exports_2, context_2) {
    "use strict";
    var Environment;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            Environment = class Environment {
                constructor() {
                    this._devMode = false;
                }
                get devMode() { return this._devMode; }
                get dev() { return this._devMode; }
                get d() { return this._devMode; }
                set devMode(dev) {
                    this._devMode = dev;
                }
                get url() {
                    if (this.devMode === true) {
                        return '.';
                    }
                    else {
                        return 'https://ryder-one.github.io/hmap';
                    }
                }
                static getInstance() {
                    if (Environment._instance === undefined) {
                        Environment._instance = new Environment();
                    }
                    return Environment._instance;
                }
            };
            exports_2("Environment", Environment);
        }
    };
});
System.register("neighbours", [], function (exports_3, context_3) {
    "use strict";
    var HMapNeighbour, HMapNeighbours;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            HMapNeighbour = class HMapNeighbour {
                constructor(x, y, p, o, i, view, b) {
                    this.offsetX = 0; // top left X coordinate
                    this.offsetY = 0; // top left Y coordinate
                    this.x = x;
                    this.y = y;
                    this.position = p;
                    this.outbounds = o;
                    this.index = i;
                    this.view = view;
                    this.building = b;
                    if (this.position === 'top_right' || this.position === 'middle_right' || this.position === 'bottom_right') {
                        this.offsetX = 200;
                    }
                    else if (this.position === 'top_center' || this.position === 'middle_center' || this.position === 'bottom_center') {
                        this.offsetX = 100;
                    }
                    if (this.position === 'bottom_right' || this.position === 'bottom_center' || this.position === 'bottom_left') {
                        this.offsetY = 200;
                    }
                    else if (this.position === 'middle_right' || this.position === 'middle_center' || this.position === 'middle_left') {
                        this.offsetY = 100;
                    }
                }
            };
            exports_3("HMapNeighbour", HMapNeighbour);
            HMapNeighbours = class HMapNeighbours {
                constructor() {
                    this.neighbours = new Map();
                }
                addNeighbour(n) {
                    this.neighbours.set(n.position, n);
                }
            };
            exports_3("HMapNeighbours", HMapNeighbours);
        }
    };
});
System.register("toast", [], function (exports_4, context_4) {
    "use strict";
    var Toast;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            /**
             * Toaster to display messages to the user; under used
             */
            Toast = class Toast {
                static show(text) {
                    const id = Math.floor(Math.random() * 100000000);
                    if (Toast.count === 0) { // create the container
                        const body = document.querySelector('body');
                        const _toastContainer = document.createElement('div');
                        _toastContainer.setAttribute('id', 'toast-container');
                        _toastContainer.setAttribute('style', 'position:fixed;top:0;left:0;padding:5px;display:flex;flex-direction:column;z-index:999');
                        body.appendChild(_toastContainer);
                    }
                    const toastContainer = document.querySelector('#toast-container');
                    if (toastContainer === null) {
                        throw new Error('Cannot find toast-container div');
                    }
                    const newToast = document.createElement('div');
                    newToast.setAttribute('id', 'toast_' + id);
                    newToast.innerHTML = text;
                    const styleString = 'padding:6px;background:#a13119;font-size:12px;color:#eccb94;' +
                        'font-family:Helvetica, Arial;cursor:pointer;margin-bottom:5px;border: 1px solid black';
                    newToast.setAttribute('style', styleString);
                    newToast.onclick = (e) => {
                        if (e.target !== null) {
                            const target = e.target;
                            target.style.display = 'none';
                        }
                    };
                    toastContainer.appendChild(newToast);
                    Toast.count++;
                    // toasts disappear after 5 seconds
                    setTimeout(() => {
                        const toast = document.querySelector('#toast_' + id);
                        if (toast !== null && toast.parentNode !== null) {
                            toast.parentNode.removeChild(toast);
                            Toast.count--;
                            if (Toast.count === 0) {
                                const __toastContainer = document.querySelector('#toast-container');
                                if (__toastContainer !== null && __toastContainer.parentNode !== null) {
                                    __toastContainer.parentNode.removeChild(__toastContainer);
                                }
                            }
                        }
                    }, 5000);
                }
            };
            Toast.count = 0;
            exports_4("Toast", Toast);
        }
    };
});
System.register("layers/abstract", [], function (exports_5, context_5) {
    "use strict";
    var AbstractHMapLayer;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
            AbstractHMapLayer = class AbstractHMapLayer {
                constructor(map) {
                    this.ns = 'http://www.w3.org/2000/svg';
                    this.map = map;
                }
                /**
                 * Draw a rect onto the SVG, append it to the main group and return it
                 */
                rect(x, y, width, height, fill, stroke, strokeWidth = 2) {
                    const rect = document.createElementNS(this.ns, 'rect');
                    rect.setAttributeNS(null, 'x', (x | 0) + '');
                    rect.setAttributeNS(null, 'y', (y | 0) + '');
                    rect.setAttributeNS(null, 'width', width + '');
                    rect.setAttributeNS(null, 'height', height + '');
                    if (fill !== undefined) {
                        rect.setAttributeNS(null, 'fill', fill);
                    }
                    if (stroke !== undefined) {
                        rect.setAttributeNS(null, 'stroke', stroke);
                        rect.setAttributeNS(null, 'stroke-width', strokeWidth + '');
                    }
                    rect.setAttributeNS(null, 'shape-rendering', 'crispEdges');
                    this.g.appendChild(rect);
                    return rect;
                }
                /**
                 * Draw a path onto the SVG, append it to the main group and return it
                 */
                path(d, stroke, strokeWidth = 2) {
                    const path = document.createElementNS(this.ns, 'path');
                    path.setAttributeNS(null, 'd', d);
                    if (stroke !== undefined) {
                        path.setAttributeNS(null, 'stroke', stroke);
                        path.setAttributeNS(null, 'stroke-width', strokeWidth + '');
                    }
                    this.g.appendChild(path);
                    return path;
                }
                /**
                 * Embbed an image in the SVG; append it to the main group and return it
                 */
                img(url, x, y, width, height, angle, cssClass) {
                    const img = document.createElementNS(this.ns, 'image');
                    img.setAttributeNS(null, 'height', height + '');
                    img.setAttributeNS(null, 'width', width + '');
                    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
                    img.setAttributeNS(null, 'x', (x | 0) + '');
                    img.setAttributeNS(null, 'y', (y | 0) + '');
                    img.setAttributeNS(null, 'shape-rendering', 'crispEdges');
                    if (cssClass) {
                        img.setAttributeNS(null, 'class', cssClass);
                    }
                    img.style.pointerEvents = 'none';
                    this.g.appendChild(img);
                    if (angle && width && height) {
                        img.setAttributeNS(null, 'transform', 'rotate(' + angle + ' ' + (x + width / 2) + ' ' + (y + height / 2) + ')');
                    }
                    return img;
                }
                /**
                 * Draw a text on the SVG and return it
                 */
                textDetached(x, y, text, cssclass) {
                    const element = document.createElementNS(this.ns, 'text');
                    element.setAttributeNS(null, 'x', (x | 0) + '');
                    element.setAttributeNS(null, 'y', (y | 0) + '');
                    element.setAttributeNS(null, 'shape-rendering', 'crispEdges');
                    element.setAttributeNS(null, 'dominant-baseline', 'middle');
                    const txt = document.createTextNode(text);
                    element.appendChild(txt);
                    element.style.pointerEvents = 'none';
                    element.style.userSelect = 'none';
                    if (cssclass) {
                        element.setAttributeNS(null, 'class', cssclass);
                    }
                    return element;
                }
                /**
                 * Draw a text on the SVG, append it to the main group and return it
                 */
                text(x, y, text, cssclass) {
                    const txt = this.textDetached(x, y, text, cssclass);
                    this.g.appendChild(txt);
                    return txt;
                }
            };
            exports_5("AbstractHMapLayer", AbstractHMapLayer);
        }
    };
});
System.register("layers/svg-loading", ["layers/abstract"], function (exports_6, context_6) {
    "use strict";
    var abstract_1, HMapSVGLoadingLayer;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (abstract_1_1) {
                abstract_1 = abstract_1_1;
            }
        ],
        execute: function () {
            /**
             * This layer is dedicated to the loading screen
             * This is a bit stupid to extend desertdatajson but I'm stuck with it
             */
            HMapSVGLoadingLayer = class HMapSVGLoadingLayer extends abstract_1.AbstractHMapLayer {
                constructor(map) {
                    super(map);
                    const hmap = document.querySelector('#hmap');
                    if (document.querySelector('#svgLoading') === null && hmap) {
                        const SVG = document.createElementNS(this.ns, 'svg');
                        SVG.setAttributeNS(null, 'id', 'svgLoading');
                        SVG.setAttributeNS(null, 'style', 'position:absolute;z-index:998;');
                        hmap.appendChild(SVG);
                        SVG.style.pointerEvents = 'none';
                    }
                    this.svg = document.getElementById('svgLoading');
                    this.svg.setAttributeNS(null, 'width', map.width + 'px');
                    this.svg.setAttributeNS(null, 'height', map.height + 'px');
                    this.svg.style.width = map.width + 'px';
                    this.svg.style.height = map.height + 'px';
                    this.type = 'loading';
                }
                draw() {
                    const oldGroup = this.g;
                    this.g = document.createElementNS(this.ns, 'g');
                    const map = this.map;
                    this.img(map.imagesLoader.get('loading').src, 0, 0, 300, 300); // image is 300x300
                    this.text(120, 185, 'by ryderone', 'hmap-text-yellow');
                    this.loadingBar = this.rect(75, 170, 1, 6, '#ebc369');
                    this.svg.appendChild(this.g);
                    if (oldGroup) {
                        window.setTimeout(() => this.svg.removeChild(oldGroup), 100);
                    }
                }
                /**
                 * Animate the progress bar
                 */
                progress(percent) {
                    this.loadingBar.setAttributeNS(null, 'width', percent * 155 + ''); // 155 = width of the bar
                }
                /**
                 * I dont remove the element from the DOM yet, it may be reused later
                 */
                hide() {
                    this.svg.style.display = 'none';
                }
            };
            exports_6("HMapSVGLoadingLayer", HMapSVGLoadingLayer);
        }
    };
});
System.register("lang", [], function (exports_7, context_7) {
    "use strict";
    var ruinNames, french, english, german, spanish, HMapLang;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [],
        execute: function () {
            ruinNames = {
                'fr': {
                    'bunker': [
                        'Bunker abandonné',
                        'Bunker thermonucléaire',
                        'Bunker maginot',
                        'Bunker de la peur',
                        'Bunker de la fureur',
                        'Abri atomique',
                        'Pas d\'abri, t\'es pris !',
                        'Blockhaus glauque',
                        'Blockhaus abandonné',
                        'Blockhaus plein d\'os',
                        'Blockhaus à l\'os',
                        'Centre d\'expérimentation',
                        'Bunker zone 52.1',
                        'Bunker zone 33',
                        'Etude des quarantaines'
                    ],
                    'motel': [
                        'Hôtel charlton eston',
                        'Le Motel enchanté',
                        'Caesar palace',
                        'Le palace de la place',
                        'L\'Hôtel sordide',
                        'Hôtel terminus',
                        'Palace pas classe',
                        'Relais des gourmets',
                        'Hôtel de passe',
                        'Hôtel particulier',
                        'Hôtel de la défenestration',
                        'Hôtel Santa frit',
                        'Hôtel Chez yen',
                        'Hôtel Old port bay club',
                        'Hôtel Sapin lodge',
                        'Hôtel Front tenace',
                        'Hôtel Beverly colline',
                        'Palace Gonzalez'
                    ],
                    'hospital': [
                        'Hôpital Velpo',
                        'Clinique esthétruique',
                        'Hôpital malade',
                        'L\'Hôpital du régal',
                        'L\'hospice du vice',
                        'L\'hôpital du mal',
                        'Clinique du couic !',
                        'Clinique aux allergiques',
                        'Pelle grain',
                        'Sale pré-trier',
                        'White et Necker',
                        'C.H.UT',
                        'Bordeaux grace',
                        'Georges XXXII'
                    ]
                },
                'en': {
                    'bunker': [
                        'Abandoned Bunker',
                        'Thermonuclear Bunker',
                        'Garrison House',
                        'Bastion of Fear',
                        'Bunker of Fury',
                        'Fallout Shelter',
                        'Nowhere to hide, even inside!',
                        'Shady Fort',
                        'Abandoned Troop Station',
                        'Bone-filled Bunker',
                        'Bone Blockhouse',
                        'Secret Testing Center',
                        'Area 52.1 Shelter',
                        'Area 33 Bunker',
                        'Quarantine Zone'
                    ],
                    'motel': [
                        'Charlton Eston Hotel',
                        'The Enchanted Motel',
                        'The Rabble Lodge',
                        'The Unravel Inn',
                        'The Busted Arts',
                        'Terminal Hotel',
                        'Hotel Von Otto',
                        'S+M B+B',
                        'The Passing Trade Motel',
                        'The Hotel Peculiar',
                        'Liza Defenestration Hotel',
                        'The Smashed Santa Inn',
                        'Chez Clem Hotel',
                        'Three Door Hotel + Spa',
                        'Hostel Partout',
                        'The Bumbling Inn',
                        'The Vajazzl Inn',
                        'Hotel Venga'
                    ],
                    'hospital': [
                        'Cash Ulty Hospital',
                        'Aesthetyxiation Unit',
                        'Syck Niss Hospital',
                        'Royal Troon Hospital',
                        'The Munro Chronic STI Treatment Unit',
                        'Bill S. Preston Memorial Hospital',
                        'Dr Kwak\'s Clinic!',
                        'The Mererid Allergy Clinic',
                        'Pelle Grain Hospital',
                        'Osmond St Hospital',
                        'The Chapman Penis Reduction Clinic',
                        'The Brunting Daily Exhaustion Center',
                        'Bordeaux Grace',
                        'George and Ralph Children\'s Hospital'
                    ]
                },
                'es': {
                    'bunker': [
                        'Bunker abandonado',
                        'Bunker termonuclear',
                        'Bunker de políticos',
                        'Bunker del terror',
                        'Bunker de los prófugos',
                        'Guarida insalubre',
                        'Refugio Fin del Mundo',
                        'Bunker rockero',
                        'Bunker graffitero',
                        'Bunker lleno de huesos',
                        'Bunker del rey',
                        'Centro de experimentos',
                        'Bunker zona 52.1',
                        'Bunker zona 33',
                        'Viejo bunker',
                    ],
                    'motel': [
                        'Hotel California',
                        'Hotel El Cielo II',
                        'Death Palace Hotel',
                        'Hostal Barato',
                        'Hotel Maravilla',
                        'Hotel Melody',
                        'Hotel Paraeso',
                        'Hostal de Paso',
                        'Hotel Particular',
                        'Hotel Monstruo',
                        'Hotel Znarfo',
                        'Hotel Transilvania',
                        'Hotel Nirvana',
                        'Hostal El Secreto',
                        'Hotel El Pájaro Loco',
                        'Hotel Gonzalez',
                        'Hostal El Cielo I',
                    ],
                    'hospital': [
                        'Hospital Matasanos',
                        'Clínica El Serrucho',
                        'Hospital Privado',
                        'Hospital del Rey',
                        'Clínica de Miércoles',
                        'Hospital Sangriento',
                        'Hospital Bar Discoteca',
                        'Hospital Cementerio',
                        'Hospital Dolores',
                        'Hospital Milagros',
                        'Clínica del Dr. Cuervo',
                        'Hospital Nocturno',
                        'Hospital del Estado',
                        'Hospital Madre Mía'
                    ]
                },
                'de': {
                    'bunker': [
                        'Abandoned Bunker',
                        'Thermonuclear Bunker',
                        'Garrison House',
                        'Bastion of Fear',
                        'Bunker of Fury',
                        'Fallout Shelter',
                        'Nowhere to hide, even inside!',
                        'Shady Fort',
                        'Abandoned Troop Station',
                        'Bone-filled Bunker',
                        'Bone Blockhouse',
                        'Secret Testing Center',
                        'Area 52.1 Shelter',
                        'Area 33 Bunker',
                        'Quarantine Zone'
                    ],
                    'motel': [
                        'Charlton Eston Hotel',
                        'The Enchanted Motel',
                        'The Rabble Lodge',
                        'The Unravel Inn',
                        'The Busted Arts',
                        'Terminal Hotel',
                        'Hotel Von Otto',
                        'S+M B+B',
                        'The Passing Trade Motel',
                        'The Hotel Peculiar',
                        'Liza Defenestration Hotel',
                        'The Smashed Santa Inn',
                        'Chez Clem Hotel',
                        'Three Door Hotel + Spa',
                        'Hostel Partout',
                        'The Bumbling Inn',
                        'The Vajazzl Inn',
                        'Hotel Venga'
                    ],
                    'hospital': [
                        'Cash Ulty Hospital',
                        'Aesthetyxiation Unit',
                        'Syck Niss Hospital',
                        'Royal Troon Hospital',
                        'The Munro Chronic STI Treatment Unit',
                        'Bill S. Preston Memorial Hospital',
                        'Dr Kwak\'s Clinic!',
                        'The Mererid Allergy Clinic',
                        'Pelle Grain Hospital',
                        'Osmond St Hospital',
                        'The Chapman Penis Reduction Clinic',
                        'The Brunting Daily Exhaustion Center',
                        'Bordeaux Grace',
                        'George and Ralph Children\'s Hospital'
                    ]
                }
            };
            french = {
                'modebutton': 'Global',
                'mapbutton': 'Carte',
                'debugbutton': 'Debug',
                'markersbutton': 'Marqueurs',
                'closebutton': 'Fermer',
                'resetbutton': 'Reset',
                'tag_1': 'Appel à l\'aide',
                'tag_2': 'Ressources abandonnées',
                'tag_3': 'Objet(s) abandonné(s)',
                'tag_4': 'Objet(s) important(s) !',
                'tag_5': 'Zone épuisée',
                'tag_6': 'Zone sécurisée',
                'tag_7': 'Zone à déblayer',
                'tag_8': 'Entre 5 et 8 zombies',
                'tag_9': '9 zombies ou plus !',
                'tag_10': 'Campement prévu',
                'tag_11': 'Ruine à explorer',
                'tag_12': 'Âme perdue',
                'fewZombies': 'Zombies isolés',
                'medZombies': 'Meute de zombies',
                'manyZombies': 'Horde de zombies',
                'toastdebug': 'Le debug a été copié dans le presse papier',
                'toasterror': 'Une erreur est survenue. Ouvrez la console pour plus d\'informations',
                'undigged': 'Secteur inexploitable',
                'oxygen': 'Oxygène',
                'position': 'Position'
            };
            english = {
                'modebutton': 'Global',
                'mapbutton': 'Carte',
                'debugbutton': 'Debug',
                'markersbutton': 'Markers',
                'closebutton': 'Close',
                'resetbutton': 'Reset',
                'tag_1': 'Call for help',
                'tag_2': 'Abandoned Resources',
                'tag_3': 'Abandoned Object(s)',
                'tag_4': 'Important Object(s) !',
                'tag_5': 'Zone depleted',
                'tag_6': 'Zone secured',
                'tag_7': 'Zone uncleared',
                'tag_8': 'Between 5 and 8 zombies',
                'tag_9': '9 zombies or more !',
                'tag_10': 'Likely campsite',
                'tag_11': 'Ruin to explore',
                'tag_12': 'Lost soul',
                'fewZombies': 'Isolated zombies',
                'medZombies': 'Pack of zombies',
                'manyZombies': 'Horde of zombies',
                'toastdebug': 'Debug has been copied to clipboard',
                'toasterror': 'An error occurred. Check the console for more informations',
                'undigged': 'Unsearchable zone',
                'oxygen': 'Oxygen',
                'position': 'Position'
            };
            german = {
                'modebutton': 'Global',
                'mapbutton': 'Karte',
                'debugbutton': 'Debug',
                'markersbutton': 'Mark.',
                'closebutton': 'Schliessen',
                'resetbutton': 'Zurücksetzen',
                'tag_1': 'Hilferuf',
                'tag_2': 'Liegengebliebene Rohstoffe',
                'tag_3': 'Hinterlassene(r) Gegenstand/-aende',
                'tag_4': 'Wichtiger Gegenstand/-aende!',
                'tag_5': 'Zone leergesucht',
                'tag_6': 'Zone gesichert',
                'tag_7': 'Zone muss freigeraeumt werden',
                'tag_8': 'Zwischen 5 und 8 Zombies',
                'tag_9': '9 oder mehr Zombies!',
                'tag_10': 'Camping geplant',
                'tag_11': 'Ruine zum Erkunden',
                'tag_12': 'Verlorene Seele',
                'fewZombies': 'Einzelner Zombie',
                'medZombies': 'Zombiemeute',
                'manyZombies': 'Zombiehorde',
                'toastdebug': 'Debug wurde in die Zwischenablage kopiert',
                'toasterror': 'Ein Fehler ist aufgetreten. Überprüfen Sie die Konsole für weitere Informationen',
                'undigged': 'Sektor nicht durchsuchbar',
                'oxygen': 'Sauerstoff',
                'position': 'Position'
            };
            spanish = {
                'modebutton': 'Global',
                'mapbutton': 'Mapa',
                'debugbutton': 'Debug',
                'markersbutton': 'Marca',
                'closebutton': 'Cerrar',
                'resetbutton': 'Reiniciar',
                'tag_1': 'Pedir ayuda',
                'tag_2': 'Recursos abandonado',
                'tag_3': 'Objeto(s) abandonado(s)',
                'tag_4': '¡Objeto(s) importante(s)!',
                'tag_5': 'Zona agotada',
                'tag_6': 'Zona segura',
                'tag_7': 'Zona a despejar',
                'tag_8': 'Entre 5 y 8 zombis',
                'tag_9': '¡9 zombis o más!',
                'tag_10': 'Campamento posible',
                'tag_11': 'Ruina a explorar',
                'tag_12': 'Alma perdida',
                'fewZombies': 'Zombis sueltos',
                'medZombies': 'Banda de zombis',
                'manyZombies': 'Turba de zombis',
                'toastdebug': 'La depuración se ha copiado al portapapeles.',
                'toasterror': 'Ocurrió un error. Compruebe la consola para más información',
                'undigged': 'Sector inexplotable',
                'oxygen': 'Oxígeno',
                'position': 'Posición'
            };
            HMapLang = class HMapLang {
                constructor() {
                    this.traductions = new Map();
                    this.language = this.detectLanguage();
                    this.traductions.set('fr', french);
                    this.traductions.set('en', english);
                    this.traductions.set('de', german);
                    this.traductions.set('es', spanish);
                }
                static getInstance() {
                    if (HMapLang.instance === undefined) {
                        HMapLang.instance = new HMapLang();
                    }
                    return HMapLang.instance;
                }
                static get(key) {
                    const instance = HMapLang.getInstance();
                    return instance._get(key);
                }
                detectLanguage() {
                    const url = window.location;
                    if ('hordes.fr' in url) {
                        return 'fr';
                    }
                    else if ('die2nite.com' in url) {
                        return 'en';
                    }
                    else if ('dieverdammten.de' in url) {
                        return 'de';
                    }
                    else if ('www.zombinoia.com' in url) {
                        return 'es';
                    }
                    else {
                        return 'fr';
                    }
                }
                _get(key) {
                    if (this.traductions.get(this.language) !== undefined) {
                        const trads = this.traductions.get(this.language);
                        return trads[key];
                    }
                    return this.traductions.get('en')[key]; // default, we have the english traduction
                }
                getRuinNames(ruinType) {
                    return ruinNames[this.language][ruinType];
                }
            };
            exports_7("HMapLang", HMapLang);
        }
    };
});
System.register("data/abstract", [], function (exports_8, context_8) {
    "use strict";
    var HMapData;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [],
        execute: function () {
            /**
             * This class is the store of the map. It handles the data originally
             * passed to flash, and expose it in a JSON format with lots of accessors
             */
            HMapData = class HMapData {
                constructor(mapDataPayload) {
                    if (mapDataPayload && mapDataPayload.raw) {
                        this.data = this.decode(mapDataPayload.raw);
                    }
                    else if (mapDataPayload && mapDataPayload.JSON) {
                        this.data = mapDataPayload.JSON;
                    }
                    else {
                        this.data = this.fakeData(true);
                    }
                }
                get prettyData() { return JSON.stringify(this.data, undefined, 4); }
                patchData(data) {
                    let decodedData;
                    if (data.raw) {
                        decodedData = this.decode(data.raw);
                    }
                    else if (data.JSON) {
                        decodedData = data.JSON;
                    }
                    else {
                        throw new Error('HMapData::patchData - Cannot patch empty data');
                    }
                    this.patchDataJSON(decodedData);
                }
                /**
                 * @param char Type script does not have a type for
                 */
                translate(char) {
                    if (char >= 65 && char <= 90) {
                        return char - 65;
                    }
                    if (char >= 97 && char <= 122) {
                        return char - 71;
                    }
                    if (char >= 48 && char <= 57) {
                        return char + 4;
                    }
                    return null;
                }
                /**
                 * @param key generated by haxe
                 * @param message message to decode
                 */
                binaryToMessage(key, message) {
                    const keyArray = new Array();
                    for (let i = 0, j = key.length; i < j; i++) {
                        const char = this.translate(key.charCodeAt(i));
                        if (char != null) {
                            keyArray.push(char);
                        }
                    }
                    if (keyArray.length === 0) {
                        keyArray.push(0);
                    }
                    let returnStr = '';
                    for (let n = 0, p = message.length; n < p; n++) {
                        const k = message.charCodeAt(n) ^ keyArray[(n + message.length) % keyArray.length];
                        returnStr += String.fromCharCode((k !== 0) ? k : message.charCodeAt(n));
                    }
                    return returnStr;
                }
            };
            exports_8("HMapData", HMapData);
        }
    };
});
System.register("random", [], function (exports_9, context_9) {
    "use strict";
    var HMapRandom;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            HMapRandom = class HMapRandom {
                /**
                 * Get a random integer between min and max
                 * @warning Not using the seed.
                 */
                static getRandomIntegerNoSeed(min, max) {
                    return Math.floor(Math.random() * (max - min)) + min;
                }
                /**
                 * Return one of random the element in array
                 * @warning NOT using the local seed
                 */
                static getOneOfNoSeed(elements) {
                    return elements[Math.floor(Math.random() * elements.length)];
                }
                constructor(seed = 0) {
                    this.seed = seed;
                }
                /**
                * Very simple random generator based on a fixed seed
                * @see https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/47593316#47593316
                */
                random() {
                    const x = Math.sin(this.seed++) * 10000;
                    return x - Math.floor(x);
                }
                /**
                 * Get a random integer between min and max
                 * Using the local seed
                 */
                getRandomIntegerLocalSeed(min, max) {
                    return Math.floor(this.random() * (max - min)) + min;
                }
                /**
                 * Return one of random the element in array
                 * Using the local seed
                 */
                getOneOfLocalSeed(elements) {
                    return elements[Math.floor(this.random() * elements.length)];
                }
                /**
                 * Get a random position inside a circle
                 * @param center coordinates x, y of the center
                 * @param radius radius of the circle
                 */
                randomCircle(center, radius) {
                    const ang = this.random() * 360;
                    return {
                        x: center.x + radius * Math.sin(ang * Math.PI / 180),
                        y: center.y + radius * Math.cos(ang * Math.PI / 180)
                    };
                }
            };
            exports_9("HMapRandom", HMapRandom);
        }
    };
});
System.register("data/hmap-ruin-data", ["data/abstract", "random"], function (exports_10, context_10) {
    "use strict";
    var abstract_2, random_1, HMapRuinData;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (abstract_2_1) {
                abstract_2 = abstract_2_1;
            },
            function (random_1_1) {
                random_1 = random_1_1;
            }
        ],
        execute: function () {
            /**
             * This class is the store of the map. It handles the data originally
             * passed to flash, and expose it in a JSON format with lots of accessors
             */
            HMapRuinData = class HMapRuinData extends abstract_2.HMapData {
                constructor(mapDataPayload) {
                    super(mapDataPayload);
                    this.fakeRuinDirections = [
                        [
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, true],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false]
                        ],
                        [
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, true],
                            [false, false, false, false],
                            [false, false, true, true],
                            [true, true, true, false],
                            [true, false, true, false],
                            [true, false, true, false],
                            [true, false, true, true],
                            [true, false, true, false],
                            [true, false, false, true],
                            [false, false, false, false],
                            [false, false, false, false]
                        ],
                        [
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, true, true],
                            [true, true, true, false],
                            [true, false, true, false],
                            [true, true, false, true],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, true, false, true],
                            [false, false, false, false],
                            [false, true, true, true],
                            [true, false, false, false],
                            [false, false, false, false]
                        ],
                        [
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, true, false, true],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, true, true, false],
                            [true, false, true, false],
                            [true, false, true, false],
                            [true, false, true, false],
                            [true, true, true, true],
                            [true, false, true, false],
                            [true, true, false, true],
                            [false, false, false, false],
                            [false, false, false, false]
                        ],
                        [
                            [false, false, true, true],
                            [true, false, true, false],
                            [true, false, true, false],
                            [true, true, false, false],
                            [false, false, false, false],
                            [false, false, false, true],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, true, false, true],
                            [false, false, false, false],
                            [false, true, false, true],
                            [false, false, false, false],
                            [false, false, false, false]
                        ],
                        [
                            [false, true, false, true],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, true, true, true],
                            [true, false, true, false],
                            [true, false, false, true],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, true, true, false],
                            [true, false, true, false],
                            [true, true, true, false],
                            [true, false, false, true],
                            [false, false, false, false]
                        ],
                        [
                            [false, true, true, false],
                            [true, false, true, false],
                            [true, false, false, true],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, true, false, true],
                            [false, false, false, false],
                            [false, true, true, false],
                            [true, false, false, true],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, true, false, true],
                            [false, false, false, false]
                        ],
                        [
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, true, true, false],
                            [true, false, true, true],
                            [true, false, true, false],
                            [true, true, false, true],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, true, true, false],
                            [true, false, true, true],
                            [true, false, true, false],
                            [true, false, false, true],
                            [false, false, false, false],
                            [false, true, false, false],
                            [false, false, false, false]
                        ],
                        [
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, true, false, false],
                            [false, false, false, false],
                            [false, true, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, true, false, false],
                            [false, false, false, false],
                            [false, true, false, false],
                            [false, false, false, false],
                            [false, false, false, false],
                            [false, false, false, false]
                        ]
                    ];
                }
                get height() { return this.data._h; }
                get width() { return this.data._w; }
                get position() { return { x: this.data._r._x, y: this.data._r._y }; }
                get directions() { return this.data._r._dirs; }
                get directionsStr() { return '' + (+this.directions[0]) + (+this.directions[1]) + (+this.directions[2]) + (+this.directions[3]); }
                get oxygen() { return this.data._r._o; }
                get ruinType() {
                    if (this.data._k === 0) {
                        return 'bunker';
                    }
                    else if (this.data._k === 1) {
                        return 'motel';
                    }
                    else {
                        return 'hospital';
                    }
                }
                get zoneId() { return this.data._zid; }
                get exit() { return this.data._r._d._exit; }
                get seed() { return this.data._r._d._seed; }
                get zombies() { return this.data._r._d._z; }
                get room() { return this.data._r._d._room; }
                /**
                 * Decode the url encoded flashvar
                 */
                decode(urlEncoded) {
                    let st, hx, ec;
                    try {
                        // @ts-ignore
                        const page = window.wrappedJSObject;
                        if (page !== undefined && page.StringTools && page.MapCommon && page.haxe) { // greasemonkey ...
                            st = page.StringTools;
                            hx = page.haxe;
                            ec = page.MapCommon;
                        }
                        else if (StringTools && haxe && ExploCommon) { // tampermonkey
                            st = StringTools;
                            hx = haxe;
                            ec = ExploCommon;
                        }
                        const tempMapData = st.urlDecode(urlEncoded);
                        return hx.Unserializer.run(this.binaryToMessage(ec.genKey(tempMapData.length), ec.permute(tempMapData)));
                    }
                    catch (err) {
                        console.error('HMapRuinData::decode - caught an exception during decoding', err, urlEncoded);
                        throw err;
                    }
                }
                /**
                 * JSON patching separated to enable dev mode
                 */
                patchDataJSON(data) {
                    this.data._r = data;
                }
                /**
                 * create a fake JSON to debug the map
                 */
                fakeData(force = false) {
                    if (this._fakeData !== undefined && force === false) {
                        return this._fakeData;
                    }
                    else {
                        this._fakeData = {
                            _d: true,
                            _h: 9,
                            _k: 1,
                            _r: {
                                _dirs: [false, false, false, true],
                                _move: true,
                                _d: {
                                    _exit: true,
                                    _room: null,
                                    _seed: random_1.HMapRandom.getRandomIntegerNoSeed(100, 1000),
                                    _k: 0,
                                    _w: false,
                                    _z: 0
                                },
                                _o: 300000,
                                _r: false,
                                _x: 7,
                                _y: 0
                            },
                            _w: 15,
                            _mid: random_1.HMapRandom.getRandomIntegerNoSeed(1000, 100000),
                            _zid: random_1.HMapRandom.getRandomIntegerNoSeed(1000, 100000)
                        };
                        return this._fakeData;
                    }
                }
                /**
                 * Get the next directions
                 */
                getFakeDirs(pos) {
                    return this.fakeRuinDirections[pos.y][pos.x];
                }
            };
            exports_10("HMapRuinData", HMapRuinData);
        }
    };
});
System.register("layers/svg-ruin-background", ["layers/abstract", "random"], function (exports_11, context_11) {
    "use strict";
    var abstract_3, random_2, HMapSVGRuinBackgroundLayer;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (abstract_3_1) {
                abstract_3 = abstract_3_1;
            },
            function (random_2_1) {
                random_2 = random_2_1;
            }
        ],
        execute: function () {
            /**
             * This layer is dedicated to the loading screen
             */
            HMapSVGRuinBackgroundLayer = class HMapSVGRuinBackgroundLayer extends abstract_3.AbstractHMapLayer {
                constructor(map) {
                    super(map);
                    this.translation = { x: 0, y: 0 }; // translation really applied
                    this.translateTo = { x: 0, y: 0 }; // target (translation to achieve after easing)
                    const hmap = document.querySelector('#hmap');
                    if (document.querySelector('#svgRuin') === null && hmap) {
                        const SVG = document.createElementNS(this.ns, 'svg');
                        SVG.setAttributeNS(null, 'id', 'svgRuin');
                        SVG.setAttributeNS(null, 'style', 'position:absolute;z-index:10;');
                        hmap.appendChild(SVG);
                        SVG.style.pointerEvents = 'none';
                    }
                    this.svg = document.getElementById('svgRuin');
                    this.svg.setAttributeNS(null, 'width', map.width + 'px');
                    this.svg.setAttributeNS(null, 'height', map.height + 'px');
                    this.svg.style.width = map.width + 'px';
                    this.svg.style.height = map.height + 'px';
                    this.type = 'ruin-background';
                }
                draw() {
                    const oldGroup = this.g;
                    this.g = document.createElementNS(this.ns, 'g');
                    const map = this.map;
                    const mapData = this.map.mapData;
                    const imagesLoader = map.imagesLoader;
                    const center = { x: map.width / 2, y: map.height / 2 };
                    const directions = mapData.directionsStr;
                    const walls = this.availableWalls();
                    const zones = this.availableZones();
                    this.img(imagesLoader.get(directions).src, 0, 0, 300, 300);
                    // the main door
                    if (mapData.exit) {
                        this.img(imagesLoader.get('exit').src, 117, 90, 64, 60);
                    }
                    if (mapData.room) {
                        console.log(mapData.room, walls, zones);
                    }
                    // you
                    const you = this.img(imagesLoader.get('you').src, 142, 136, 16, 32);
                    you.setAttributeNS(null, 'id', 'hmap-ruin-you');
                    // zombies
                    const random = new random_2.HMapRandom(mapData.seed);
                    for (let n = 1; n <= mapData.zombies; n++) {
                        const newPosZ = random.randomCircle(center, Math.floor(random.random() * 20) + 5);
                        this.img(imagesLoader.get('zombiegif').src, newPosZ.x, newPosZ.y, 25, 38);
                    }
                    this.svg.appendChild(this.g);
                    if (oldGroup) {
                        window.setTimeout(() => this.svg.removeChild(oldGroup), 100);
                    }
                }
                appendNextTile(shiftX, shiftY, dirs) {
                    const map = this.map;
                    const imagesLoader = map.imagesLoader;
                    const directions = '' + (+dirs[0]) + (+dirs[1]) + (+dirs[2]) + (+dirs[3]);
                    this.img(imagesLoader.get(directions).src, shiftX * 300, shiftY * 300, 300, 300);
                }
                easeMovement(target, callback) {
                    this.startTranslate = Date.now();
                    this.translateTo = target;
                    if (!this.intervalEasing) {
                        this.intervalEasing = window.setInterval(() => {
                            // translation effect when we click on an arrow
                            let coef = 1; // this will be increasing from 0 to 1
                            if (this.startTranslate) {
                                const p = (Date.now() - this.startTranslate) / 300; // 300ms
                                coef = p >= 1 ? 1 : 1 - Math.pow(2, -10 * p); // exp easing
                            }
                            else {
                                throw new Error('Cannot ease without starting the translation');
                            }
                            const translateX = this.translateTo.x;
                            const translateY = this.translateTo.y;
                            this.translation.x = translateX * coef;
                            this.translation.y = translateY * coef;
                            this.g.setAttributeNS(null, 'transform', 'translate(' + -1 * this.translation.x + ' ' + -1 * this.translation.y + ')');
                            if (coef >= 1) { // the motion is over, reset the variables
                                this.startTranslate = undefined;
                                this.translateTo = { x: 0, y: 0 };
                                clearInterval(this.intervalEasing);
                                this.intervalEasing = undefined;
                                callback();
                                // no need to reset the translation, it will be done by the draw function
                                return;
                            }
                        }, 40);
                    }
                }
                /**
                 * Get the available walls to put elements (doors or furnitures) on it
                 */
                availableWalls() {
                    const mapData = this.map.mapData;
                    const directions = mapData.directions;
                    const walls = new Array();
                    if (directions[0] === true) {
                        walls.push('A');
                        walls.push('B');
                    }
                    else {
                        walls.push('C');
                    }
                    if (directions[1] === true) {
                        walls.push('D');
                        walls.push('E');
                    }
                    else {
                        walls.push('F');
                    }
                    if (directions[2] === true) {
                        walls.push('G');
                        walls.push('H');
                    }
                    else {
                        walls.push('I');
                    }
                    if (directions[3] === true) {
                        walls.push('J');
                        walls.push('K');
                    }
                    else {
                        walls.push('L');
                    }
                    return walls;
                }
                availableZones() {
                    const mapData = this.map.mapData;
                    const directions = mapData.directions;
                    const zones = new Array();
                    zones.push('Z5');
                    if (directions[0] === true) {
                        zones.push('Z1');
                    }
                    if (directions[1] === true) {
                        zones.push('Z2');
                    }
                    if (directions[2] === true) {
                        zones.push('Z3');
                    }
                    if (directions[3] === true) {
                        zones.push('Z4');
                    }
                    return zones;
                }
            };
            exports_11("HMapSVGRuinBackgroundLayer", HMapSVGRuinBackgroundLayer);
        }
    };
});
System.register("layers/svg-ruin-foreground", ["layers/abstract", "lang", "random"], function (exports_12, context_12) {
    "use strict";
    var abstract_4, lang_1, random_3, HMapSVGRuinForegroundLayer;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (abstract_4_1) {
                abstract_4 = abstract_4_1;
            },
            function (lang_1_1) {
                lang_1 = lang_1_1;
            },
            function (random_3_1) {
                random_3 = random_3_1;
            }
        ],
        execute: function () {
            /**
             * This layer is dedicated to the loading screen
             */
            HMapSVGRuinForegroundLayer = class HMapSVGRuinForegroundLayer extends abstract_4.AbstractHMapLayer {
                constructor(map) {
                    super(map);
                    this.lowOxygen = false;
                    const hmap = document.querySelector('#hmap');
                    if (document.querySelector('#svgRuinForeground') === null && hmap) {
                        const SVG = document.createElementNS(this.ns, 'svg');
                        SVG.setAttributeNS(null, 'id', 'svgRuinForeground');
                        SVG.setAttributeNS(null, 'style', 'position:absolute;z-index:998;');
                        hmap.appendChild(SVG);
                        SVG.style.pointerEvents = 'none';
                    }
                    this.svg = document.getElementById('svgRuinForeground');
                    this.svg.setAttributeNS(null, 'width', map.width + 'px');
                    this.svg.setAttributeNS(null, 'height', map.height + 'px');
                    this.svg.style.width = map.width + 'px';
                    this.svg.style.height = map.height + 'px';
                    this.type = 'ruin-foreground';
                }
                draw() {
                    const oldGroup = this.g;
                    this.g = document.createElementNS(this.ns, 'g');
                    const map = this.map;
                    const mapData = this.map.mapData;
                    const imagesLoader = map.imagesLoader;
                    // scanner
                    this.img(imagesLoader.get('scanner').src, 250, 250, 38, 27);
                    // focus lens shadow (433x433)
                    this.img(imagesLoader.get('shadowFocus').src, (map.width - 433) / 2, (map.height - 433) / 2, 433, 433);
                    // green rects
                    this.rect(6, 6, map.width - 12, map.height - 25, 'transparent', '#188400', 1);
                    this.rect(4, 4, map.width - 8, map.height - 21, 'transparent', '#1a4e02', 1);
                    // glass
                    this.img(imagesLoader.get('glass').src, 0, 0, 300, 300); // image is 300x300
                    const oxygenText = this.text(map.width - 10, 14, lang_1.HMapLang.get('oxygen') + ' :', 'hmap-text-green');
                    oxygenText.setAttributeNS(null, 'text-anchor', 'end');
                    oxygenText.setAttributeNS(null, 'style', 'fill:#188300;');
                    // glass
                    const oxygenUnitO = this.text(map.width - 14, 27, 'O', 'hmap-text-green');
                    oxygenUnitO.setAttributeNS(null, 'style', 'font-size: 20px;');
                    oxygenUnitO.setAttributeNS(null, 'text-anchor', 'end');
                    const oxygenUnit2 = this.text(map.width - 10, 32, '2', 'hmap-text-green');
                    oxygenUnit2.setAttributeNS(null, 'style', 'font-size: 10px;');
                    oxygenUnit2.setAttributeNS(null, 'text-anchor', 'end');
                    oxygenUnit2.setAttributeNS(null, 'dominant-baseline', 'baseline');
                    const oxygenValue = this.text(map.width - 27, 27, '100', 'hmap-text-green');
                    oxygenValue.setAttributeNS(null, 'style', 'font-size: 20px;');
                    oxygenValue.setAttributeNS(null, 'text-anchor', 'end');
                    oxygenValue.setAttributeNS(null, 'id', 'hmap-oxygen');
                    // arrows
                    this.updateArrows();
                    // title
                    const random = new random_3.HMapRandom(mapData.zoneId);
                    const possibleNames = lang_1.HMapLang.getInstance().getRuinNames(mapData.ruinType);
                    const index = random.getRandomIntegerLocalSeed(0, possibleNames.length - 1);
                    const title = this.text(10, 15, possibleNames[index], 'hmap-text-green');
                    title.setAttributeNS(null, 'style', 'fill:#188300;');
                    this.svg.appendChild(this.g);
                    if (oldGroup) {
                        window.setTimeout(() => this.svg.removeChild(oldGroup), 100);
                    }
                }
                updateOxygen() {
                    const map = this.map;
                    const mapData = this.map.mapData;
                    const imagesLoader = map.imagesLoader;
                    console.log(mapData.oxygen);
                    const percent = Math.floor(mapData.oxygen / 3000);
                    const textElement = document.getElementById('hmap-oxygen');
                    if (textElement) {
                        textElement.textContent = '' + percent;
                    }
                    if (percent < 15) {
                        if (!this.lowOxygen) {
                            this.lowOxygen = true;
                            const you = document.querySelector('#hmap-ruin-you');
                            if (you) {
                                you.parentNode.removeChild(you);
                            }
                            this.img(imagesLoader.get('you-noox').src, 142, 133, 16, 34);
                        }
                    }
                }
                updateArrows() {
                    // remove existing arrows
                    const existingArrows = document.querySelectorAll('.hmap-arrow');
                    if (existingArrows) {
                        existingArrows.forEach(el => el.parentNode.removeChild(el));
                    }
                    // build new ones
                    const map = this.map;
                    const imagesLoader = map.imagesLoader;
                    for (let i = 0, j = map.registredArrows.length; i < j; i++) {
                        const arrow = map.registredArrows[i];
                        const arrowImg = this.img(imagesLoader.get('moveArrowLight').src, arrow.ax, arrow.ay, 82, 27, arrow.a, 'hmap-arrow');
                        arrowImg.style.pointerEvents = 'auto';
                        arrowImg.style.cursor = 'pointer';
                        this.img(imagesLoader.get('moveArrowOutline').src, arrow.ax, arrow.ay, 83, 28, arrow.a, 'hmap-arrow');
                        arrowImg.onmouseenter = () => {
                            this.img(imagesLoader.get('moveArrowLight').src, arrow.ax, arrow.ay, 83, 28, arrow.a, 'hmap-arrow hmap-arrowFill');
                        };
                        arrowImg.onmouseleave = () => {
                            document.querySelectorAll('.hmap-arrowFill').forEach((element) => {
                                element.remove();
                            });
                        };
                        arrowImg.onclick = () => {
                            this.map.move(arrow.t);
                        };
                    }
                }
            };
            exports_12("HMapSVGRuinForegroundLayer", HMapSVGRuinForegroundLayer);
        }
    };
});
System.register("maps/ruin", ["maps/abstract", "lang", "layers/svg-ruin-background", "layers/svg-loading", "toast", "data/hmap-ruin-data", "arrow", "environment", "random", "layers/svg-ruin-foreground"], function (exports_13, context_13) {
    "use strict";
    var abstract_5, lang_2, svg_ruin_background_1, svg_loading_1, toast_1, hmap_ruin_data_1, arrow_1, environment_1, random_4, svg_ruin_foreground_1, HMapRuin;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (abstract_5_1) {
                abstract_5 = abstract_5_1;
            },
            function (lang_2_1) {
                lang_2 = lang_2_1;
            },
            function (svg_ruin_background_1_1) {
                svg_ruin_background_1 = svg_ruin_background_1_1;
            },
            function (svg_loading_1_1) {
                svg_loading_1 = svg_loading_1_1;
            },
            function (toast_1_1) {
                toast_1 = toast_1_1;
            },
            function (hmap_ruin_data_1_1) {
                hmap_ruin_data_1 = hmap_ruin_data_1_1;
            },
            function (arrow_1_1) {
                arrow_1 = arrow_1_1;
            },
            function (environment_1_1) {
                environment_1 = environment_1_1;
            },
            function (random_4_1) {
                random_4 = random_4_1;
            },
            function (svg_ruin_foreground_1_1) {
                svg_ruin_foreground_1 = svg_ruin_foreground_1_1;
            }
        ],
        execute: function () {
            HMapRuin = class HMapRuin extends abstract_5.HMapAbstractMap {
                constructor() {
                    super(...arguments);
                    this.registredArrows = new Array();
                    this.moving = false;
                }
                generateMapData(payload) {
                    return new hmap_ruin_data_1.HMapRuinData(payload);
                }
                /**
                 * Build the layers (SVG) for this map
                 */
                buildLayers() {
                    const swf = document.querySelector(this.hmap.cssSelector);
                    if (swf !== null) {
                        swf.setAttribute('style', 'display:flex;flex-direction:column;height:auto');
                        if (this.hmap.displayFlashMap === false) {
                            const originalMap = document.querySelector('#swfCont');
                            if (originalMap) {
                                originalMap.style.display = 'none';
                            }
                        }
                        if (document.querySelector('#hmap') === null) {
                            const hmap = document.createElement('div');
                            hmap.setAttribute('id', 'hmap');
                            hmap.setAttribute('style', 'width:' + this.width + 'px;height:' + this.height + 'px;position:relative');
                            swf.appendChild(hmap);
                            // create the menu
                            const hmapMenu = document.createElement('div');
                            hmapMenu.setAttribute('id', 'hmap-menu');
                            hmapMenu.setAttribute('style', 'position:absolute;bottom:0px;z-index:10;height:20px;display:none');
                            hmap.appendChild(hmapMenu);
                            const debugButton = document.createElement('div');
                            debugButton.setAttribute('id', 'hmap-debug-button');
                            debugButton.setAttribute('class', 'hmap-button');
                            debugButton.innerHTML = lang_2.HMapLang.get('debugbutton');
                            hmapMenu.appendChild(debugButton);
                            debugButton.onclick = this.onDebugButtonClick.bind(this);
                            // style the buttons
                            const buttons = document.querySelectorAll('.hmap-button');
                            buttons.forEach((el) => {
                                el.onmouseleave = (e) => {
                                    e.target.style.outline = '0px';
                                };
                                el.onmouseenter = (e) => {
                                    e.target.style.outline = '1px solid #eccb94';
                                };
                            });
                            hmapMenu.style.display = 'none';
                        }
                        const RuinBGLayer = new svg_ruin_background_1.HMapSVGRuinBackgroundLayer(this);
                        this.layers.set('ruin-background', RuinBGLayer);
                        const RuinFGLayer = new svg_ruin_foreground_1.HMapSVGRuinForegroundLayer(this);
                        this.layers.set('ruin-foreground', RuinFGLayer);
                        const LoadingLayer = new svg_loading_1.HMapSVGLoadingLayer(this);
                        this.layers.set('loading', LoadingLayer);
                    }
                }
                /**
                 * Action to execute when new data arrive
                 */
                onDataReceived(init) {
                    // @TODO : guess the ruin type
                    this.type = this.mapData.ruinType;
                    if (init) {
                        this.imagesLoader.loadRuinPics(this.type);
                    }
                    this.registerArrows();
                    // when preloading the pictures is finished, starts drawing
                    this.imagesLoader
                        .preloadPictures(this.layers.get('loading'), init, () => {
                        const hmapMenu = document.querySelector('#hmap-menu');
                        if (hmapMenu !== null) {
                            hmapMenu.style.display = 'flex';
                        }
                        const loadingLayer = this.layers.get('loading');
                        loadingLayer.hide();
                        this.layers.get('ruin-background').draw();
                        const FGLayer = this.layers.get('ruin-foreground');
                        if (init) {
                            FGLayer.draw();
                        }
                        else {
                            FGLayer.updateArrows();
                            FGLayer.updateOxygen();
                        }
                    });
                }
                /**
                 * Copy the mapData to clipboard
                 */
                onDebugButtonClick() {
                    const el = document.createElement('textarea');
                    el.value = this.mapData.prettyData;
                    console.log(this.mapData.data);
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                    toast_1.Toast.show(lang_2.HMapLang.get('toastdebug'));
                }
                /**
                 * Function called when the user click on a directionnal arrow
                 * The function is big due to the debug mode
                 */
                move(direction) {
                    const mapData = this.mapData;
                    // since the move is happening in a setTimeout, we have to do this boolean trick to avoid double move
                    if (this.moving === true) {
                        return;
                    }
                    this.moving = true;
                    let x, y;
                    if (direction === 'right') {
                        x = 1;
                        y = 0;
                    }
                    else if (direction === 'left') {
                        x = -1;
                        y = 0;
                    }
                    else if (direction === 'top') {
                        x = 0;
                        y = -1;
                    }
                    else {
                        x = 0;
                        y = 1;
                    }
                    const ruinLayer = this.layers.get('ruin-background');
                    if (environment_1.Environment.getInstance().devMode === false) {
                        /*
                        const url = 'outside/go?x=' + x + ';y=' + y + ';z=' + mapData.zoneId + js.JsMap.sh;
            
                        let hx: any;
            
                        // @ts-ignore
                        const page: any = window.wrappedJSObject;
                        if (page !== undefined && page.haxe) { // greasemonkey ...
                            hx = page.haxe;
                        } else if (haxe) { // tampermonkey
                            hx = haxe;
                        }
            
                        const r = new hx.Http('/' + url);
                        js.XmlHttp.onStart(r);
                        js.XmlHttp.urlForBack = url;
                        r.setHeader('X-Handler', 'js.XmlHttp');
                        r.onData = (data: string) => {
                            this.hmap.originalOnData!(data); // we are sure the function has been set
            
                            ruinLayer.easeMovement({ x: 100 * x, y: 100 * y }, () => {
                                // move the position
                                mapData.movePosition(x, y);
            
                                if (data.indexOf('js.JsMap.init') !== -1) {
                                    const startVar = data.indexOf('js.JsMap.init') + 16;
                                    const stopVar = data.indexOf('\',', startVar);
                                    const tempMapData = data.substring(startVar, stopVar);
            
                                    this.partialDataReceived({ raw: tempMapData });
                                }
            
                                this.moving = false; // allow another move
                            });
                        };
            
                        r.onError = js.XmlHttp.onError;
                        r.request(false);
                        */
                    }
                    else { // dev mode, fake the data
                        let exit = false;
                        if ((mapData.position.x + x) === 7 && (mapData.position.y + y) === 0) {
                            exit = true;
                        }
                        // fake the move with already known data
                        const seed = 1127 + mapData.position.x + x + 10 * (mapData.position.y + y);
                        const random = new random_4.HMapRandom(seed);
                        const fakeData = {
                            _dirs: mapData.getFakeDirs({ x: mapData.position.x + x, y: mapData.position.y + y }),
                            _move: true,
                            _d: {
                                _exit: exit,
                                _room: random.getOneOfLocalSeed([{
                                        _locked: random.getRandomIntegerLocalSeed(1, 4) === 2 ? false : true,
                                        _doorKind: random.getRandomIntegerLocalSeed(1, 4)
                                    }, null, null, null, null, null]),
                                _seed: seed,
                                _k: random.getRandomIntegerLocalSeed(0, 3),
                                _w: true,
                                _z: random.getOneOfLocalSeed([random.getRandomIntegerLocalSeed(1, 3), 0, 0, 0, 0]),
                            },
                            _o: mapData.oxygen - 3000,
                            _r: false,
                            _x: mapData.position.x + x,
                            _y: mapData.position.y + y
                        };
                        ruinLayer.appendNextTile(x, y, fakeData._dirs);
                        // variables to manage the start effect
                        ruinLayer.easeMovement({ x: 300 * x, y: 300 * y }, () => {
                            this.partialDataReceived({ JSON: fakeData });
                            this.moving = false; // allow another move
                        });
                    }
                }
                /**
                 * Register the available directionnal arrows
                 */
                registerArrows() {
                    this.registredArrows = new Array();
                    if (this.mapData) {
                        const mapData = this.mapData;
                        if (mapData.oxygen > 0) { // if we can move
                            let offsetY, offsetX;
                            const direction = mapData.directions;
                            if (direction[1] === true) {
                                offsetY = 15;
                                offsetX = -41 + 150;
                                const A = new arrow_1.HMapArrow(offsetX, offsetY, offsetX, offsetY, 83, 28, 'top', 0, false);
                                this.registredArrows.push(A);
                            }
                            if (direction[3] === true) {
                                offsetY = 250;
                                offsetX = -41 + 150;
                                const A = new arrow_1.HMapArrow(offsetX, offsetY, offsetX, offsetY, 83, 28, 'bottom', 180, false);
                                this.registredArrows.push(A);
                            }
                            if (direction[2] === true) {
                                offsetX = 230;
                                offsetY = -14 + 150;
                                const A = new arrow_1.HMapArrow(offsetX, offsetY, offsetX + 27, offsetY - 27, 28, 83, 'right', 90, false);
                                this.registredArrows.push(A);
                            }
                            if (direction[0] === true) {
                                offsetX = -10;
                                offsetY = -14 + 150;
                                const A = new arrow_1.HMapArrow(offsetX, offsetY, offsetX + 27, offsetY - 27, 28, 83, 'left', 270, false);
                                this.registredArrows.push(A);
                            }
                        }
                    }
                }
            };
            exports_13("HMapRuin", HMapRuin);
        }
    };
});
System.register("imagesLoader", ["environment", "toast"], function (exports_14, context_14) {
    "use strict";
    var environment_2, toast_2, HMapImagesLoader;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [
            function (environment_2_1) {
                environment_2 = environment_2_1;
            },
            function (toast_2_1) {
                toast_2 = toast_2_1;
            }
        ],
        execute: function () {
            /**
             * This class is a helper to help preload the images
             */
            HMapImagesLoader = class HMapImagesLoader {
                constructor() {
                    this.images = new Map();
                    // images to preload
                    this.images.set('loading', { src: environment_2.Environment.getInstance().url + '/assets/loading.png', obj: undefined });
                    this.images.set('glass', { src: environment_2.Environment.getInstance().url + '/assets/glass.png', obj: undefined });
                    this.images.set('humanGlow', { src: environment_2.Environment.getInstance().url + '/assets/human_glow.png', obj: undefined });
                    this.images.set('map', { src: environment_2.Environment.getInstance().url + '/assets/map.png', obj: undefined });
                    this.images.set('moveArrowFill', { src: environment_2.Environment.getInstance().url + '/assets/move_arrow_fill.png', obj: undefined });
                    this.images.set('moveArrowLight', { src: environment_2.Environment.getInstance().url + '/assets/move_arrow_light.png', obj: undefined });
                    this.images.set('moveArrowOutline', { src: environment_2.Environment.getInstance().url + '/assets/move_arrow_outline.png', obj: undefined });
                    this.images.set('night', { src: environment_2.Environment.getInstance().url + '/assets/night.png', obj: undefined });
                    this.images.set('shadowFocus', { src: environment_2.Environment.getInstance().url + '/assets/shadow_focus.png', obj: undefined });
                    this.images.set('targetArrow', { src: environment_2.Environment.getInstance().url + '/assets/town_arrow.png', obj: undefined });
                    this.images.set('zombieGlow', { src: environment_2.Environment.getInstance().url + '/assets/zombie_glow.png', obj: undefined });
                    this.images.set('blood', { src: environment_2.Environment.getInstance().url + '/assets/blood.png', obj: undefined });
                    this.images.set('single', { src: environment_2.Environment.getInstance().url + '/assets/single.png', obj: undefined });
                    this.images.set('hatch', { src: environment_2.Environment.getInstance().url + '/assets/hatch.png', obj: undefined });
                    this.images.set('town', { src: environment_2.Environment.getInstance().url + '/assets/town.png', obj: undefined });
                    this.images.set('building', { src: environment_2.Environment.getInstance().url + '/assets/building.png', obj: undefined });
                    this.images.set('hatch-dense', { src: environment_2.Environment.getInstance().url + '/assets/hatch_dense.png', obj: undefined });
                    this.images.set('target', { src: environment_2.Environment.getInstance().url + '/assets/target.png', obj: undefined });
                    this.images.set('position', { src: environment_2.Environment.getInstance().url + '/assets/position.png', obj: undefined });
                    this.images.set('people', { src: environment_2.Environment.getInstance().url + '/assets/people.png', obj: undefined });
                    this.images.set('uncheck', { src: environment_2.Environment.getInstance().url + '/assets/uncheck.png', obj: undefined });
                    this.images.set('check', { src: environment_2.Environment.getInstance().url + '/assets/check.png', obj: undefined });
                    this.images.set('destination', { src: environment_2.Environment.getInstance().url + '/assets/destination.png', obj: undefined });
                    for (let tag = 1; tag <= 11; tag++) {
                        this.images.set('tag_' + tag, { src: environment_2.Environment.getInstance().url + '/assets/tags/' + tag + '.png', obj: undefined });
                    }
                    // tag 12 is a gif
                    this.images.set('tag_12', { src: environment_2.Environment.getInstance().url + '/assets/tags/12.gif', obj: undefined });
                }
                static getInstance() {
                    if (this._instance === undefined) {
                        this._instance = new HMapImagesLoader();
                    }
                    return this._instance;
                }
                loadRuinPics(location) {
                    this.images.set('0001', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/0001.png', obj: undefined });
                    this.images.set('0010', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/0010.png', obj: undefined });
                    this.images.set('0011', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/0011.png', obj: undefined });
                    this.images.set('0100', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/0100.png', obj: undefined });
                    this.images.set('0101', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/0101.png', obj: undefined });
                    this.images.set('0110', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/0110.png', obj: undefined });
                    this.images.set('0111', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/0111.png', obj: undefined });
                    this.images.set('1000', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/1000.png', obj: undefined });
                    this.images.set('1001', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/1001.png', obj: undefined });
                    this.images.set('1010', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/1010.png', obj: undefined });
                    this.images.set('1011', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/1011.png', obj: undefined });
                    this.images.set('1100', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/1100.png', obj: undefined });
                    this.images.set('1101', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/1101.png', obj: undefined });
                    this.images.set('1110', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/1110.png', obj: undefined });
                    this.images.set('1111', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/1111.png', obj: undefined });
                    this.images.set('dead', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/dead.png', obj: undefined });
                    this.images.set('elem1', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/elem1.png', obj: undefined });
                    this.images.set('elem2', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/elem2.png', obj: undefined });
                    this.images.set('elem3', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/elem3.png', obj: undefined });
                    this.images.set('elem4', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/elem4.png', obj: undefined });
                    this.images.set('elem5', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/elem5.png', obj: undefined });
                    this.images.set('light', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/light.png', obj: undefined });
                    this.images.set('exit', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/exit.png', obj: undefined });
                    this.images.set('room', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/room.png', obj: undefined });
                    this.images.set('zombiegif', { src: environment_2.Environment.getInstance().url + '/assets/ruin/' + location + '/zombie.gif', obj: undefined });
                    this.images.set('you', { src: environment_2.Environment.getInstance().url + '/assets/ruin/you.gif', obj: undefined });
                    this.images.set('you-noox', { src: environment_2.Environment.getInstance().url + '/assets/ruin/you_noox.gif', obj: undefined });
                    this.images.set('scanner', { src: environment_2.Environment.getInstance().url + '/assets/ruin/scanner.gif', obj: undefined });
                }
                isset(imageId) {
                    return (this.images.get(imageId) !== undefined);
                }
                get(imageId) {
                    return this.images.get(imageId); // assuming we's always passing a known id. It'll avoid lots of !
                }
                set(imageId, value) {
                    this.images.set(imageId, value);
                }
                issetImg(imageId) {
                    return (this.isset(imageId) && this.get(imageId).obj !== undefined);
                }
                getImg(imageId) {
                    return this.get(imageId).obj;
                }
                /**
                  * Preload the pictures and complete the images meta object
                  * It will also display the loading animation on the layer BG
                  * @param loadingLayer layer with the progress bar
                  * @param init boolean to tell if we are in initialisation phaseor not (display bar or not)
                  * @param onFinished callback to be called when it's done
                  */
                preloadPictures(loadingLayer, init, onFinished) {
                    let loaded = 0;
                    this.images.forEach((value) => {
                        if (value.obj === undefined) { // not already loaded, then load it
                            const img = new Image();
                            img.src = value.src;
                            img.onload = () => {
                                if (init) {
                                    loadingLayer.progress(loaded / this.images.size);
                                }
                                if (++loaded === this.images.size && onFinished) {
                                    onFinished(); // when it's done, start the drawing
                                }
                            };
                            img.onerror = () => {
                                toast_2.Toast.show('Cannot load ressource : ' + value.src);
                            };
                            value.obj = img;
                        }
                        else { // already loaded, skip it with the same code. That's ugly but I got myself trapped
                            if (init) {
                                loadingLayer.progress(loaded / this.images.size);
                            }
                            if (++loaded === this.images.size && onFinished) {
                                onFinished(); // when it's done, start the drawing
                            }
                        }
                    });
                }
                /**
                 * Register the buildings to preload the pics (this is done to avoid the preloading of the 60+ pics of buildings)
                 */
                registerBuildingsToPreload(neighbours) {
                    // register the buildings to draw it later
                    neighbours.neighbours.forEach((neighbour) => {
                        if (neighbour.building !== 0 && neighbour.building !== undefined && !this.issetImg('b' + neighbour.building)) {
                            let url;
                            if (neighbour.building === -1) {
                                url = environment_2.Environment.getInstance().url + '/assets/buildings/b_m1.png';
                            }
                            else {
                                url = environment_2.Environment.getInstance().url + '/assets/buildings/b_' + neighbour.building + '.png';
                            }
                            this.set('b' + neighbour.building, {
                                src: url,
                                obj: undefined
                            });
                        }
                    });
                }
            };
            exports_14("HMapImagesLoader", HMapImagesLoader);
        }
    };
});
System.register("data/hmap-desert-data", ["neighbours", "random", "data/abstract"], function (exports_15, context_15) {
    "use strict";
    var neighbours_1, random_5, abstract_6, HMapDesertData;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (neighbours_1_1) {
                neighbours_1 = neighbours_1_1;
            },
            function (random_5_1) {
                random_5 = random_5_1;
            },
            function (abstract_6_1) {
                abstract_6 = abstract_6_1;
            }
        ],
        execute: function () {
            /**
             * This class is the store of the map. It handles the data originally
             * passed to flash, and expose it in a JSON format with lots of accessors
             */
            HMapDesertData = class HMapDesertData extends abstract_6.HMapData {
                constructor(mapDataPayload) {
                    super(mapDataPayload);
                    this.neighbours = new neighbours_1.HMapNeighbours();
                    this.buildings = new Map();
                    this.users = new Map();
                    this.buildNeighbours();
                    this.town = this.findTown();
                    this.cacheBuildingsNames();
                    this.cacheUsersOutside();
                }
                get size() { return { width: this.data._w, height: this.data._h }; }
                get position() { return { x: this.data._x, y: this.data._y }; }
                get index() { return this.getIndex({ x: this.data._x, y: this.data._y }); }
                get actionPoints() { return this.data._r._m; }
                get numberOfHumans() { return this.data._r._h; }
                get zoneId() { return this.data._r._zid; }
                get numberOfZombies() { return this.data._r._z; }
                get hour() { return this.data._hour; }
                get hasControl() { return !this.data._r._state; }
                get scoutArray() { return this.data._r._neig; }
                get details() { return this.data._details; }
                get global() { return this.data._global; }
                get view() { return this.data._view; }
                get townName() { return this.data._city; }
                /**
                 * Decode the url encoded flashvar
                 */
                decode(urlEncoded) {
                    let st, hx, mc;
                    try {
                        // @ts-ignore
                        const page = window.wrappedJSObject;
                        if (page !== undefined && page.StringTools && page.MapCommon && page.haxe) { // greasemonkey ...
                            st = page.StringTools;
                            hx = page.haxe;
                            mc = page.MapCommon;
                        }
                        else if (StringTools && haxe && MapCommon) { // tampermonkey
                            st = StringTools;
                            hx = haxe;
                            mc = MapCommon;
                        }
                        const tempMapData = st.urlDecode(urlEncoded);
                        return hx.Unserializer.run(this.binaryToMessage(mc.genKey(tempMapData.length), mc.permute(tempMapData)));
                    }
                    catch (err) {
                        console.error('HMapDesertData::decode - caught an exception during decoding', err, urlEncoded);
                        throw err;
                    }
                }
                /**
                 * JSON patching separated to enable dev mode
                 */
                patchDataJSON(data) {
                    this.data._r = data;
                    // update the details and the view
                    const indexNewPosition = this.getIndex({ x: this.data._x, y: this.data._y });
                    this.data._details[indexNewPosition]._c = this.data._r._c;
                    this.data._details[indexNewPosition]._t = this.data._r._t;
                    this.data._details[indexNewPosition]._z = this.data._r._z;
                    if (this.data._details[indexNewPosition]._nvt === null) {
                        this.data._details[indexNewPosition]._nvt = false;
                    }
                    this.data._view[indexNewPosition] = this.data._r._c;
                    this.data._global[indexNewPosition] = this.data._r._c;
                    // dont forget to rebuild the neighbours (its usually done in the constructor)
                    this.buildNeighbours();
                }
                getPositionRelativeToTown(position) {
                    return { x: position.x - this.town.x, y: this.town.y - position.y };
                }
                /**
                 * Called with +/- 1 on x or y when we move the map
                 */
                movePosition(offsetX, offsetY) {
                    this.data._x += offsetX;
                    this.data._y += offsetY;
                }
                /**
                 * Get the map index from the coordinates
                 */
                getIndex(position) {
                    return position.x + (position.y * this.size.width);
                }
                /**
                 * Returns the position from the index and the width
                 * @param index index in the big array
                 * @param sizeX width
                 */
                getCoordinates(index) {
                    return {
                        y: Math.floor(index / this.size.width),
                        x: index % this.size.width
                    };
                }
                /**
                 * Return true if the coordinates are in map bounds
                 */
                inBounds(pos) {
                    return pos.x >= 0 && pos.y >= 0 && pos.x < this.size.width && pos.y < this.size.height;
                }
                /**
                 * Return true if the positon has already been discovered
                 */
                isPositionDiscovered(pos) {
                    const index = this.getIndex(pos);
                    return (this.data._view[index] !== null && this.data._view[index] !== undefined) ? true : false;
                }
                /**
                 * Create the neighbours map
                 */
                buildNeighbours() {
                    this.neighbours.neighbours = new Map();
                    for (let X = this.position.x - 1; X <= this.position.x + 1; X++) {
                        for (let Y = this.position.y - 1; Y <= this.position.y + 1; Y++) {
                            const outbounds = !this.inBounds({ x: X, y: Y });
                            let p;
                            if (X < this.position.x) {
                                if (Y < this.position.y) {
                                    p = 'top_left';
                                }
                                else if (Y === this.position.y) {
                                    p = 'middle_left';
                                }
                                else {
                                    p = 'bottom_left';
                                }
                            }
                            else if (X === this.position.x) {
                                if (Y < this.position.y) {
                                    p = 'top_center';
                                }
                                else if (Y === this.position.y) {
                                    p = 'middle_center';
                                }
                                else {
                                    p = 'bottom_center';
                                }
                            }
                            else {
                                if (Y < this.position.y) {
                                    p = 'top_right';
                                }
                                else if (Y === this.position.y) {
                                    p = 'middle_right';
                                }
                                else {
                                    p = 'bottom_right';
                                }
                            }
                            const N = new neighbours_1.HMapNeighbour(X, Y, p, outbounds, this.getIndex({ x: X, y: Y }), false, 0);
                            if (!N.outbounds) {
                                N.building = (this.data._details[N.index]._c !== null) ? this.data._details[N.index]._c : 0;
                                N.view = this.isPositionDiscovered({ x: X, y: Y });
                            }
                            this.neighbours.addNeighbour(N);
                        }
                    }
                }
                /**
                 * Find the town and return it
                 */
                findTown() {
                    for (let index = 0, length = this.data._details.length; index < length; index++) {
                        if (this.data._details[index]._c === 1) {
                            return this.getCoordinates(index);
                        }
                    }
                    return { x: 0, y: 0 }; // this case is not possible but it makes typescript happy
                }
                cacheBuildingsNames() {
                    this.data._b.forEach((B) => {
                        this.buildings.set(B._id, B._n);
                    });
                }
                /**
                 * Index the users in a good container (this.users)
                 */
                cacheUsersOutside() {
                    if (this.data._users !== null && this.data._users.length > 0) {
                        this.data._users.forEach(user => {
                            const userIndex = this.getIndex({ x: user._x, y: user._y });
                            let userOnThisPosition = this.users.get(userIndex);
                            if (userOnThisPosition === undefined || userOnThisPosition === null) {
                                userOnThisPosition = new Array();
                            }
                            userOnThisPosition.push(user);
                            this.users.set(userIndex, userOnThisPosition);
                        });
                    }
                }
                /**
                 * create a fake JSON to debug the map
                 */
                fakeData(force = false) {
                    if (this._fakeData !== undefined && force === false) {
                        return this._fakeData;
                    }
                    else {
                        const mapSize = random_5.HMapRandom.getRandomIntegerNoSeed(8, 25);
                        const town = {
                            x: random_5.HMapRandom.getRandomIntegerNoSeed(3, mapSize - 3),
                            y: random_5.HMapRandom.getRandomIntegerNoSeed(3, mapSize - 3)
                        };
                        this._fakeData = {
                            _details: new Array(),
                            _city: 'Oh yeah',
                            _hour: 17,
                            _path: null,
                            _slow: true,
                            _b: new Array(),
                            _e: new Array(),
                            _h: mapSize,
                            _r: {
                                _neigDrops: new Array(),
                                _neig: new Array(),
                                _state: false,
                                _c: 1,
                                _h: 1,
                                _m: 6,
                                _t: random_5.HMapRandom.getRandomIntegerNoSeed(0, 12),
                                _z: 0,
                                _zid: random_5.HMapRandom.getRandomIntegerNoSeed(111111, 999999)
                            },
                            _w: mapSize,
                            _x: town.x,
                            _y: town.y,
                            _town: false,
                            _up: false,
                            _view: new Array(),
                            _global: new Array(),
                            _users: null,
                            _editor: false,
                            _map: false,
                            _mid: random_5.HMapRandom.getRandomIntegerNoSeed(111111, 999999)
                        };
                        let index = 0, townIndex = 0;
                        const buildings = new Array();
                        for (let y = 0; y < mapSize; y++) {
                            for (let x = 0; x < mapSize; x++) {
                                let view = false;
                                if (x < town.x + 5 && x > town.x - 5 && y < town.y + 5 && y > town.y - 5) {
                                    view = true;
                                }
                                let bid = (town.x === x && town.y === y) ?
                                    1 : (random_5.HMapRandom.getRandomIntegerNoSeed(0, 10) === 5 ? random_5.HMapRandom.getRandomIntegerNoSeed(2, 62) : 0);
                                bid = random_5.HMapRandom.getRandomIntegerNoSeed(0, 10) === 5 ? -1 : bid;
                                buildings.push({ _id: bid, _n: 'Building ' + bid });
                                this._fakeData._details.push({
                                    _c: bid,
                                    _s: false,
                                    _t: random_5.HMapRandom.getRandomIntegerNoSeed(0, 12),
                                    _z: random_5.HMapRandom.getRandomIntegerNoSeed(0, 3) === 2 ? random_5.HMapRandom.getRandomIntegerNoSeed(0, 18) : 0,
                                    _nvt: view
                                });
                                if (view === true) {
                                    this._fakeData._view.push(bid);
                                }
                                else {
                                    this._fakeData._view.push(null);
                                }
                                if (bid === 1) {
                                    townIndex = index;
                                }
                                index++;
                            }
                        }
                        this._fakeData._global = this._fakeData._view;
                        this._fakeData._b = buildings;
                        this._fakeData._r._neig = new Array();
                        if (townIndex - mapSize > 0) {
                            this._fakeData._r._neig.push(this._fakeData._details[townIndex - mapSize]._z);
                        }
                        else {
                            this._fakeData._r._neig.push(0);
                        }
                        if (townIndex + 1 < (mapSize * mapSize)) {
                            this._fakeData._r._neig.push(this._fakeData._details[townIndex + 1]._z);
                        }
                        else {
                            this._fakeData._r._neig.push(0);
                        }
                        if (townIndex + mapSize < (mapSize * mapSize)) {
                            this._fakeData._r._neig.push(this._fakeData._details[townIndex + mapSize]._z);
                        }
                        else {
                            this._fakeData._r._neig.push(0);
                        }
                        if (townIndex - 1 > 0) {
                            this._fakeData._r._neig.push(this._fakeData._details[townIndex - 1]._z);
                        }
                        else {
                            this._fakeData._r._neig.push(0);
                        }
                        return this._fakeData;
                    }
                }
            };
            exports_15("HMapDesertData", HMapDesertData);
        }
    };
});
System.register("layers/svg-grid", ["random", "layers/abstract", "lang"], function (exports_16, context_16) {
    "use strict";
    var random_6, abstract_7, lang_3, HMapSVGGridLayer;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (random_6_1) {
                random_6 = random_6_1;
            },
            function (abstract_7_1) {
                abstract_7 = abstract_7_1;
            },
            function (lang_3_1) {
                lang_3 = lang_3_1;
            }
        ],
        execute: function () {
            /**
             * This layer will hold the grid view
             */
            HMapSVGGridLayer = class HMapSVGGridLayer extends abstract_7.AbstractHMapLayer {
                constructor(map) {
                    super(map);
                    this.spaceBetweenSquares = 1;
                    this.isPanning = false;
                    this.startPoint = { x: 0, y: 0 };
                    this.endPoint = { x: 0, y: 0 };
                    this.scale = 1;
                    this.viewBox = { x: 0, y: 0, w: 0, h: 0 };
                    const hmap = document.querySelector('#hmap');
                    if (document.querySelector('#svgGrid') === null && hmap) {
                        const SVG = document.createElementNS(this.ns, 'svg');
                        SVG.setAttributeNS(null, 'id', 'svgGrid');
                        SVG.setAttributeNS(null, 'style', 'position:absolute;z-index:2;');
                        hmap.appendChild(SVG);
                        hmap.style.backgroundColor = '#2b3a08';
                    }
                    this.svg = document.getElementById('svgGrid');
                    this.svg.setAttributeNS(null, 'width', map.width + 'px');
                    this.svg.setAttributeNS(null, 'height', map.height + 'px');
                    this.svg.style.width = map.width + 'px';
                    this.svg.style.height = map.height + 'px';
                    this.attachPanZoomEvents();
                    this.type = 'grid';
                }
                draw() {
                    const oldGroup = this.g;
                    this.g = document.createElementNS(this.ns, 'g');
                    const mapData = this.map.mapData;
                    const map = this.map;
                    const minWidthHeight = Math.min(map.width, map.height);
                    const availableSize = minWidthHeight - 25 - this.spaceBetweenSquares * mapData.size.height;
                    this.squareSize = Math.floor(availableSize / mapData.size.height);
                    this.padding = Math.floor((minWidthHeight - this.spaceBetweenSquares * mapData.size.height - this.squareSize * mapData.size.height) / 2);
                    for (let i = 0, j = mapData.details.length; i < j; i++) {
                        const position = mapData.getCoordinates(i);
                        const currentPos = (position.y === mapData.position.y && position.x === mapData.position.x); // position is current positon
                        const x = this.padding + position.x * (this.squareSize + this.spaceBetweenSquares);
                        const y = this.padding / 2 + position.y * (this.squareSize + this.spaceBetweenSquares);
                        // color or hatch the position
                        let visionArray = mapData.global;
                        if (map.mode === 'personal') {
                            visionArray = mapData.view;
                        }
                        // color the case
                        let fillColor = '#475613'; // default background color
                        let strokeColor;
                        if (currentPos) {
                            strokeColor = '#d8fe6e';
                        }
                        if (mapData.details[i]._z > 9) {
                            fillColor = '#8f340b';
                        }
                        else if (mapData.details[i]._z > 5) {
                            fillColor = '#8f7324';
                        }
                        else if (mapData.details[i]._z > 0) {
                            fillColor = '#8f990b';
                        }
                        else {
                            fillColor = '#475613';
                        }
                        const square = this.rect(x, y, this.squareSize, this.squareSize, fillColor, strokeColor);
                        square.setAttributeNS(null, 'index', i + '');
                        if (currentPos) {
                            square.setAttributeNS(null, 'current', 'true');
                        }
                        square.onmouseenter = this.onMouseEnterSquare.bind(this);
                        square.onmouseleave = this.onMouseLeaveSquare.bind(this);
                        square.onmouseup = this.onMouseUpSquare.bind(this);
                        if (visionArray[i] !== undefined && visionArray[i] !== null && visionArray[i] >= -1) {
                            if (mapData.details[i]._nvt === true) { // outside of tower range
                                this.img(map.imagesLoader.get('hatch').src, x, y, this.squareSize, this.squareSize);
                            }
                            else if (mapData.details[i]._nvt === false) { // inside of tower range
                                // apparently nothing to do in this case, but I'm not sure so I let the if
                            }
                            else {
                                throw new Error('HMapGridLayer::draw - as far as I understand, we cannot be in this case');
                            }
                        }
                        else { // position never visited
                            this.img(map.imagesLoader.get('hatch-dense').src, x, y, this.squareSize, this.squareSize);
                        }
                        if (mapData.details[i]._c > 0 || mapData.details[i]._c === -1) { // another building than town
                            if (mapData.details[i]._c === 1) { // town
                                this.img(map.imagesLoader.get('town').src, x, y, this.squareSize, this.squareSize);
                            }
                            else {
                                this.img(map.imagesLoader.get('building').src, x, y, this.squareSize, this.squareSize);
                            }
                        }
                        // place the users
                        if (mapData.details[i]._c !== 1) {
                            const users = mapData.users.get(i);
                            if (users !== undefined) {
                                users.forEach(user => {
                                    let usernameAsNumber = 0; // for seeding purposes
                                    for (let k = 0; k < user._n.length; k++) {
                                        usernameAsNumber += user._n.charCodeAt(k);
                                    }
                                    const seed = (x * 10 + y) * (y * 10 + x) + usernameAsNumber;
                                    const random = new random_6.HMapRandom(seed);
                                    const userImg = this.img(map.imagesLoader.get('people').src, x + random.getRandomIntegerLocalSeed(0.2 * this.squareSize, 0.8 * this.squareSize), y + random.getRandomIntegerLocalSeed(0.2 * this.squareSize, 0.8 * this.squareSize), 5, 5);
                                    userImg.setAttributeNS(null, 'class', 'hmap-user');
                                });
                            }
                        }
                        // display tags
                        if (map.displayTags) {
                            const tag = mapData.details[i]._t;
                            if (tag > 0 && tag < 13) {
                                const tagSize = Math.min(this.squareSize / 1.5, 16);
                                const tagImg = this.img(map.imagesLoader.get('tag_' + tag).src, x + this.squareSize / 2 - tagSize / 2, y + this.squareSize / 2 - tagSize / 2, tagSize, tagSize);
                                tagImg.setAttributeNS(null, 'class', 'hmap-tag');
                            }
                        }
                        // draw the target
                        if (mapData.details[i]._c !== 1 &&
                            !currentPos &&
                            position.x === map.target.x &&
                            position.y === map.target.y) { // not town && target && not current pos
                            const target = this.img(map.imagesLoader.get('target').src, x, y, this.squareSize, this.squareSize);
                            target.setAttributeNS(null, 'class', 'hmap-target');
                        }
                    } // iterate over the grid
                    this.svg.appendChild(this.g);
                    if (oldGroup) {
                        window.setTimeout(() => this.svg.removeChild(oldGroup), 100);
                    }
                }
                onMouseEnterSquare(e) {
                    if (this.isPanning) {
                        return;
                    }
                    const rect = e.target;
                    const index = (rect.getAttributeNS(null, 'index') !== null) ? +rect.getAttributeNS(null, 'index') : undefined;
                    if (index !== undefined && this.squareSize && this.padding) {
                        const mapData = this.map.mapData;
                        const position = mapData.getCoordinates(index);
                        const x = this.padding + position.x * (this.squareSize + this.spaceBetweenSquares);
                        const y = this.padding / 2 + position.y * (this.squareSize + this.spaceBetweenSquares);
                        if (rect.getAttributeNS(null, 'current') !== 'true') {
                            rect.setAttributeNS(null, 'stroke', '#d8fe6e');
                            rect.setAttributeNS(null, 'stroke-width', '2');
                        }
                        this.drawPopup(x, y, index);
                    }
                }
                onMouseLeaveSquare(e) {
                    if (this.isPanning) {
                        return;
                    }
                    const rect = e.target;
                    if (rect.getAttributeNS(null, 'current') !== 'true') {
                        rect.setAttributeNS(null, 'stroke', '');
                        rect.setAttributeNS(null, 'stroke-width', '0');
                    }
                    // remove the popup elements
                    document.querySelectorAll('.hmap-popup').forEach(elementToRemove => elementToRemove.remove());
                }
                onMouseUpSquare(e) {
                    if (this.startPoint.x !== this.endPoint.x || this.startPoint.y !== this.endPoint.y) {
                        return; // panning situation. leave
                    }
                    const map = this.map;
                    const rect = e.target;
                    const index = (rect.getAttributeNS(null, 'index') !== null) ? +rect.getAttributeNS(null, 'index') : undefined;
                    // remove the current target
                    document.querySelectorAll('.hmap-target').forEach(elementToRemove => elementToRemove.remove());
                    // create new target
                    if (index !== undefined && this.squareSize && this.padding) {
                        const mapData = this.map.mapData;
                        const position = mapData.getCoordinates(index);
                        const x = this.padding + position.x * (this.squareSize + this.spaceBetweenSquares);
                        const y = this.padding / 2 + position.y * (this.squareSize + this.spaceBetweenSquares);
                        map.setTarget(mapData.getCoordinates(index));
                        const target = this.img(map.imagesLoader.get('target').src, x, y, this.squareSize, this.squareSize);
                        target.setAttributeNS(null, 'class', 'hmap-target');
                    }
                }
                /**
                 * Reset the zoom & pan level
                 */
                resetView() {
                    const width = this.map.width;
                    const height = this.map.height;
                    this.viewBox = { x: 0, y: 0, w: width, h: height };
                    this.isPanning = false;
                    this.startPoint = { x: 0, y: 0 };
                    this.endPoint = { x: 0, y: 0 };
                    this.scale = 1;
                    this.svg.setAttributeNS(null, 'viewBox', `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.w} ${this.viewBox.h}`);
                }
                /**
                 * Enable the zoom and pan behavior
                 */
                attachPanZoomEvents() {
                    const svgContainer = document.querySelector('#hmap');
                    this.viewBox = { x: 0, y: 0, w: this.map.width, h: this.map.height };
                    this.svg.setAttributeNS(null, 'viewBox', `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.w} ${this.viewBox.h}`);
                    this.isPanning = false;
                    this.startPoint = { x: 0, y: 0 };
                    this.endPoint = { x: 0, y: 0 };
                    this.scale = 1;
                    svgContainer.onwheel = (e) => {
                        e.preventDefault();
                        const w = this.viewBox.w;
                        const h = this.viewBox.h;
                        const rect = this.svg.getBoundingClientRect();
                        const mx = e.clientX - rect.left;
                        const my = e.clientY - rect.top;
                        const dh = -1 * (w * Math.sign(e.deltaY) * 0.1);
                        const dw = -1 * (h * Math.sign(e.deltaY) * 0.1);
                        const dx = dw * mx / this.map.width;
                        const dy = dh * my / this.map.height;
                        this.viewBox = { x: this.viewBox.x + dx, y: this.viewBox.y + dy, w: this.viewBox.w - dw, h: this.viewBox.h - dh };
                        this.scale = this.map.width / this.viewBox.w;
                        this.svg.setAttributeNS(null, 'viewBox', `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.w} ${this.viewBox.h}`);
                    };
                    svgContainer.onmousedown = (e) => {
                        this.isPanning = true;
                        this.startPoint = { x: e.x, y: e.y };
                        this.endPoint = { x: e.x, y: e.y };
                    };
                    svgContainer.onmousemove = (e) => {
                        if (this.isPanning) {
                            this.endPoint = { x: e.x, y: e.y };
                            const dx = (this.startPoint.x - this.endPoint.x) / this.scale;
                            const dy = (this.startPoint.y - this.endPoint.y) / this.scale;
                            const movedViewBox = { x: this.viewBox.x + dx, y: this.viewBox.y + dy, w: this.viewBox.w, h: this.viewBox.h };
                            this.svg.setAttributeNS(null, 'viewBox', `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`);
                        }
                    };
                    svgContainer.onmouseup = (e) => {
                        if (this.isPanning) {
                            this.endPoint = { x: e.x, y: e.y };
                            const dx = (this.startPoint.x - this.endPoint.x) / this.scale;
                            const dy = (this.startPoint.y - this.endPoint.y) / this.scale;
                            if (dx !== 0 || dy !== 0) {
                                this.viewBox = { x: this.viewBox.x + dx, y: this.viewBox.y + dy, w: this.viewBox.w, h: this.viewBox.h };
                                this.svg.setAttributeNS(null, 'viewBox', `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.w} ${this.viewBox.h}`);
                            }
                            this.isPanning = false;
                        }
                    };
                    svgContainer.onmouseleave = svgContainer.onmouseup;
                }
                drawPopup(x, y, index) {
                    // create a canvas to measure text, because SVG sucks at it
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    ctx.font = '13px visitor2';
                    const map = this.map;
                    const mapData = map.mapData;
                    const currentPos = mapData.getCoordinates(index);
                    const relativePos = mapData.getPositionRelativeToTown(currentPos);
                    let numberOfLines = 0;
                    // "Title" of the popup : building name & position
                    let title = 'Desert ';
                    let maxTextWidth = 0;
                    const buildingId = mapData.details[index]._c;
                    if (buildingId > 0 || buildingId === -1) {
                        if (buildingId === 1) {
                            title = mapData.townName + ' ';
                        }
                        else if (buildingId === -1) {
                            title = lang_3.HMapLang.get('undigged') + ' ';
                        }
                        else {
                            const buildingName = mapData.buildings.get(buildingId);
                            if (buildingName) {
                                title = buildingName + ' ';
                            }
                        }
                    }
                    title += '[ ' + relativePos.x + ' , ' + relativePos.y + ' ]';
                    maxTextWidth = ctx.measureText(title).width;
                    numberOfLines++;
                    // tags measurements
                    if (mapData.details[index]._t > 0 && map.displayTags) {
                        const tagName = lang_3.HMapLang.get(this.getTagName(mapData.details[index]._t));
                        maxTextWidth = Math.max(ctx.measureText(tagName).width, maxTextWidth);
                        numberOfLines++;
                    }
                    // danger measurements
                    let dangerName;
                    if (mapData.details[index]._z > 0) {
                        if (mapData.details[index]._z > 9) {
                            dangerName = lang_3.HMapLang.get('manyZombies');
                        }
                        else if (mapData.details[index]._z > 5) {
                            dangerName = lang_3.HMapLang.get('medZombies');
                        }
                        else {
                            dangerName = lang_3.HMapLang.get('fewZombies');
                        }
                        maxTextWidth = Math.max(ctx.measureText(dangerName).width, maxTextWidth);
                        numberOfLines++;
                    }
                    // build arrays with user name inside (each entry is a line of 3 users)
                    const users = mapData.users.get(index);
                    const usernamesAllLines = new Array();
                    if (users !== undefined && mapData.details[index]._c !== 1) {
                        let singleLine = new Array();
                        for (let u = 0; u < users.length; u++) {
                            const user = users[u];
                            singleLine.push(user._n);
                            if (u > 0 && (u + 1) % 3 === 0) { // % 3 = 3 users per line
                                const singleLineStr = singleLine.join(', ');
                                maxTextWidth = Math.max(ctx.measureText(singleLineStr).width, maxTextWidth);
                                usernamesAllLines.push(singleLineStr);
                                singleLine = new Array();
                                numberOfLines++;
                            }
                        }
                        if (singleLine.length > 0) { // last line
                            const singleLineStr = singleLine.join(', ');
                            maxTextWidth = Math.max(ctx.measureText(singleLineStr).width, maxTextWidth);
                            usernamesAllLines.push(singleLineStr);
                            numberOfLines++;
                        }
                    }
                    // start the drawing of the popup itself
                    const popupWidth = Math.floor(maxTextWidth + 10);
                    const popupHeight = 15 * numberOfLines;
                    const minWidthHeight = Math.min(map.width, map.height);
                    const xPopup = Math.floor(Math.min(Math.max(x - popupWidth / 2, 0), minWidthHeight - popupWidth));
                    const yPopup = Math.max(y - popupHeight, 0) | 0;
                    // draw the rect
                    const popup = this.rect(xPopup, yPopup, popupWidth, popupHeight, '#000000', '#b9ba3e', 1);
                    popup.setAttributeNS(null, 'fill-opacity', '0.6');
                    popup.setAttributeNS(null, 'class', 'hmap-popup');
                    popup.style.pointerEvents = 'none';
                    // draw the title
                    numberOfLines = 0; // restart the counting ...
                    const titleSize = ctx.measureText(title).width;
                    this.text(xPopup + popupWidth / 2 - titleSize / 2, yPopup + 7.5, title, 'hmap-text-green hmap-popup');
                    numberOfLines++;
                    // draw the tag
                    if (mapData.details[index]._t > 0 && map.displayTags) {
                        const tagName = lang_3.HMapLang.get(this.getTagName(mapData.details[index]._t));
                        const tagWidth = ctx.measureText(tagName).width;
                        this.text(xPopup + popupWidth / 2 - tagWidth / 2, yPopup + 7.5 + 15 * numberOfLines, tagName, 'hmap-text-green hmap-popup');
                        numberOfLines++;
                    }
                    // draw the danger line
                    if (dangerName !== undefined) {
                        const dangerWidth = ctx.measureText(dangerName).width;
                        const dangerText = this.text(xPopup + popupWidth / 2 - dangerWidth / 2, yPopup + 7.5 + 15 * numberOfLines, dangerName, 'hmap-text-yellow hmap-popup');
                        dangerText.style.fill = '#fefe00'; // overwrite the color
                        numberOfLines++;
                    }
                    // draw the usernames
                    usernamesAllLines.forEach((lineToWrite, _index) => {
                        const lineSize = ctx.measureText(lineToWrite).width;
                        const line = this.text(xPopup + popupWidth / 2 - lineSize / 2, yPopup + 7.5 + (_index + numberOfLines) * 15, lineToWrite, 'hmap-text-yellow hmap-popup');
                        line.style.fill = '#fefe00'; // overwrite the color
                    });
                    document.querySelectorAll('.hmap-popup').forEach((element) => {
                        element.style.zIndex = '11';
                    });
                }
                getTagName(tagIndex) {
                    switch (tagIndex) {
                        case 1:
                            return 'tag_1';
                        case 2:
                            return 'tag_2';
                        case 3:
                            return 'tag_3';
                        case 4:
                            return 'tag_4';
                        case 5:
                            return 'tag_5';
                        case 6:
                            return 'tag_6';
                        case 7:
                            return 'tag_7';
                        case 8:
                            return 'tag_8';
                        case 9:
                            return 'tag_9';
                        case 10:
                            return 'tag_10';
                        case 11:
                            return 'tag_11';
                        case 12:
                            return 'tag_12';
                        default:
                            throw new Error('HMapSVGGridLayer::getTagName - Wrong tag index');
                    }
                }
            };
            exports_16("HMapSVGGridLayer", HMapSVGGridLayer);
        }
    };
});
System.register("layers/svg-glass-static", ["layers/abstract"], function (exports_17, context_17) {
    "use strict";
    var abstract_8, HMapSVGGlassStaticLayer;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (abstract_8_1) {
                abstract_8 = abstract_8_1;
            }
        ],
        execute: function () {
            /**
             * This layer is independant to avoid beeing moved by the zoom/pan behavior
             * We won't reuse this for the other map since this is a bit overkill
             */
            HMapSVGGlassStaticLayer = class HMapSVGGlassStaticLayer extends abstract_8.AbstractHMapLayer {
                constructor(map) {
                    super(map);
                    const hmap = document.querySelector('#hmap');
                    if (document.querySelector('#svgGlassStatic') === null && hmap) {
                        const SVG = document.createElementNS(this.ns, 'svg');
                        SVG.setAttributeNS(null, 'id', 'svgGlassStatic');
                        SVG.setAttributeNS(null, 'style', 'position:absolute;z-index:3;');
                        hmap.appendChild(SVG);
                        SVG.style.pointerEvents = 'none';
                    }
                    this.svg = document.getElementById('svgGlassStatic');
                    this.svg.setAttributeNS(null, 'width', map.width + 'px');
                    this.svg.setAttributeNS(null, 'height', map.height + 'px');
                    this.svg.style.width = map.width + 'px';
                    this.svg.style.height = map.height + 'px';
                    this.type = 'glass-static';
                }
                draw() {
                    const oldGroup = this.g; // delete the group after drawing the new one to avoid flickering
                    this.g = document.createElementNS(this.ns, 'g');
                    this.img(this.map.imagesLoader.get('glass').src, 0, 0, 300, 300);
                    this.svg.appendChild(this.g);
                    if (oldGroup) {
                        this.svg.removeChild(oldGroup);
                    }
                }
            };
            exports_17("HMapSVGGlassStaticLayer", HMapSVGGlassStaticLayer);
        }
    };
});
System.register("maps/grid", ["toast", "maps/abstract", "layers/svg-grid", "environment", "lang", "layers/svg-loading", "layers/svg-glass-static", "data/hmap-desert-data"], function (exports_18, context_18) {
    "use strict";
    var toast_3, abstract_9, svg_grid_1, environment_3, lang_4, svg_loading_2, svg_glass_static_1, hmap_desert_data_1, HMapGridMap;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (toast_3_1) {
                toast_3 = toast_3_1;
            },
            function (abstract_9_1) {
                abstract_9 = abstract_9_1;
            },
            function (svg_grid_1_1) {
                svg_grid_1 = svg_grid_1_1;
            },
            function (environment_3_1) {
                environment_3 = environment_3_1;
            },
            function (lang_4_1) {
                lang_4 = lang_4_1;
            },
            function (svg_loading_2_1) {
                svg_loading_2 = svg_loading_2_1;
            },
            function (svg_glass_static_1_1) {
                svg_glass_static_1 = svg_glass_static_1_1;
            },
            function (hmap_desert_data_1_1) {
                hmap_desert_data_1 = hmap_desert_data_1_1;
            }
        ],
        execute: function () {
            HMapGridMap = class HMapGridMap extends abstract_9.HMapAbstractMap {
                constructor() {
                    super(...arguments);
                    this.mouseOverIndex = -1;
                    this.mode = 'personal';
                    this.displayTags = false;
                }
                generateMapData(payload) {
                    return new hmap_desert_data_1.HMapDesertData(payload);
                }
                get target() {
                    if (this.hmap.target) {
                        return this.hmap.target;
                    }
                    else if (this.mapData) {
                        return this.mapData.town;
                    }
                    else {
                        throw new Error('target and map data are not set');
                    }
                }
                /**
                 * Build the layers (SVG) for this map
                 */
                buildLayers() {
                    const swf = document.querySelector(this.hmap.cssSelector);
                    if (swf !== null) {
                        swf.setAttribute('style', 'display:flex;flex-direction:column;height:auto');
                        if (this.hmap.displayFlashMap === false) {
                            const originalMap = document.querySelector('#swfCont');
                            if (originalMap) {
                                originalMap.style.display = 'none';
                            }
                        }
                        if (document.querySelector('#hmap') === null) {
                            const hmap = document.createElement('div');
                            hmap.setAttribute('id', 'hmap');
                            hmap.setAttribute('style', 'width:' + this.width + 'px;height:' + this.height + 'px;position:relative');
                            swf.appendChild(hmap);
                            // create the menu
                            const hmapMenu = document.createElement('div');
                            hmapMenu.setAttribute('id', 'hmap-menu');
                            hmapMenu.setAttribute('style', 'position:absolute;bottom:0px;z-index:10;height:20px;display:none');
                            hmap.appendChild(hmapMenu);
                            // create the buttons
                            if (this.hmap.location === 'desert') { // we can switch the grid only in desert
                                const closeButton = document.createElement('div');
                                closeButton.setAttribute('id', 'hmap-close-button');
                                closeButton.setAttribute('class', 'hmap-button');
                                closeButton.innerHTML = lang_4.HMapLang.get('closebutton');
                                hmapMenu.appendChild(closeButton);
                                closeButton.onclick = this.onMapButtonClick.bind(this);
                            }
                            const displayTagsButton = document.createElement('div');
                            displayTagsButton.setAttribute('id', 'hmap-tags-button');
                            displayTagsButton.setAttribute('class', 'hmap-button');
                            hmapMenu.appendChild(displayTagsButton);
                            if (!this.displayTags) {
                                const uncheckIcon = document.createElement('img');
                                uncheckIcon.setAttribute('src', environment_3.Environment.getInstance().url + '/assets/uncheck.png');
                                uncheckIcon.style.marginRight = '3px';
                                displayTagsButton.appendChild(uncheckIcon);
                                displayTagsButton.append(lang_4.HMapLang.get('markersbutton'));
                            }
                            else {
                                const checkIcon = document.createElement('img');
                                checkIcon.setAttribute('src', environment_3.Environment.getInstance().url + '/assets/check.png');
                                checkIcon.style.marginRight = '3px';
                                displayTagsButton.appendChild(checkIcon);
                                displayTagsButton.append(lang_4.HMapLang.get('markersbutton'));
                                displayTagsButton.style.background = '#696486'; // blue night
                            }
                            displayTagsButton.onclick = this.toggleDisplayTags.bind(this);
                            const modeButton = document.createElement('div');
                            modeButton.setAttribute('id', 'hmap-mode-button');
                            modeButton.setAttribute('class', 'hmap-button');
                            hmapMenu.appendChild(modeButton);
                            if (this.mode !== 'global') {
                                const uncheckIcon = document.createElement('img');
                                uncheckIcon.setAttribute('src', environment_3.Environment.getInstance().url + '/assets/uncheck.png');
                                uncheckIcon.style.marginRight = '3px';
                                modeButton.appendChild(uncheckIcon);
                                modeButton.append(lang_4.HMapLang.get('modebutton'));
                            }
                            else {
                                const checkIcon = document.createElement('img');
                                checkIcon.setAttribute('src', environment_3.Environment.getInstance().url + '/assets/check.png');
                                checkIcon.style.marginRight = '3px';
                                modeButton.appendChild(checkIcon);
                                modeButton.append(lang_4.HMapLang.get('modebutton'));
                                modeButton.style.background = '#696486'; // blue night
                            }
                            modeButton.onclick = this.switchMode.bind(this);
                            const resetViewButton = document.createElement('div');
                            resetViewButton.setAttribute('id', 'hmap-reset-button');
                            resetViewButton.setAttribute('class', 'hmap-button');
                            resetViewButton.innerHTML = lang_4.HMapLang.get('resetbutton');
                            hmapMenu.appendChild(resetViewButton);
                            resetViewButton.onclick = this.onResetButtonClick.bind(this);
                            const debugButton = document.createElement('div');
                            debugButton.setAttribute('id', 'hmap-debug-button');
                            debugButton.setAttribute('class', 'hmap-button');
                            debugButton.innerHTML = lang_4.HMapLang.get('debugbutton');
                            hmapMenu.appendChild(debugButton);
                            debugButton.onclick = this.onDebugButtonClick.bind(this);
                            // style the buttons
                            const buttons = document.querySelectorAll('.hmap-button');
                            buttons.forEach((el) => {
                                el.onmouseleave = (e) => {
                                    e.target.style.outline = '0px';
                                };
                                el.onmouseenter = (e) => {
                                    e.target.style.outline = '1px solid #eccb94';
                                };
                            });
                            hmapMenu.style.display = 'none';
                        }
                        const GridLayer = new svg_grid_1.HMapSVGGridLayer(this);
                        this.layers.set('grid', GridLayer);
                        const GlassStatic = new svg_glass_static_1.HMapSVGGlassStaticLayer(this);
                        this.layers.set('glass-static', GlassStatic);
                        const LoadingLayer = new svg_loading_2.HMapSVGLoadingLayer(this);
                        this.layers.set('loading', LoadingLayer);
                    }
                }
                /**
                 * Action to execute when new data arrive
                 */
                onDataReceived(init) {
                    // when preloading the pictures is finished, starts drawing
                    this.imagesLoader
                        .preloadPictures(this.layers.get('loading'), init, () => {
                        const hmapMenu = document.querySelector('#hmap-menu');
                        if (hmapMenu !== null) {
                            hmapMenu.style.display = 'flex';
                        }
                        const loadingLayer = this.layers.get('loading');
                        loadingLayer.hide();
                        this.layers.get('grid').draw();
                        this.layers.get('glass-static').draw();
                    });
                }
                /**
                 * Set the target of the grid
                 */
                setTarget(index) {
                    // set the target for the pointing arrow
                    if (this.hmap.location === 'desert' || this.hmap.location === 'doors') {
                        this.hmap.target = index;
                    }
                }
                /**
                 * Close the grid and show the desert
                 */
                onMapButtonClick() {
                    this.hmap.switchMapAndReload('desert');
                }
                /**
                 * Copy the mapData to clipboard
                 */
                onDebugButtonClick() {
                    const el = document.createElement('textarea');
                    el.value = this.mapData.prettyData;
                    console.log(this.mapData.data);
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                    toast_3.Toast.show(lang_4.HMapLang.get('toastdebug'));
                }
                onResetButtonClick() {
                    const layer = this.layers.get('grid');
                    layer.resetView();
                }
                toggleDisplayTags() {
                    const hmapTagButton = document.querySelector('#hmap-tags-button');
                    while (hmapTagButton.lastChild) {
                        hmapTagButton.removeChild(hmapTagButton.lastChild);
                    }
                    if (this.displayTags) {
                        this.displayTags = false;
                        const uncheckIcon = document.createElement('img');
                        uncheckIcon.setAttribute('src', environment_3.Environment.getInstance().url + '/assets/uncheck.png');
                        uncheckIcon.style.marginRight = '3px';
                        hmapTagButton.appendChild(uncheckIcon);
                        hmapTagButton.append(lang_4.HMapLang.get('markersbutton'));
                        hmapTagButton.style.background = '#a13119'; // orange
                    }
                    else {
                        this.displayTags = true;
                        const checkIcon = document.createElement('img');
                        checkIcon.setAttribute('src', environment_3.Environment.getInstance().url + '/assets/check.png');
                        checkIcon.style.marginRight = '3px';
                        hmapTagButton.appendChild(checkIcon);
                        hmapTagButton.append(lang_4.HMapLang.get('markersbutton'));
                        hmapTagButton.style.background = '#696486'; // blue night
                    }
                    const layer = this.layers.get('grid');
                    layer.draw();
                }
                /**
                 * Switch from global mode to personnal mode
                 * Called on click on mode button
                 */
                switchMode() {
                    const hmapModeButton = document.querySelector('#hmap-mode-button');
                    if (this.mode === 'global') {
                        this.mode = 'personal';
                        if (hmapModeButton !== null) {
                            while (hmapModeButton.lastChild) {
                                hmapModeButton.removeChild(hmapModeButton.lastChild);
                            }
                            const uncheckIcon = document.createElement('img');
                            uncheckIcon.setAttribute('src', environment_3.Environment.getInstance().url + '/assets/uncheck.png');
                            uncheckIcon.style.marginRight = '3px';
                            hmapModeButton.appendChild(uncheckIcon);
                            hmapModeButton.append(lang_4.HMapLang.get('modebutton'));
                            hmapModeButton.style.background = '#a13119'; // orange
                        }
                    }
                    else {
                        this.mode = 'global';
                        if (hmapModeButton !== null) {
                            while (hmapModeButton.lastChild) {
                                hmapModeButton.removeChild(hmapModeButton.lastChild);
                            }
                            const checkIcon = document.createElement('img');
                            checkIcon.setAttribute('src', environment_3.Environment.getInstance().url + '/assets/check.png');
                            checkIcon.style.marginRight = '3px';
                            hmapModeButton.appendChild(checkIcon);
                            hmapModeButton.append(lang_4.HMapLang.get('modebutton'));
                            hmapModeButton.style.background = '#696486'; // blue night
                        }
                    }
                    if (this.layers.get('grid')) {
                        this.layers.get('grid').draw();
                    }
                }
            };
            exports_18("HMapGridMap", HMapGridMap);
        }
    };
});
System.register("layers/svg-desert-background", ["layers/abstract", "random"], function (exports_19, context_19) {
    "use strict";
    var abstract_10, random_7, HMapSVGDesertBackgroundLayer;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (abstract_10_1) {
                abstract_10 = abstract_10_1;
            },
            function (random_7_1) {
                random_7 = random_7_1;
            }
        ],
        execute: function () {
            HMapSVGDesertBackgroundLayer = class HMapSVGDesertBackgroundLayer extends abstract_10.AbstractHMapLayer {
                constructor(map) {
                    super(map);
                    this.translation = { x: 0, y: 0 }; // translation really applied
                    this.parallax = { x: 0, y: 0 }; // parallax effect
                    this.translateTo = { x: 0, y: 0 }; // target (translation to achieve after easing)
                    const hmap = document.querySelector('#hmap');
                    if (document.querySelector('#svgDesertBackground') === null && hmap) {
                        const SVG = document.createElementNS(this.ns, 'svg');
                        SVG.setAttributeNS(null, 'id', 'svgDesertBackground');
                        SVG.setAttributeNS(null, 'style', 'position:absolute;z-index:2;');
                        hmap.appendChild(SVG);
                    }
                    this.svg = document.getElementById('svgDesertBackground');
                    this.svg.setAttributeNS(null, 'width', map.width + 'px');
                    this.svg.setAttributeNS(null, 'height', map.height + 'px');
                    this.svg.style.width = map.width + 'px';
                    this.svg.style.height = map.height + 'px';
                    this.type = 'desert-background';
                }
                onMouseMove(e) {
                    if (this.translateTo.x !== 0 || this.translateTo.y !== 0 || !this.g) {
                        return;
                    }
                    const rect = this.svg.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;
                    const centerX = 150;
                    const centerY = 150;
                    this.parallax.x = Math.floor(-1 * (centerX - mouseX) / 10);
                    this.parallax.y = Math.floor(-1 * (centerY - mouseY) / 10);
                    this.translation.x = this.parallax.x;
                    this.translation.y = this.parallax.y;
                    this.g.setAttributeNS(null, 'transform', 'translate(' + -1 * this.translation.x + ' ' + -1 * this.translation.y + ')');
                }
                onMouseLeave(e) {
                    const rect = this.svg.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;
                    if (mouseX < 1 || mouseY < 1 || mouseX >= this.map.width * 0.98 || mouseY >= this.map.height * 0.98) { // if the mouse is outside
                        this.parallax.x = 0;
                        this.parallax.y = 0;
                        this.translation = { x: 0, y: 0 };
                        this.g.setAttributeNS(null, 'transform', 'translate(' + -1 * this.translation.x + ' ' + -1 * this.translation.y + ')');
                    }
                }
                easeMovement(target, callback) {
                    this.startTranslate = Date.now();
                    this.translateTo = target;
                    if (!this.intervalEasing) {
                        this.intervalEasing = window.setInterval(() => {
                            // translation effect when we click on an arrow
                            let coef = 1; // this will be increasing from 0 to 1
                            if (this.startTranslate) {
                                const p = (Date.now() - this.startTranslate) / 300; // 300ms
                                coef = p >= 1 ? 1 : 1 - Math.pow(2, -10 * p); // exp easing
                            }
                            else {
                                throw new Error('Cannot ease without starting the translation');
                            }
                            const translateX = this.translateTo.x + this.parallax.x;
                            const translateY = this.translateTo.y + this.parallax.y;
                            this.translation.x = translateX * coef;
                            this.translation.y = translateY * coef;
                            this.g.setAttributeNS(null, 'transform', 'translate(' + -1 * this.translation.x + ' ' + -1 * this.translation.y + ')');
                            if (coef >= 1) { // the motion is over, reset the variables
                                this.startTranslate = undefined;
                                this.translateTo = { x: 0, y: 0 };
                                clearInterval(this.intervalEasing);
                                this.intervalEasing = undefined;
                                callback();
                                // no need to reset the translation, it will be done by the draw function
                                return;
                            }
                        }, 40);
                    }
                }
                draw() {
                    const oldGroup = this.g;
                    this.g = document.createElementNS(this.ns, 'g');
                    const map = this.map;
                    const mapData = this.map.mapData;
                    const imagesLoader = this.map.imagesLoader;
                    const seed = mapData.zoneId;
                    const random = new random_7.HMapRandom(seed);
                    const neighbours = mapData.neighbours;
                    const center = { x: map.width / 2, y: map.height / 2 };
                    const position = mapData.position;
                    const numberOfHumans = mapData.numberOfHumans;
                    const numberOfZombies = mapData.numberOfZombies;
                    // first thing first, the background
                    this.img(imagesLoader.get('map').src, -100 * (position.x % 6) - 25, -100 * (position.y % 6) - 25, 950, 950);
                    // buildings
                    neighbours.neighbours.forEach((neighbour) => {
                        if (neighbour.building !== 0 && neighbour.building !== null) {
                            const building = this.img(imagesLoader.get('b' + neighbour.building).src, neighbour.offsetX, neighbour.offsetY, 100, 100);
                            building.setAttributeNS(null, 'hmap-bid', neighbour.building + '');
                            building.setAttributeNS(null, 'hmap-x', neighbour.offsetX + '');
                            building.setAttributeNS(null, 'hmap-y', neighbour.offsetY + '');
                            building.style.pointerEvents = 'auto';
                            building.onmouseenter = this.showPopupBuilding.bind(this);
                            building.onmouseleave = this.hidePopupBuilding.bind(this);
                        }
                    });
                    // night filter
                    if (mapData.hour < 7 || mapData.hour > 18) {
                        this.img(imagesLoader.get('night').src, -25, -25, 950, 950);
                    }
                    // humans
                    this.img(imagesLoader.get('humanGlow').src, 141, 141, 18, 18); // you
                    for (let k = 1; k <= numberOfHumans - 1; k++) { // others
                        const newPosH = random.randomCircle(center, Math.floor(random.random() * 30) + 5);
                        this.img(imagesLoader.get('humanGlow').src, newPosH.x, newPosH.y, 18, 18);
                    }
                    // zombies
                    for (let n = 1; n <= numberOfZombies; n++) {
                        const newPosZ = random.randomCircle(center, Math.floor(random.random() * 40) + 5);
                        this.img(imagesLoader.get('zombieGlow').src, newPosZ.x, newPosZ.y, 18, 18);
                    }
                    // fog of war
                    for (let i = mapData.position.x - 2; i < mapData.position.x + 3; i++) {
                        for (let j = mapData.position.y - 2; j < mapData.position.y + 3; j++) {
                            const point = { x: i, y: j };
                            if (!mapData.inBounds(point) || !mapData.isPositionDiscovered(point)) {
                                let oX = 0, oY = 0;
                                if (j - mapData.position.y === 0 && i > mapData.position.x) {
                                    oX = 15;
                                }
                                else if (j - mapData.position.y === 0 && i < mapData.position.x) {
                                    oX = -15;
                                }
                                else if (i - mapData.position.x === 0 && j > mapData.position.y) {
                                    oY = 15;
                                }
                                else if (i - mapData.position.x === 0 && j < mapData.position.y) {
                                    oY = -15;
                                }
                                const offsetX = (i - mapData.position.x + 1) * 100;
                                const offsetY = (j - mapData.position.y + 1) * 100;
                                if (!(offsetX === 100 && offsetY === 100)) {
                                    this.img(imagesLoader.get('single').src, offsetX - 50 + oX, offsetY - 50 + oY, 200, 200);
                                }
                            }
                        }
                    }
                    this.translation.x = this.parallax.x;
                    this.translation.y = this.parallax.y;
                    this.g.setAttributeNS(null, 'transform', 'translate(' + -1 * this.translation.x + ' ' + -1 * this.translation.y + ')');
                    this.svg.appendChild(this.g);
                    if (oldGroup) {
                        window.setTimeout(() => this.svg.removeChild(oldGroup), 300); // avoid flickering by deleting former group 300ms after
                    }
                }
                /**
                 * Display the popup on building roll over
                 */
                showPopupBuilding(e) {
                    // create a canvas to measure text, because SVG sucks at it
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    ctx.font = '13px visitor2';
                    const target = e.target;
                    const buildingId = +target.getAttributeNS(null, 'hmap-bid');
                    const map = this.map;
                    const mapData = map.mapData;
                    const buildingName = (buildingId === 1) ? mapData.townName : mapData.buildings.get(buildingId);
                    const textWidth = ctx.measureText(buildingName).width;
                    const x = +target.getAttributeNS(null, 'hmap-x') + 50;
                    const y = +target.getAttributeNS(null, 'hmap-y') + 85;
                    // start the drawing of the popup itself
                    const popupWidth = Math.floor(textWidth + 10);
                    const popupHeight = 16;
                    const minWidthHeight = Math.min(map.width, map.height);
                    const xPopup = Math.floor(Math.min(Math.max(x - popupWidth / 2, 0), minWidthHeight - popupWidth));
                    const yPopup = Math.max(y - popupHeight, 0) | 0;
                    // draw the rect
                    const popup = this.rect(xPopup, yPopup, popupWidth, popupHeight, '#000000', '#b9ba3e', 1);
                    popup.setAttributeNS(null, 'fill-opacity', '0.6');
                    popup.setAttributeNS(null, 'class', 'hmap-popup');
                    popup.style.pointerEvents = 'none';
                    // draw the text
                    this.text(xPopup + popupWidth / 2 - textWidth / 2, yPopup + 8, buildingName, 'hmap-text-green hmap-popup');
                    document.querySelectorAll('.hmap-popup').forEach((element) => {
                        element.style.zIndex = '11';
                    });
                }
                hidePopupBuilding(e) {
                    document.querySelectorAll('.hmap-popup').forEach((element) => {
                        element.remove();
                    });
                }
            };
            exports_19("HMapSVGDesertBackgroundLayer", HMapSVGDesertBackgroundLayer);
        }
    };
});
System.register("layers/svg-desert-foreground", ["layers/abstract", "lang"], function (exports_20, context_20) {
    "use strict";
    var abstract_11, lang_5, HMapSVGDesertForegroundLayer;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [
            function (abstract_11_1) {
                abstract_11 = abstract_11_1;
            },
            function (lang_5_1) {
                lang_5 = lang_5_1;
            }
        ],
        execute: function () {
            HMapSVGDesertForegroundLayer = class HMapSVGDesertForegroundLayer extends abstract_11.AbstractHMapLayer {
                constructor(map) {
                    super(map);
                    const hmap = document.querySelector('#hmap');
                    if (document.querySelector('#svgDesertForeground') === null && hmap) {
                        const SVG = document.createElementNS(this.ns, 'svg');
                        SVG.setAttributeNS(null, 'id', 'svgDesertForeground');
                        SVG.setAttributeNS(null, 'style', 'position:absolute;z-index:3;');
                        hmap.appendChild(SVG);
                    }
                    this.svg = document.getElementById('svgDesertForeground');
                    this.svg.setAttributeNS(null, 'width', map.width + 'px');
                    this.svg.setAttributeNS(null, 'height', map.height + 'px');
                    this.svg.style.width = map.width + 'px';
                    this.svg.style.height = map.height + 'px';
                    this.svg.style.pointerEvents = 'none';
                    this.type = 'desert-foreground';
                }
                draw() {
                    const oldGroup = this.g;
                    this.g = document.createElementNS(this.ns, 'g');
                    const map = this.map;
                    const mapData = this.map.mapData;
                    const imagesLoader = this.map.imagesLoader;
                    // focus lens shadow (433x433)
                    this.img(imagesLoader.get('shadowFocus').src, (map.width - 433) / 2, (map.height - 433) / 2, 433, 433);
                    // arrow pointing toward target
                    if (mapData.position.x !== map.target.x || mapData.position.y !== map.target.y) {
                        const targetAngle = Math.atan2(map.target.y - mapData.position.y, map.target.x - mapData.position.x);
                        this.positionTargetArrow(targetAngle);
                    }
                    // Destination
                    if (mapData.position.x === map.target.x && mapData.position.y === map.target.y) {
                        this.img(imagesLoader.get('destination').src, 150 - 6, 150 - 6, 12, 12);
                    }
                    // blood
                    if (!mapData.hasControl) {
                        this.img(imagesLoader.get('blood').src, 0, 0, 300, 300);
                    }
                    this.img(map.imagesLoader.get('glass').src, 0, 0, 300, 300); // image is 300x300
                    // position text
                    const relativePos = mapData.getPositionRelativeToTown(mapData.position);
                    const positionText = lang_5.HMapLang.get('position') + ' : ' + (relativePos.x) + ' / ' + (relativePos.y);
                    const positionTextElement = this.text(map.width - 10, map.height - 25, positionText, 'hmap-text-green');
                    positionTextElement.setAttributeNS(null, 'text-anchor', 'end');
                    positionTextElement.style.fontSize = '14px';
                    // arrows
                    for (let i = 0, j = map.registredArrows.length; i < j; i++) {
                        const arrow = map.registredArrows[i];
                        const arrowImg = this.img(imagesLoader.get('moveArrowLight').src, arrow.ax, arrow.ay, 82, 27, arrow.a);
                        arrowImg.style.pointerEvents = 'auto';
                        arrowImg.style.cursor = 'pointer';
                        this.img(imagesLoader.get('moveArrowOutline').src, arrow.ax, arrow.ay, 83, 28, arrow.a);
                        arrowImg.onmouseenter = () => {
                            const arrowFill = this.img(imagesLoader.get('moveArrowLight').src, arrow.ax, arrow.ay, 83, 28, arrow.a);
                            arrowFill.setAttributeNS(null, 'class', 'hmap-arrowFill');
                        };
                        arrowImg.onmouseleave = () => {
                            document.querySelectorAll('.hmap-arrowFill').forEach((element) => {
                                element.remove();
                            });
                        };
                        arrowImg.onclick = () => {
                            this.map.move(arrow.t);
                        };
                    }
                    // scout class
                    if (mapData.scoutArray && mapData.scoutArray.length === 4) {
                        if (mapData.neighbours.neighbours.get('top_center').outbounds === false) {
                            this.text(148, 30, '' + mapData.scoutArray[0], 'hmap-text-green');
                        }
                        if (mapData.neighbours.neighbours.get('middle_right').outbounds === false) {
                            this.text(270, 150, '' + mapData.scoutArray[1], 'hmap-text-green');
                        }
                        if (mapData.neighbours.neighbours.get('bottom_center').outbounds === false) {
                            this.text(148, 270, '' + mapData.scoutArray[2], 'hmap-text-green');
                        }
                        if (mapData.neighbours.neighbours.get('middle_left').outbounds === false) {
                            this.text(30, 150, '' + mapData.scoutArray[3], 'hmap-text-green');
                        }
                    }
                    this.svg.appendChild(this.g);
                    if (oldGroup) {
                        window.setTimeout(() => this.svg.removeChild(oldGroup), 10);
                    }
                }
                /**
                 * Draw the small green arrow pointing toward the target
                 * The angle is not calculated here
                 * @param angle angle precalculated
                 */
                positionTargetArrow(angle) {
                    let originX = this.map.width / 2 - 4;
                    let originY = this.map.height / 2 - 8;
                    originX += 120 * Math.cos(angle);
                    originY += 120 * Math.sin(angle);
                    this.img(this.map.imagesLoader.get('targetArrow').src, originX, originY, 9, 17, angle * 180 / Math.PI);
                }
            };
            exports_20("HMapSVGDesertForegroundLayer", HMapSVGDesertForegroundLayer);
        }
    };
});
System.register("maps/desert", ["arrow", "toast", "environment", "lang", "maps/abstract", "layers/svg-desert-background", "layers/svg-loading", "layers/svg-desert-foreground", "data/hmap-desert-data"], function (exports_21, context_21) {
    "use strict";
    var arrow_2, toast_4, environment_4, lang_6, abstract_12, svg_desert_background_1, svg_loading_3, svg_desert_foreground_1, hmap_desert_data_2, HMapDesertMap;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [
            function (arrow_2_1) {
                arrow_2 = arrow_2_1;
            },
            function (toast_4_1) {
                toast_4 = toast_4_1;
            },
            function (environment_4_1) {
                environment_4 = environment_4_1;
            },
            function (lang_6_1) {
                lang_6 = lang_6_1;
            },
            function (abstract_12_1) {
                abstract_12 = abstract_12_1;
            },
            function (svg_desert_background_1_1) {
                svg_desert_background_1 = svg_desert_background_1_1;
            },
            function (svg_loading_3_1) {
                svg_loading_3 = svg_loading_3_1;
            },
            function (svg_desert_foreground_1_1) {
                svg_desert_foreground_1 = svg_desert_foreground_1_1;
            },
            function (hmap_desert_data_2_1) {
                hmap_desert_data_2 = hmap_desert_data_2_1;
            }
        ],
        execute: function () {
            HMapDesertMap = class HMapDesertMap extends abstract_12.HMapAbstractMap {
                constructor() {
                    super(...arguments);
                    this.registredArrows = new Array();
                    this.moving = false; // dirty boolean to avoid double move
                }
                generateMapData(payload) {
                    return new hmap_desert_data_2.HMapDesertData(payload);
                }
                get target() {
                    if (this.hmap.target) {
                        return this.hmap.target;
                    }
                    else if (this.mapData) {
                        return this.mapData.town;
                    }
                    else {
                        throw new Error('target and map data are not set');
                    }
                }
                /**
                 * Append the HTML
                 */
                buildLayers() {
                    // inject some HTML to make room for the map
                    const swf = document.querySelector(this.hmap.cssSelector);
                    if (swf !== null) {
                        swf.setAttribute('style', 'display:flex;flex-direction:column;height:auto');
                        if (this.hmap.displayFlashMap === false) {
                            const originalMap = document.querySelector('#swfCont');
                            if (originalMap) {
                                originalMap.style.display = 'none';
                            }
                        }
                        if (document.querySelector('#hmap') === null) {
                            const hmap = document.createElement('div');
                            hmap.setAttribute('id', 'hmap');
                            hmap.setAttribute('style', 'width:' + this.width + 'px;height:' + this.height + 'px;position:relative');
                            swf.appendChild(hmap);
                            // create the menu
                            const hmapMenu = document.createElement('div');
                            hmapMenu.setAttribute('id', 'hmap-menu');
                            hmapMenu.setAttribute('style', 'position:absolute;bottom:0px;z-index:10;height:20px;display:none');
                            hmap.appendChild(hmapMenu);
                            const mapButton = document.createElement('div');
                            mapButton.setAttribute('id', 'hmap-minimap-button');
                            mapButton.setAttribute('class', 'hmap-button');
                            hmapMenu.appendChild(mapButton);
                            mapButton.onclick = this.onMapButtonClick.bind(this);
                            const mapIcon = document.createElement('img');
                            mapIcon.setAttribute('id', 'hmap-minimap-icon');
                            mapIcon.setAttribute('src', environment_4.Environment.getInstance().url + '/assets/minimap.png');
                            mapButton.appendChild(mapIcon);
                            mapButton.append(lang_6.HMapLang.get('mapbutton'));
                            mapButton.style.marginRight = '3px';
                            const debugButton = document.createElement('div');
                            debugButton.setAttribute('id', 'hmap-debug-button');
                            debugButton.setAttribute('class', 'hmap-button');
                            debugButton.innerHTML = lang_6.HMapLang.get('debugbutton');
                            hmapMenu.appendChild(debugButton);
                            debugButton.onclick = this.onDebugButtonClick.bind(this);
                            // style the buttons
                            const buttons = document.querySelectorAll('.hmap-button');
                            buttons.forEach((el) => {
                                el.onmouseleave = (e) => {
                                    e.target.style.outline = '0px';
                                };
                                el.onmouseenter = (e) => {
                                    e.target.style.outline = '1px solid #eccb94';
                                };
                            });
                            hmapMenu.style.display = 'none';
                            hmap.onmousemove = this.onMouseMove.bind(this);
                            hmap.onmouseleave = this.onMouseLeave.bind(this);
                        }
                    }
                    const backgroundLayer = new svg_desert_background_1.HMapSVGDesertBackgroundLayer(this);
                    this.layers.set('desert-background', backgroundLayer);
                    const foregroundLayer = new svg_desert_foreground_1.HMapSVGDesertForegroundLayer(this);
                    this.layers.set('desert-foreground', foregroundLayer);
                    const LoadingLayer = new svg_loading_3.HMapSVGLoadingLayer(this);
                    this.layers.set('loading', LoadingLayer);
                }
                onMouseMove(e) {
                    const layerBackground = this.layers.get('desert-background');
                    layerBackground.onMouseMove(e);
                }
                onMouseLeave(e) {
                    const layerBackground = this.layers.get('desert-background');
                    layerBackground.onMouseLeave(e);
                }
                /**
                 * When new data arrive, rebuild the arrows
                 */
                onDataReceived(init) {
                    this.registerArrows();
                    const mapData = this.mapData;
                    this.imagesLoader.registerBuildingsToPreload(mapData.neighbours);
                    // when preloading the pictures is finished, starts drawing
                    this.imagesLoader
                        .preloadPictures(this.layers.get('loading'), init, () => {
                        const hmapMenu = document.querySelector('#hmap-menu');
                        if (hmapMenu !== null) {
                            hmapMenu.style.display = 'flex';
                        }
                        const loadingLayer = this.layers.get('loading');
                        loadingLayer.hide();
                        this.layers.get('desert-background').draw();
                        this.layers.get('desert-foreground').draw();
                    });
                }
                /**
                 * Function called when the user click on a directionnal arrow
                 * The function is big due to the debug mode
                 */
                move(direction) {
                    const mapData = this.mapData;
                    // since the move is happening in a setTimeout, we have to do this boolean trick to avoid double move
                    if (this.moving === true) {
                        return;
                    }
                    this.moving = true;
                    let x, y;
                    if (direction === 'right') {
                        x = 1;
                        y = 0;
                    }
                    else if (direction === 'left') {
                        x = -1;
                        y = 0;
                    }
                    else if (direction === 'top') {
                        x = 0;
                        y = -1;
                    }
                    else {
                        x = 0;
                        y = 1;
                    }
                    const bgLayer = this.layers.get('desert-background');
                    if (environment_4.Environment.getInstance().devMode === false) {
                        const url = 'outside/go?x=' + x + ';y=' + y + ';z=' + mapData.zoneId + js.JsMap.sh;
                        let hx;
                        // @ts-ignore
                        const page = window.wrappedJSObject;
                        if (page !== undefined && page.haxe) { // greasemonkey ...
                            hx = page.haxe;
                        }
                        else if (haxe) { // tampermonkey
                            hx = haxe;
                        }
                        const r = new hx.Http('/' + url);
                        js.XmlHttp.onStart(r);
                        js.XmlHttp.urlForBack = url;
                        r.setHeader('X-Handler', 'js.XmlHttp');
                        r.onData = (data) => {
                            this.hmap.originalOnData(data); // we are sure the function has been set
                            bgLayer.easeMovement({ x: 100 * x, y: 100 * y }, () => {
                                // move the position
                                mapData.movePosition(x, y);
                                if (data.indexOf('js.JsMap.init') !== -1) {
                                    const startVar = data.indexOf('js.JsMap.init') + 16;
                                    const stopVar = data.indexOf('\',', startVar);
                                    const tempMapData = data.substring(startVar, stopVar);
                                    this.partialDataReceived({ raw: tempMapData });
                                }
                                this.moving = false; // allow another move
                            });
                        };
                        r.onError = js.XmlHttp.onError;
                        r.request(false);
                    }
                    else { // dev mode, fake the data
                        // variables to manage the start effect
                        bgLayer.easeMovement({ x: 100 * x, y: 100 * y }, () => {
                            // move the position
                            mapData.movePosition(x, y);
                            const newIndex = mapData.index;
                            // fake the move with already known data
                            const fakeData = {
                                _neigDrops: [],
                                _neig: new Array(),
                                _state: false,
                                _c: (this.mapData.data._details[newIndex]._c) ? this.mapData.data._details[newIndex]._c : 0,
                                _h: 0,
                                _m: 6,
                                _t: 0,
                                _z: (this.mapData.data._details[newIndex]._z) ? this.mapData.data._details[newIndex]._z : 0,
                                _zid: 42424545
                            };
                            if (newIndex - mapData.size.height > 0) {
                                fakeData._neig.push(this.mapData.data._details[newIndex - mapData.size.height]._z);
                            }
                            else {
                                fakeData._neig.push(0);
                            }
                            if (newIndex + 1 < (mapData.size.width * mapData.size.height)) {
                                fakeData._neig.push(this.mapData.data._details[newIndex + 1]._z);
                            }
                            else {
                                fakeData._neig.push(0);
                            }
                            if (newIndex + mapData.size.height < (mapData.size.height * mapData.size.height)) {
                                fakeData._neig.push(this.mapData.data._details[newIndex + mapData.size.height]._z);
                            }
                            else {
                                fakeData._neig.push(0);
                            }
                            if (newIndex - 1 > 0) {
                                fakeData._neig.push(this.mapData.data._details[newIndex - 1]._z);
                            }
                            else {
                                fakeData._neig.push(0);
                            }
                            this.partialDataReceived({ JSON: fakeData });
                            this.moving = false; // allow another move
                        });
                    }
                }
                /**
                 * The click on the map button will switch the map from desert to grid
                 */
                onMapButtonClick() {
                    this.hmap.switchMapAndReload('grid');
                }
                /**
                 * The click on the debug button will copy the data to the clipboard
                 */
                onDebugButtonClick() {
                    const el = document.createElement('textarea');
                    el.value = this.mapData.prettyData;
                    console.log(this.mapData.data);
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                    toast_4.Toast.show(lang_6.HMapLang.get('toastdebug'));
                }
                /**
                 * Register the available directionnal arrows
                 */
                registerArrows() {
                    this.registredArrows = new Array();
                    if (this.mapData) {
                        const mapData = this.mapData;
                        if (mapData.actionPoints > 0) { // if we can move
                            mapData.neighbours.neighbours.forEach((neighbour) => {
                                let offsetY, offsetX;
                                if (neighbour.outbounds === false) { // not on the edge of the map
                                    if (neighbour.position === 'top_center') {
                                        offsetY = 15;
                                        offsetX = -41 + 150;
                                        const A = new arrow_2.HMapArrow(offsetX, offsetY, offsetX, offsetY, 83, 28, 'top', 0, false);
                                        this.registredArrows.push(A);
                                    }
                                    else if (neighbour.position === 'bottom_center') {
                                        offsetY = 250;
                                        offsetX = -41 + 150;
                                        const A = new arrow_2.HMapArrow(offsetX, offsetY, offsetX, offsetY, 83, 28, 'bottom', 180, false);
                                        this.registredArrows.push(A);
                                    }
                                    else if (neighbour.position === 'middle_right') {
                                        offsetX = 230;
                                        offsetY = -14 + 150;
                                        const A = new arrow_2.HMapArrow(offsetX, offsetY, offsetX + 27, offsetY - 27, 28, 83, 'right', 90, false);
                                        this.registredArrows.push(A);
                                    }
                                    else if (neighbour.position === 'middle_left') {
                                        offsetX = -10;
                                        offsetY = -14 + 150;
                                        const A = new arrow_2.HMapArrow(offsetX, offsetY, offsetX + 27, offsetY - 27, 28, 83, 'left', 270, false);
                                        this.registredArrows.push(A);
                                    }
                                }
                            });
                        }
                    }
                }
            };
            exports_21("HMapDesertMap", HMapDesertMap);
        }
    };
});
System.register("maps/abstract", ["imagesLoader"], function (exports_22, context_22) {
    "use strict";
    var imagesLoader_1, HMapAbstractMap;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (imagesLoader_1_1) {
                imagesLoader_1 = imagesLoader_1_1;
            }
        ],
        execute: function () {
            /**
             * The maps will be the components that will host all the HTML and the logic of the map itself
             * They are split into layers, and each layer is a SVG with its own behavior
             */
            HMapAbstractMap = class HMapAbstractMap {
                constructor(hmap) {
                    this.layers = new Map();
                    this.imagesLoader = imagesLoader_1.HMapImagesLoader.getInstance();
                    this.hmap = hmap;
                }
                get height() {
                    return this.hmap.height;
                }
                get width() {
                    return this.hmap.width;
                }
                /**
                 * Called when the map data has been set or totally modified
                 * This is the intialization function
                 */
                completeDataReceived(mapDataPayload) {
                    console.log('complete data');
                    this.mapData = this.generateMapData(mapDataPayload);
                    const loading = new Image();
                    loading.src = this.imagesLoader.get('loading').src;
                    loading.onload = () => {
                        const loadingLayer = this.layers.get('loading');
                        if (loadingLayer) { // if there is a layer (can happen in debug mode)
                            loadingLayer.draw();
                        }
                        this.onDataReceived(true); // custom implementation, map by map
                    };
                }
                /**
                 * Called when a small part of the mapData has been updated
                 */
                partialDataReceived(tempMapData) {
                    // patch the store with new data
                    this.mapData.patchData(tempMapData);
                    // the position has changed, the arrows may be different
                    this.onDataReceived(false); // custom implementation, map by map
                }
            };
            exports_22("HMapAbstractMap", HMapAbstractMap);
        }
    };
});
System.register("hmap", ["maps/grid", "maps/desert", "maps/ruin"], function (exports_23, context_23) {
    "use strict";
    var grid_1, desert_1, ruin_1, HMap;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [
            function (grid_1_1) {
                grid_1 = grid_1_1;
            },
            function (desert_1_1) {
                desert_1 = desert_1_1;
            },
            function (ruin_1_1) {
                ruin_1 = ruin_1_1;
            }
        ],
        execute: function () {
            HMap = class HMap {
                constructor(cssSelector) {
                    this.width = 300; // for debug only, the value is 300 and there is a lot of hard coded values
                    this.height = 300; // for debug only, the value is 300 and there is a lot of hard coded values
                    this.displayFlashMap = false;
                    this.cssSelector = '.swf'; // selector of the map container, default is production value
                    if (cssSelector !== undefined) {
                        this.cssSelector = cssSelector;
                    }
                }
                /**
                 * Get the map data and launch the drawing of the map
                 * This method is not straightfoward. It handles debug mode,
                 * and the fact the data can be outdated in the HTML (initialized)
                 * but uptodate in the store
                 * @param forceData when passed, it will use this dataset instead of
                 * fetching the HTML
                 */
                fetchMapData() {
                    if (this.map === undefined) {
                        this.autoBuildMap();
                    }
                    // We will look for the flashmap, take the data, and bootstrap our map
                    let counterCheckExists = 0;
                    const checkExist = setInterval(() => {
                        if (document.querySelector('#swfCont') !== null) {
                            clearInterval(checkExist);
                            let tempMapData;
                            if (document.querySelector('#FlashMap') !== null) { // if the flashmap is there
                                tempMapData = document.querySelector('#FlashMap').getAttribute('flashvars').substring(13);
                            }
                            else { // if this is only the JS code supposed to bootstrap flash
                                if (document.querySelector('#gameLayout') !== null) {
                                    const scriptStr = document.querySelector('#gameLayout').innerHTML;
                                    const mapMarker = scriptStr.indexOf('mapLoader.swf');
                                    if (mapMarker === -1) {
                                        return;
                                    }
                                    const startVar = scriptStr.indexOf('data', mapMarker) + 8;
                                    const stopVar = scriptStr.indexOf('\');', startVar);
                                    tempMapData = scriptStr.substring(startVar, stopVar);
                                }
                            }
                            this.map.buildLayers();
                            this.map.completeDataReceived({ raw: tempMapData });
                        }
                        else if (++counterCheckExists === 100) {
                            clearInterval(checkExist); // timeout 10sec
                        }
                    }, 100); // 10 sec then give up
                }
                /**
                 * Function used to setup the interceptor.
                 * The interceptor will intercept data from the server, inform our map
                 * and pass it back to haxe.
                 */
                setupInterceptor() {
                    let _js;
                    // @ts-ignore this thing is not known by the TS compiler
                    const page = window.wrappedJSObject;
                    if (page !== undefined && page.js) { // greasemonkey
                        _js = page.js;
                    }
                    else { // tampermonkey
                        _js = js;
                    }
                    if (_js && _js.XmlHttp && _js.XmlHttp.onData) { // tampermonkey
                        this.originalOnData = _js.XmlHttp.onData;
                        _js.XmlHttp.onData = this.dataInterceptor.bind(this);
                    }
                    else {
                        throw new Error('HMap::setupInterceptor - Cannot find js.XmlHttp.onData');
                    }
                }
                /**
                 * Actual interceptor
                 */
                dataInterceptor(data) {
                    this.originalOnData(data); // call the original method first
                    const currentLocation = this.getCurrentLocation();
                    if (currentLocation === 'unknown') { // unknown location, make sure the HMap is removed from the DOM
                        this.location = 'unknown';
                        this.clearMap();
                        return;
                    }
                    // now we are in an interesting place for us, check if there is data for our map
                    if (data.indexOf('js.JsMap.init') !== -1 || data.indexOf('mapLoader.swf') !== -1) {
                        // if we changed location or we dont have jsmap.init in the message, reload the whole map
                        if (currentLocation !== this.location || data.indexOf('mapLoader.swf') !== -1) {
                            this.location = currentLocation;
                            this.clearMap();
                            this.fetchMapData(); // it will autobuild the map
                        }
                        else { // we are still on the same location
                            if (data.indexOf('js.JsMap.init') !== -1) {
                                const startVar = data.indexOf('js.JsMap.init') + 16;
                                const stopVar = data.indexOf('\',', startVar);
                                const tempMapData = data.substring(startVar, stopVar);
                                this.map.partialDataReceived({ raw: tempMapData }); // else just patch the data
                            }
                            else {
                                console.warn('HMap::dataInterceptor - this case hasn\'t been encoutered yet');
                            }
                        }
                    }
                }
                /**
                 * Guess on what page we are (outise or inside the town ) by parsing the URL
                 */
                getCurrentLocation() {
                    if (window.location.href.indexOf('outside') !== -1) {
                        return 'desert';
                    }
                    else if (window.location.href.indexOf('door') !== -1) {
                        return 'doors';
                    }
                    else if (window.location.href.indexOf('explo') !== -1) {
                        return 'ruin';
                    }
                    else {
                        return 'unknown';
                    }
                }
                /**
                 * Switch the map to a new type and reload
                 */
                switchMapAndReload(type) {
                    const store = this.map.mapData.data;
                    this.clearMap();
                    if (type === 'desert') {
                        this.map = new desert_1.HMapDesertMap(this);
                    }
                    else if (type === 'grid') {
                        this.map = new grid_1.HMapGridMap(this);
                    }
                    else if (type === 'ruin') {
                        this.map = new ruin_1.HMapRuin(this);
                    }
                    this.map.buildLayers();
                    this.map.completeDataReceived({ JSON: store });
                }
                /**
                 * Rebuild the map with the JSON passed in argument. For debug mode only
                 */
                reloadMapWithData(data) {
                    this.clearMap();
                    this.target = undefined;
                    this.autoBuildMap();
                    this.map.buildLayers();
                    this.map.completeDataReceived({ JSON: data });
                }
                /**
                 * Clear the map to draw a new one (when we switch the map from desert to grid, etc.)
                 */
                clearMap() {
                    // destroy the dom element
                    const hmap = document.querySelector('#hmap');
                    if (hmap !== null && hmap.parentNode !== null) {
                        hmap.parentNode.removeChild(hmap);
                    }
                    // unset the objects
                    this.map = undefined;
                }
                /**
                 * Choose the right type of map when it hasn't already been set
                 */
                autoBuildMap() {
                    if (this.location === 'doors') { // in town
                        this.map = new grid_1.HMapGridMap(this);
                        this.map.mode = 'global'; // in town, we can see the global mode, not perso
                    }
                    else if (this.location === 'desert') {
                        this.map = new desert_1.HMapDesertMap(this);
                    }
                    else if (this.location === 'ruin') {
                        this.map = new ruin_1.HMapRuin(this);
                    }
                    else {
                        throw new Error('HMap::autoBuildMap - could not detect location');
                    }
                }
            };
            exports_23("HMap", HMap);
        }
    };
});
System.register("index", ["hmap", "toast", "environment", "data/hmap-desert-data", "data/hmap-ruin-data"], function (exports_24, context_24) {
    "use strict";
    var hmap_1, toast_5, environment_5, hmap_desert_data_3, hmap_ruin_data_2;
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [
            function (hmap_1_1) {
                hmap_1 = hmap_1_1;
            },
            function (toast_5_1) {
                toast_5 = toast_5_1;
            },
            function (environment_5_1) {
                environment_5 = environment_5_1;
            },
            function (hmap_desert_data_3_1) {
                hmap_desert_data_3 = hmap_desert_data_3_1;
            },
            function (hmap_ruin_data_2_1) {
                hmap_ruin_data_2 = hmap_ruin_data_2_1;
            }
        ],
        execute: function () {
            if (typeof require !== 'undefined') {
                console.log(typeof require);
                require('fontfaceobserver');
            }
            /**
             * It's bootstrap time !!
             */
            (function () {
                try {
                    const env = environment_5.Environment.getInstance();
                    env.devMode = (typeof HMAP_DEVMODE === 'undefined') ? false : (HMAP_DEVMODE) ? true : false;
                    // Create the styles for the fonts and some other styles
                    const style = document.createElement('style');
                    style.appendChild(document.createTextNode('\
        @font-face {\
            font-family: visitor2;\
            src: url(\'' + env.url + '/visitor2.woff2\') format(\'woff2\');\
			src: url(\'' + env.url + '/visitor2.woff\') format(\'woff\');\
        }\
        @font-face {\
            font-family: economica;\
            src: url(\'' + env.url + '/economica.woff2\') format(\'woff2\');\
        }\
        div.hmap-button {\
            padding:0px 5px;\
            margin:2px 5px;\
            border:1px solid black;\
            background-color: #a13119;\
            font-size:13px;\
            font-weight:700;\
            font-family:economica;\
            color:#eccb94;\
            cursor:pointer;\
            display:flex;\
            align-items:center;\
            user-select:none;\
        }\
        .hmap-popup {\
            font-smooth: none;\
            -webkit-font-smoothing: none;\
        }\
        .hmap-text-green {\
            font-smooth: none;\
            -webkit-font-smoothing: none;\
            fill: #d7ff5b;\
            font-family: visitor2;\
            font-size: 13px;\
        }\
        .hmap-text-yellow {\
            font-smooth: none;\
            -webkit-font-smoothing: none;\
            fill: #ebc369;\
            font-family: visitor2;\
            font-size: 13px;\
        }\
        '));
                    document.head.appendChild(style);
                    // create fake content to load the fonts ( ... )
                    const body = document.querySelector('body'); // pretty sure body is there
                    const divVisitor2 = document.createElement('div');
                    divVisitor2.setAttribute('style', 'font-family:visitor2;display:none;');
                    body.appendChild(divVisitor2);
                    const divEconomica = document.createElement('div');
                    divEconomica.setAttribute('style', 'font-family:economica;display:none;');
                    body.appendChild(divEconomica);
                    const visitor2 = new FontFaceObserver('visitor2');
                    const economica = new FontFaceObserver('economica');
                    // load the fonts
                    Promise.all([visitor2.load(), economica.load()]).then(function () {
                        try {
                            // start only when the fonts are loaded
                            const map = new hmap_1.HMap();
                            if (env.devMode === true) { // dev mode to play with the map
                                map.location = 'desert';
                                map.reloadMapWithData();
                                HMAP = map;
                                HMAPDESERTDATA = hmap_desert_data_3.HMapDesertData;
                                HMAPRUINDATA = hmap_ruin_data_2.HMapRuinData;
                            }
                            else {
                                // wait for js.JsMap to be ready
                                let counterCheckJsMap = 0;
                                const checkLocationKnown = setInterval(function () {
                                    if (map.getCurrentLocation() !== 'unknown') { // when we land on a page with the map already there, start the code
                                        clearInterval(checkLocationKnown);
                                        map.location = map.getCurrentLocation();
                                        map.fetchMapData();
                                        // intercept every ajax request haxe is doing to know if we should start the map or not
                                        setTimeout(() => map.setupInterceptor());
                                    }
                                    else if (++counterCheckJsMap > 10) { // timeout 2s
                                        clearInterval(checkLocationKnown);
                                        map.setupInterceptor(); // intercept every ajax request haxe is doing to know if we should start the map or not
                                    }
                                }, 200);
                            }
                        }
                        catch (err) {
                            console.error('HMap::bootstrap - loaded', err, err.message);
                            toast_5.Toast.show('Hmap - An error occured. Check the console to see the message.');
                        }
                    }).catch((err) => {
                        console.error('HMap::promiseAll', err, err.message);
                        toast_5.Toast.show('Hmap - Cannot load the fonts. Try to reload the page by pressing CTRL + F5 or change your browser');
                    });
                }
                catch (err) {
                    console.error('HMap::bootstrap', err, err.message);
                    toast_5.Toast.show('Hmap - An error occured. Check the console to see the message.');
                }
            })();
        }
    };
});
