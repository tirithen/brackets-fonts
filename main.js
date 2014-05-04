/* global brackets, define, $ */

define(function () {
    'use strict';

    var fonts = [ // Add or remove fonts here from Google Fonts
        'Default', // This item is needed to reset to the standard font
        'Source Code Pro',
        'Anonymous Pro',
        'Inconsolata',
        'Ubuntu Mono',
        'Cousine',
        'Droid Sans Mono',
        'VT323',
        'Oxygen Mono',
        'PT Mono',
        'Nova Mono',
        'Share Tech Mono',
        'Cutive Mono',
        'Open Sans'
    ];

    var CommandManager = brackets.getModule('command/CommandManager'),
        Menus = brackets.getModule('command/Menus'),
        PreferencesManager = brackets.getModule('preferences/PreferencesManager'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        preferences = PreferencesManager.getExtensionPrefs('brackets-fonts'),
        fontMenu = Menus.getMenu('font-menu') || Menus.addMenu('Font', 'font-menu', Menus.AFTER, Menus.AppMenuBar.VIEW_MENU),
        currentFont = null,
        styleSheet = null,
        linkElement = null;

    preferences.on('change', function () {
        changeFont(preferences.get('selectedFont'));
    });

    function createFontMenuItem(name) {
        var commandName = name.replace(/\s+/g, '.');
        CommandManager.register(name, commandName, function () {
            changeFont(name);
        });
        fontMenu.addMenuItem(commandName);
    }

    function createFontMenu() {
        for (var i = 0; i < fonts.length; i++) {
            createFontMenuItem(fonts[i]);
        }
    }

    function unlinkFontStyles() {
        if (linkElement !== null && linkElement.parentNode) {
            linkElement.parentNode.removeChild(linkElement);
        }
        if (styleSheet !== null && styleSheet.parentNode) {
            styleSheet.parentNode.removeChild(styleSheet);
        }
    }

    function changeFont(name) {
        if (name === 'Default') {
            currentFont = 'Default';
            unlinkFontStyles();
        } else if (name !== currentFont) {
            currentFont = name;
            unlinkFontStyles();
            linkElement = ExtensionUtils.addLinkedStyleSheet('http://fonts.googleapis.com/css?family=' + encodeURIComponent(name));
            styleSheet = ExtensionUtils.addEmbeddedStyleSheet('.CodeMirror { font-family: "' + name + '" }');
            preferences.set('selectedFont', currentFont);
        }
    }

    // Initialization
    createFontMenu();
    changeFont(preferences.get('selectedFont') || 'Default');
});
