/* global brackets, define, $ */

define(function () {
    'use strict';

    var fonts = [ // Add or remove fonts here from Google Fonts
        'Default', // This item is needed to reset to the standard font
        'Cutive Mono',
        'Droid Sans Mono',
        'Inconsolata',
        'Nova Mono',
        'Oxygen Mono',
        'PT Mono',
        'Share Tech Mono',
        'Ubuntu Mono'
        'Montserrat'
    ];
    
	var CommandManager = brackets.getModule('command/CommandManager'),
        Menus = brackets.getModule('command/Menus'),
        PreferencesManager = brackets.getModule('preferences/PreferencesManager'),
        menuId = 'font-menu',
        preferences = PreferencesManager.getPreferenceStorage('extensions.brackets-monospace-fonts'),
		menu = Menus.getMenu(menuId) || Menus.addMenu('Font', menuId, Menus.AFTER, Menus.AppMenuBar.VIEW_MENU),
        editorHolderElement = $('#editor-holder'),
        bodyElement = $('body');
            
    function Font(name) {
        this.name = name || '';
        this.className = 'code-font-' + this.name.replace(/\s/g, '-').replace(/[^\w\d]/g, '').toLowerCase();
        
        if(name !== 'Default') {
            this.nameForURI = this.name.replace(/\s/g, '+').replace(/[^\w\d\+]/g, '');
            this.linkElement = $('<link class="' + this.className + 
                                            '" href="http://fonts.googleapis.com/css?family=' +
                                            this.nameForURI + '" rel="stylesheet" type="text/css">');
            this.css = '.' + this.className + ' .CodeMirror {' +
                            'font-family: \'' + this.name + '\', sans-serif !important;}';
            this.hasLinkTagAppendedToBody = false;
        }
    }
            
    function getFontByName(name) {
        var font, i = 0, length = fonts.length;
        
        for(i = 0; i < length; i++) {
            if(fonts[i].name === name) {
                font = fonts[i];
                break;
            }
        }
        
        return font;
    }
    
    function changeFont(name) {
        var font = getFontByName(name);
        
        if(font) {
            editorHolderElement.attr('class', '');
            preferences.setValue('selectedFont', font.name);
            
            if(font.linkElement && font.className) {
                if(!font.hasLinkTagAppendedToBody) {
                    bodyElement.append(font.linkElement);
                    font.hasLinkTagAppendedToBody = true;
                }
                
                editorHolderElement.attr('class', font.className);
            }
        }
    }

	function createFontMenu() {
        fonts.forEach(function (font) {
            CommandManager.register(font.name, font.className, function () {
                changeFont(font.name);
            });
            menu.addMenuItem(font.className);	
        });
    }

    function createFontStyleElement() {
        var css = fonts.map(function (font) {
            return font.css;
        }).join(' ');

        $('<style>' + css + '</style>').appendTo(bodyElement);
    }

	// Set default value if no font is specified
	if (!preferences.getValue('selectedFont')) {
		changeFont('Default');
	}

    // Create font instances
    fonts = fonts.map(function (fontName) { 
        return new Font(fontName); 
    });

    // Create menu items and set the font
    createFontStyleElement();
    createFontMenu();
    changeFont(preferences.getValue('selectedFont'));
});
