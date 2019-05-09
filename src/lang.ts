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
}

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
    'undigged': 'Secteur inexploitable'
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
    'toasterror': 'An error occured. Check the console for more informations',
    'undigged' : 'Unsearchable zone'
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
}
