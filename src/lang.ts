import { HMapRuinType } from './maps/ruin';

export type HMapLanguage = 'fr' | 'en' | 'de' | 'es';

export interface HMapTraduction {
    modebutton: string;
    mapbutton: string;
    debugbutton: string;
    markersbutton: string;
    closebutton: string;
    resetbutton: string;
    tag_1:  string;
    tag_2:  string;
    tag_3:  string;
    tag_4:  string;
    tag_5: string;
    tag_6: string;
    tag_7: string;
    tag_8: string;
    tag_9: string;
    tag_10: string;
    tag_11: string;
    tag_12: string;
    fewZombies: string;
    medZombies: string;
    manyZombies: string;
    toastdebug: string;
    toasterror: string;
    undigged: string;
    oxygen: string;
    position: string;
}

type RuinNamePerLangType = {
    [T in HMapRuinType]: Array<string>;
};

type RuinNameType = {
    [T in HMapLanguage]: RuinNamePerLangType;
};

const ruinNames: RuinNameType = {
    'fr' : {
        'bunker' : [
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
        'motel' : [
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
        'hospital' : [
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
    'en' : {
        'bunker' : [
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
        'motel' : [
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
        'bunker' :
        [
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
        'motel' :
        [
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
        'hospital' :
        [
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
    'de' : {
        'bunker' : [
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
        'motel' : [
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


const french: HMapTraduction = {
    'modebutton' : 'Global',
    'mapbutton' : 'Carte',
    'debugbutton' : 'Debug',
    'markersbutton': 'Marqueurs',
    'closebutton': 'Fermer',
    'resetbutton': 'Reset',
    'tag_1' : 'Appel à l\'aide',
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
    'fewZombies' : 'Zombies isolés',
    'medZombies' : 'Meute de zombies',
    'manyZombies': 'Horde de zombies',
    'toastdebug' : 'Le debug a été copié dans le presse papier',
    'toasterror': 'Une erreur est survenue. Ouvrez la console pour plus d\'informations',
    'undigged': 'Secteur inexploitable',
    'oxygen': 'Oxygène',
    'position': 'Position'
};

const english: HMapTraduction = {
    'modebutton' : 'Global',
    'mapbutton' : 'Carte',
    'debugbutton' : 'Debug',
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
    'fewZombies' : 'Isolated zombies',
    'medZombies' : 'Pack of zombies',
    'manyZombies': 'Horde of zombies',
    'toastdebug' : 'Debug has been copied to clipboard',
    'toasterror': 'An error occurred. Check the console for more informations',
    'undigged' : 'Unsearchable zone',
    'oxygen': 'Oxygen',
    'position': 'Position'
};

const german: HMapTraduction = {
    'modebutton' : 'Global',
    'mapbutton' : 'Karte',
    'debugbutton' : 'Debug',
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
    'fewZombies' : 'Einzelner Zombie',
    'medZombies' : 'Zombiemeute',
    'manyZombies': 'Zombiehorde',
    'toastdebug' : 'Debug wurde in die Zwischenablage kopiert',
    'toasterror': 'Ein Fehler ist aufgetreten. Überprüfen Sie die Konsole für weitere Informationen',
    'undigged' : 'Sektor nicht durchsuchbar',
    'oxygen': 'Sauerstoff',
    'position': 'Position'
};

const spanish: HMapTraduction = {
    'modebutton' : 'Global',
    'mapbutton' : 'Mapa',
    'debugbutton' : 'Debug',
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
    'fewZombies' : 'Zombis sueltos',
    'medZombies' : 'Banda de zombis',
    'manyZombies': 'Turba de zombis',
    'toastdebug' : 'La depuración se ha copiado al portapapeles.',
    'toasterror': 'Ocurrió un error. Compruebe la consola para más información',
    'undigged' : 'Sector inexplotable',
    'oxygen': 'Oxígeno',
    'position': 'Posición'
};

export class HMapLang {

    static instance?: HMapLang;

    private language: HMapLanguage;
    private traductions: Map<HMapLanguage, HMapTraduction > = new Map();

    static getInstance(): HMapLang {
        if (HMapLang.instance === undefined) {
            HMapLang.instance = new HMapLang();
        }
        return HMapLang.instance;
    }

    static get(key: (keyof HMapTraduction)): string {
        const instance = HMapLang.getInstance();
        return instance._get(key);
    }

    constructor() {
        this.language = this.detectLanguage();

        this.traductions.set('fr', french);
        this.traductions.set('en', english);
        this.traductions.set('de', german);
        this.traductions.set('es', spanish);

    }

    private detectLanguage(): HMapLanguage {
        const url = window.location;
        if ('hordes.fr' in url) {
            return 'fr';
        } else if ('die2nite.com' in url) {
            return 'en';
        } else if ('dieverdammten.de' in url) {
            return 'de';
        } else if ('www.zombinoia.com' in url) {
            return 'es';
        } else {
            return 'fr';
        }
    }


    public _get(key: (keyof HMapTraduction)): string {
        if (this.traductions.get(this.language) !== undefined) {
            const trads = this.traductions.get(this.language)!;
            return trads[key];
        }
        return this.traductions.get('en')![key]; // default, we have the english traduction
    }

    public getRuinNames(ruinType: HMapRuinType): Array<string> {
        return ruinNames[this.language][ruinType];
    }
}
