/*jshint node: true, strict: false */

// -------------------------- grunt -------------------------- //

module.exports = function (grunt) {

    grunt.initConfig({

        // ----- tasks settings ----- //

        requirejs: {
            pkgd: {
                options: {
                    baseUrl: './',
                    include: [
                        'bower_components/jquery-bridget/jquery.bridget',
                        'js/points-of-interest.js'
                    ],
                    out: 'dist/points-of-interest.pkgd.js',
                    optimize: 'none',
                    paths: {
                        jquery: 'empty:'
                    }
                }
            }
        },

        uglify: {
            pkgd: {
                files: {
                    'dist/points-of-interest.pkgd.min.js': [ 'dist/points-of-interest.pkgd.js' ]
                }
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none'
                },
                files: {
                    'dist/points-of-interest.css': 'scss/style.scss',
                    'dist/demo.css': 'scss/demo.scss'
                }
            },
            'dist-compressed': {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: {
                    'dist/points-of-interest.min.css': 'scss/style.scss'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-requirejs');

    grunt.registerTask('default', [
        'requirejs',
        'uglify',
        'sass'
    ]);
};
