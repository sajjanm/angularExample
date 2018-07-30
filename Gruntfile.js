// AdminLTE Gruntfile
module.exports = function (grunt) {

    'use strict';
    // Load all grunt tasks

    // LESS Compiler
    grunt.loadNpmTasks('grunt-contrib-less');
    // // Watch File Changes
    grunt.loadNpmTasks('grunt-contrib-watch');
    // // Compress CSS Files
    // grunt.loadNpmTasks('grunt-contrib-cssmin');
    // // Compress JS Files
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Annotate for Anuglar
    // grunt.loadNpmTasks('grunt-ng-annotate');

    // // Include Files Within HTML
    // grunt.loadNpmTasks('grunt-includes');
    // // Optimize images
    // grunt.loadNpmTasks('grunt-image');
    // // Validate JS code
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    // Delete not needed files
    grunt.loadNpmTasks('grunt-contrib-clean');
    // Lint CSS
    // grunt.loadNpmTasks('grunt-contrib-csslint');
    // Lint Bootstrap
    // grunt.loadNpmTasks('grunt-bootlint');
    // copy task
    grunt.loadNpmTasks('grunt-contrib-copy');
    // concat task
    grunt.loadNpmTasks('grunt-contrib-concat');
    // minify css
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // html minify
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    // minified
    grunt.loadNpmTasks('grunt-usemin');
    // clean file and folder
    grunt.loadNpmTasks('grunt-cleanempty');
    // versioning the file name
    grunt.loadNpmTasks('grunt-filerev');

    grunt.initConfig({
        watch: {
      // If any .less file changes in directory "build/less/" run the "less"-task.
          less: {
              files: ["dev/build/less/*.less", "dev/build/less/skins/*.less"],
              tasks: ["less"]
          },
          js: {
              files: ["dev/js/app.js", "dev/js/SmartCard.js"],
              tasks: ["uglify"]
      }

    },
    // "less"-task configuration
    // This task will compile all less files upon saving to create both AdminLTE.css and AdminLTE.min.css
    less: {
      // Development not compressed
      development: {
        options: {
          // Whether to compress or not
          compress: false
      },
      files: {
          // compilation.css  :  source.less
          "dev/css/SmartCard.css": "dev/build/less/SmartCard.less",
          //Non minified skin files
          // "dev/css/skins/skin-default.css": "dev/build/less/skins/skin-default.less"
        }
      }
    },

    // Minify CSS Files
    cssmin: {
      'options': {
        // processImport: true,
        roundingPrecision: -1,
        keepSpecialComments: 0,
    },
    target: {
        files: {
          'dev/css/app.min.css': ['bower_components/bootstrap/dist/css/bootstrap.min.css',
          'dev/css/fontawesome.min.css',
          'dev/css/skins/skin-default.min.css',
          'bower_components/angular-ui-select/dist/select.css',
          'bower_components/ng-table/dist/ng-table.min.css',
          'dev/css/SmartCard.css'
              // 'dev/css/skin/skin-default.css'
              ]
          }
      }
    },

    // Uglify task info. Compress the js files.
    uglify: {
      options: {
        mangle: true,
        preserveComments: 'some'
    },
    my_target: {
        files: {
          'dev/js/app.min.js': ['bower_components/slick-carousel/slick/slick.js',
          'dev/js/app.js',
          'dev/js/SmartCard.js']
      }
    }
    },

    // ngAnnotate: {
    //     options: {
    //         seperator: ';',
    //     },
    //       target: {
    //         files: [{
    //           expand: true,
    //           cwd: 'app/modules',
    //           src: '**/*.js',
    //           dest: 'app/SmartCardAngular.js'
    //         }],
    //     },
    // },

    // Validate JS code
    jshint: {
        options: {
            jshintrc: '.jshintrc'
        },
        core: {
            src: 'js/app.js'
        },
        demo: {
            src: 'js/demo.js'
        },
        pages: {
            src: 'js/pages/*.js'
        }
    },

    // Validate CSS files
    csslint: {
        options: {
            csslintrc: 'build/less/.csslintrc'
        },
        dist: [
        'css/AdminLTE.css',
        ]
    },

    // Validate Bootstrap HTML
    bootlint: {
        options: {
            relaxerror: ['W005']
        },
        files: ['pages/**/*.html', '*.html']
    },

    // Delete images in build directory
    // After compressing the images in the build/img dir, there is no need
    // for them
    clean: {
        build: {
            src: "build/img/*"
        },

        dist: {
            src: [ 'dist' ]
        }
    },

    useminPrepare: {
        html: 'dev/index.html',
        options: {
            dest: 'dist',
            flow: {
                html: {
                    steps: {
                        js: ['concat', 'uglify'],
                        css: ['cssmin']
                    },
                    post: {}
                }
            }
        }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
        html: ['dist/{,*/}*.html'],
        css: ['dist/css/{,*/}*.css'],
        js: ['dist/js/{,*/}*.js'],
        options: {
            assetsDirs: [
            'dist',
            'dist/js',
            'dist/css'
            ],
            patterns: {
                js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
            }
        }
    },

    htmlmin: {
        options: {
                collapseWhitespace: true,
                conservativeCollapse: true,
                collapseBooleanAttributes: true,
                removeCommentsFromCDATA: true,
                removeComments: true
            },
        dist: {
            files: [{
                expand: true,
                cwd: 'dev',
                src: ['**/*.html', '!index.html'],
                dest: 'dist'
            }]
        },
        index: {
            files: [{
                'dist/index.html': ['dist/index.html']
            }]
        }
    },

    copy: {
        dist: {
            cwd: 'dev',
            src: ['**', '!*.js', '!directive/**/*.js', '!factory/**/*.js', '!filter/**/*.js', '!modules/**/*.js', '!js/**/*.js', '!build/**/*.*', '!css/**/*.css'],
            dest: 'dist',
            expand: true
        },
        images: {
            cwd: 'dev/img',
            src: [ '**'],
            dest: 'dist/img',
            expand: true
        }
    },
    cleanempty: {
        options: {
            files: false
        },
        src: ['dist/**/*'],
    },
    filerev: {
        options: {
            encoding: 'utf8',
            algorithm: 'md5',
            length: 8
        },
        source: {
            files: [{
                src: [
                    'dist/js/**/*.js',
                    'dist/css/**/*.css',
                    // 'dist/img/**/*.{jpg,jpeg,gif,png,ico}'
                ]
            }]
        }
    },

    });

    // The default task (running "grunt" in console) is "watch"
    grunt.registerTask('default', ['watch']);

    grunt.registerTask('production', [
            'clean:dist',
            'useminPrepare',
            'concat:generated',
            'cssmin:generated',
            'copy:dist',
            'copy:images',
            'uglify:generated',
            'filerev',
            'usemin',
            'htmlmin',
            'cleanempty',
        ]);
};
