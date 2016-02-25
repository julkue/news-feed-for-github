/******************************************************
 * Github news feed
 * Copyright (c) 2016, Julian Motz
 * For the full copyright and license information,
 * please view the LICENSE file that was distributed
 * with this source code.
 *****************************************************/
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json') || {},
        timestamp: new Date().getTime(),
        compress: {
            firefox: {
                options: {
                    // as EPERM is thrown when already installed a distributable,
                    // we need to append the timestamp
                    archive: 'dist/<%= pkg.name %>-<%= pkg.version %>-<%= timestamp %>.xpi',
                    pretty: true,
                    mode: 'zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'extension/',
                        src: ['**/*'],
                        dest: '/'
                    }
                ]
            }
        },
    });
    /**
     * Load Grunt plugins (dynamically)
     */
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    /**
     * Tasks
     */
    grunt.registerTask('default', function () {
        grunt.log.error('Please use "$ grunt dist"!');
    });
    grunt.registerTask('dist', ['compress:firefox']);
};
