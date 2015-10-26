module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'client/TheTrip.js',
                dest: 'server/public/assets/scripts/app.min.js'
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: "node_modules/",
                src: [
                    "angular/angular.min.js",
                    "angular/angular.min.js.map",
                    "bootstrap/dist/css/bootstrap.min.css",
                    "bootstrap/dist/js/bootstrap.min.js",
                    "bootstrap/dist/fonts/glyphicons-halflings-regular.woff2",
                    "bootstrap/dist/fonts/glyphicons-halflings-regular.woff",
                    "bootstrap/dist/fonts/glyphicons-halflings-regular.ttf",
                    "jquery/dist/jquery.min.js",
                    "jquery/dist/jquery.min.map"
                ],
                "dest": "server/public/vendor/"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['copy', 'uglify']);

};