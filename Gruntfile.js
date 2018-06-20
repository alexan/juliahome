module.exports = grunt => {
    // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        dir: {
            app: 'src',
            dist: 'static',
            layouts: 'layouts',
            js: '<%= dir.dist %>/js',
            css: '<%= dir.dist %>/css'
        },
        files: {
            js: '<%= dir.app %>/js/*.js',
            css: '<%= dir.app %>/css/*.css',
            vendor: [
                '<%= modernizr.dist.dest %>',
                'node_modules/imagesloaded/imagesloaded.pkgd.js',
                'node_modules/masonry-layout/dist/masonry.pkgd.js'
            ]
        },
        concat: {
            options: {
                sourceMap: true,
            },
            vendor: {
                src: '<%= files.vendor %>',
                dest: '<%= dir.js %>/vendor.js'
            },
            js: {
                src: '<%= files.js %>',
                dest: '<%= dir.js %>/main.js'
            },
            css: {
                src: '<%= files.css %>',
                dest: '<%= dir.css %>/main.css'
            }
        },
        uglify: {
            vendor: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    sourceMapIn: '<%= concat.vendor.dest %>.map',
                    preserveComments: 'some'
                },
                files: {
                    '<%= concat.vendor.dest %>': '<%= concat.vendor.dest %>'
                }
            },
            js: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    sourceMapIn: '<%= concat.js.dest %>.map'
                },
                files: {
                    '<%= concat.js.dest %>': '<%= concat.js.dest %>'
                }
            }
        },
        postcss: {
            options: {
                map: {
                    inline: false, 
                    prev: '<%= concat.css.dest %>.map'
                },
                processors: [
                    require('pixrem')(),
                    require('postcss-nesting')(),
                    require('postcss-custom-properties')(),
                    require('autoprefixer')(),
                    require('cssnano')()
                ]
            },
            dist: {
                src: '<%= concat.css.dest %>'
            }
        },
        modernizr: {
            dist: {
                parseFiles: true,
                options: [
                    'setClasses'
                ],
                files: {
                    src: ['<%= files.js %>', '<%= files.css %>']
                },
                dest: '<%= dir.js %>/modernizr-custom.js',
                uglify: false
            }
        },
        copy: {
            all: {
                expand: true,
                cwd: '<%= dir.app %>',
                src: ['**', '!**/*.js', '!**/*.css'],
                dest: '<%= dir.dist %>',
            },
        },
        watch: {
            js: {
                files: '<%= files.js %>',
                tasks: ['concat:js', 'uglify:js']
            },
            css: {
                files: '<%= files.css %>',
                tasks: ['concat:css', 'postcss']
            },
            other: {
                files: ['<%= dir.app %>/**', '!<%= files.js %>', '!<%= files.css %>', '!<%= files.vendor %>'],
                tasks: ['copy']
            }

        },
        clean: {
            all: ['<%= dir.dist %>/*', '!<%= dir.dist %>/uploads/**']
        }
    });


    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('prebuild', [
        'clean',
        'modernizr',
        'concat',
        'uglify',
        'postcss',
        'copy',
    ]);

    grunt.registerTask('build', [
        'prebuild',
    ]);

    grunt.registerTask('work', [
        'prebuild',
        'watch'
    ]);
};