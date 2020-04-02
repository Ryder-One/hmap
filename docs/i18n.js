$( document ).ready(function() {
    $.i18n().load( {
        fr: {
            'subtitle': 'Une carte HTML5 fonctionnelle pour Hordes.fr',
            'signature': 'Par RyderOne',
            'download': 'Télécharger sur Github',
            'shaman-mode': 'Mode chaman',
            'scavenger-mode': 'Mode fouineur',
            'scout-mode': 'Mode éclaireur',
            'ruin-mode': 'Mode ruine',
            'reload': 'Recharger la carte',
            'json-placeholder': 'Collez le code de debug et rechargez la carte. Si vous laissez vide, cela va générer des données aléatoires.',
            'how-to': 'Comment ça fonctionne ?',
            'stepX': 'Etape $1',
            'step1': 'Installez l\'extention $1 sur votre navigateur préféré',
            'step2': 'Installez HMap en suivant ce lien $1',
            'step3' : 'Rendez-vous sur $2 (ou $1, ou $3 ou $4)',
            'step4': 'Amusez vous, sans flash :)'
        },
        en: {
            'subtitle': 'A working HTML5 map for die2nite',
            'signature': 'By RyderOne',
            'download': 'Download on Github',
            'shaman-mode': 'Shaman mode',
            'scavenger-mode': 'Scavenger mode',
            'scout-mode': 'Scout mode',
            'ruin-mode': 'Ruin mode',
            'reload' : 'Reload the map',
            'json-placeholder' : 'Paste the debug code here and press reload. It will generate random data if this stay empty.',
            'how-to': 'How to use it ?',
            'stepX': 'Step $1',
            'step1': 'Install $1 extension on your favorite browser',
            'step2': 'Install HMap following this link : $1',
            'step3' : 'Go to $1 (or $2, or $3 or $4)',
            'step4': 'Enjoy your new HTML5 map :)'
        }
    } );

    var language = window.navigator.userLanguage || window.navigator.language;
    language = language.split('-')[0];

    if (language !== 'en' && language !== 'fr') {
        language = 'en';
    }
    $.i18n({
        locale: language
    });

    translate();

    $('#fr-icon').on('click', function() {
        $.i18n({
            locale: 'fr'
        }); 
        translate();
    });

    $('#en-icon').on('click', function() {
        $.i18n({
            locale: 'en'
        }); 
        translate();
    });
});

function translate()  {
    $('#subtitle').html($.i18n('subtitle'));
    $('#signature').html($.i18n('signature'));
    $('#download').html($.i18n('download'));
    $('#shaman-mode').next('label').html($.i18n('shaman-mode'));
    $('#scavenger-mode').next('label').html($.i18n('scavenger-mode'));
    $('#scout-mode').next('label').html($.i18n('scout-mode'));
    $('#ruin-mode').next('label').html($.i18n('ruin-mode'));
    $('#reload').html($.i18n('reload'));
    $('#json-data').attr('placeholder', $.i18n('json-placeholder'));
    $('#how-to-title').html($.i18n('how-to'));
    $('#step1-b').html($.i18n('stepX', '1'));
    $('#step2-b').html($.i18n('stepX', '2'));
    $('#step3-b').html($.i18n('stepX', '3'));
    $('#step4-b').html($.i18n('stepX', '4'));
    $('#step1-span').html($.i18n('step1', '<a href="http://www.tampermonkey.net/" target="_blank">Tampermonkey</a>'));
    $('#step2-span').html($.i18n('step2', '<a href="https://github.com/Ryder-One/hmap/releases/latest/download/hmap.user.js" target="_blank">HMap</a>'));
    $('#step3-span').html($.i18n('step3', 
        '<a href="http://www.die2nite.com/" target="_blank">die2nite</a>',
        '<a href="http://www.hordes.fr/" target="_blank">hordes</a>',
        '<a href="http://www.dieverdammten.de/" target="_blank">dieverdammten</a>',
        '<a href="http://www.zombinoia.com/" target="_blank">zombinoia</a>'));
    $('#step4-span').html($.i18n('step4'));
}