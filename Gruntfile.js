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
                        'node_modules/jquery-bridget/jquery.bridget.js',
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
                files: [{
                    expand: true,
                    cwd: './scss',
                    src: ['*.scss'],
                    dest: './dist',
                    ext: '.css'
                }]
            },
            'dist-compressed': {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: {
                    'dist/points-of-interest.min.css': 'scss/points-of-interest.scss'
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
