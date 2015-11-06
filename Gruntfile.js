module.exports = function (grunt) {
    //do grunt related tasks in here.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            files: ['Gruntfile.js',
                'src/main/resources/app/js/**/*.js',
                'src/main/resources/app/config/**/*.js',
                'src/main/resources/app/app.js'],
            options: {
                "asi": true,
                "expr": true
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/main/resources/app/js/**/*.js',
                    'src/main/resources/app/config/*.js',
                    'src/main/resources/app/app.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            dist: {
                files: grunt.file.expandMapping([
                        'src/main/resources/app/js/**/*.js',
                        'src/main/resources/app/config/**/*.js',
                        'src/main/resources/app/app.js'
                    ],
                    '', {
                        rename: function (destBase, destPath) {
                            return destBase + destPath.replace('.js', '.min.js');
                        }
                    })
            }
        },
        clean: {
            remove: {
                src: [
                    'src/main/resources/app/js/**/*.min.js',
                    'src/main/resources/app/config/**/*.min.js',
                    'src/main/resources/app/app.min.js'
                ]
            }
        },
        'string-replace': {
            inline: {
                files: {
                    './': [
                        'src/main/resources/app/index.html',
                        'src/main/resources/app/html/**/*.html',
                        'src/main/resources/app/js/**/*.js',
                        'src/main/resources/app/config/**/*.js',
                        'src/main/resources/app/app.js'
                    ]
                },
                options: {
                    replacements: [
                        {
                            pattern: '.js',
                            replacement: '.min.js'
                        }
                    ]
                }
            }
        }
    });

    // load the Grunt task
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-string-replace');

    grunt.registerTask("default", ["clean"]);
};