/*
 * Copyright (c) 2014 Jacob Lauritzen.
 *
 * Licensed under MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, */

define(function (require, exports, module) {
    "use strict";

    var CodeMirror          = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror"),
        ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),
        FileSystem          = brackets.getModule("filesystem/FileSystem"),
        PreferencesManager  = brackets.getModule("preferences/PreferencesManager"),
        ThemeManager        = brackets.getModule("view/ThemeManager");

    var prefs = PreferencesManager.getExtensionPrefs("themes"),
        moduleThemesDir = ExtensionUtils.getModulePath(module, "themes/"),
        themes = [];

    prefs.on("change", function (e, data) {
        var i = 0, theme;
        console.log("Possibly changed prefs:", data.ids);
        for (i = 0; i < data.ids.length; i++) {
            if (data.ids[i] === "theme") {
                theme = prefs.get("theme");
                if (theme.indexOf("Themes-for-Brackets") === 0) {
                    console.log("Themes for Brackets theme. Loading css...");
                    $("#TfB-style").attr("href", moduleThemesDir + theme.substr(20) + ".css"); //20 = "Themes-for-Brackets-"
                }
            }
        }
    });

    function upperCase(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    FileSystem.getDirectoryForPath(moduleThemesDir).getContents(function (err, contents) {
        var i;
        if (err) {
            console.log("Error getting themes:" + err);
        }
        for (i = 0; i < contents.length; i++) {
            if (contents[i].name !== ".DS_Store") {

                var name = "Themes-for-Brackets-" + contents[i].name.replace(".css", ""),
                    title = "Themes for Brackets  " + upperCase(contents[i].name.replace(".css", "")).replace(/\-/g, ' ');

                ThemeManager.loadFile(moduleThemesDir + contents[i].name, {name: name, title: title, dark: true});
            }
        }
    });

    $("body").append('<link rel="stylesheet" id="TfB-style">');
    $("body").append('<link rel="stylesheet" href="' + ExtensionUtils.getModulePath(module) + 'stuff.css">');

});
