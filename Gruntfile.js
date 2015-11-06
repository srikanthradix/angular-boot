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
                dest: 'src/main/resources/app/dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'src/main/resources/app/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
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
        replace: {
            js_to_min: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/main/resources/app/index.html'],
                        dest: 'src/main/resources/app/'
                    }
                ],
                dist: {
                    options: {
                        patterns: [
                            {
                                match: /(.*)\.js/g,
                                replacement: '$1.min.js'
                            }
                        ]
                    }
                }
            }
        }
    });

    // load the Grunt task
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-replace');

    grunt.registerTask("default", ["concat", "uglify"]);
};