/******************************************************
 * Github news feed
 * Copyright (c) 2016–2017, Julian Motz
 * For the full copyright and license information,
 * please view the LICENSE file that was distributed
 * with this source code.
 *****************************************************/
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json") || {},
        timestamp: new Date().getTime(),
        clean: {
            build: ["build/**"]
        },
        copy: {
            chrome: {
                files: [
                    {
                        cwd: "extension/",
                        src: ["**/*"],
                        timestamp: true,
                        expand: true,
                        mode: true,
                        dest: "build/chrome"
                    }
                ]
            },
            firefox: {
                files: [
                    {
                        cwd: "extension/",
                        src: ["**/*"],
                        timestamp: true,
                        expand: true,
                        mode: true,
                        dest: "build/firefox"
                    }
                ]
            },
        },
        compress: {
            chrome: {
                options: {
                    // as EPERM is thrown when already installed a distributable,
                    // we need to append the timestamp
                    archive: "dist/<%= pkg.name %>-<%= pkg.version %>-chrome-<%= timestamp %>.zip",
                    pretty: true,
                    mode: "zip"
                },
                files: [
                    {
                        expand: true,
                        cwd: "build/chrome/",
                        src: ["**/*", "!test.html"],
                        dest: "/"
                    }
                ]
            },
            firefox: {
                options: {
                    // as EPERM is thrown when already installed a distributable,
                    // we need to append the timestamp
                    archive: "dist/<%= pkg.name %>-<%= pkg.version %>-firefox-<%= timestamp %>.xpi",
                    pretty: true,
                    mode: "zip"
                },
                files: [
                    {
                        expand: true,
                        cwd: "build/firefox/",
                        src: ["**/*", "!test.html"],
                        dest: "/"
                    }
                ]
            }
        },
        removelogging: {
            chrome: {
                src: "build/chrome/scripts/**/*.js"
            },
            firefox: {
                src: "build/firefox/scripts/**/*.js"
            }
        },
        replace: {
            chrome: {
                src: [
                    "build/chrome/manifest.json",
                    "build/chrome/scripts/bootstrap.js"
                ],
                overwrite: true,
                replacements: [
                    {
                        from: /,?[\s]*"applications":\s?{[^}]*}[^}]*}[^}]*}/gmi,
                        to: ""
                    },
                    {
                        from: /([A-Za-z]*\s?environment\s?=\s?\")[A-Za-z0-9]*(\";)/gmi,
                        to: "$1chrome$2"
                    }
                ]
            },
            firefox: {
                src: [
                    "build/firefox/manifest.json",
                    "build/firefox/scripts/bootstrap.js"
                ],
                overwrite: true,
                replacements: [
                    {
                        from: /,?[\s]*"offline_enabled":\s?[^,]*/gmi,
                        to: ""
                    },
                    {
                        from: /([A-Za-z]*\s?environment\s?=\s?\")[A-Za-z0-9]*(\";)/gmi,
                        to: "$1firefox$2"
                    }
                ]
            }
        }
    });
    /**
     * Load Grunt plugins (dynamically)
     */
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    /**
     * Tasks
     */
    grunt.registerTask("default", function () {
        grunt.log.error("Please use '$ grunt dist !'");
    });
    grunt.registerTask("dist", function () {
        grunt.task.run(["clean:build"]);
        if((!grunt.option("chrome") && !grunt.option("firefox")) || grunt.option("chrome")) {
            grunt.task.run([
                "copy:chrome",
                "removelogging:chrome",
                "replace:chrome",
                "compress:chrome"
            ]);
        }
        if((!grunt.option("chrome") && !grunt.option("firefox")) || grunt.option("firefox")) {
            grunt.task.run([
                "copy:firefox",
                "removelogging:firefox",
                "replace:firefox",
                "compress:firefox"
            ]);
        }
        grunt.task.run(["clean:build"]);
    });
};
