module.exports = function(grunt) {

  //Initializing the configuration object
  var path = require('path');
  grunt.initConfig({
      //--------------------CSS-GENERATION--------------------//
      less: { 
        development: {
          options: {
            compress: true  //minifying the result
          },
          files: {
            //compiling frontend.less into frontend.css
            "./css/frontend.css":"./less/frontend.less",
            //compiling backend.less into backend.css
            "./css/backend.css":"./less/backend.less"
          }
        }
      },
      //--------------------MINIFICATION----------------------//
      concat: {
        options: {
          separator: ';'
        },
        js_frontend: {
          src: [
            './lib/jquery/jquery.js',
            './lib/bootstrap/js/*.js'
          ],
          dest: './js/frontend.js'
        },
        js_backend: {
          src: [
            './lib/jquery/jquery.js',
            './lib/bootstrap/js/*.js',
            './js/bracket-valid.js'
          ],
          dest: './js/backend.js'
        }
      },
      uglify: {
        options: {
          mangle: false
        },
        frontend: {
          files: {
            './js/frontend.js': './js/frontend.min.js'
          }
        },
        backend: {
          files: {
            './js/backend.js': './js/backend.min.js'
          }
        }
      },
      //--------------------TESTING---------------------------//
      phpunit: {
        classes: {
        },
        options: {
          colors: true
        }
      },
      qunit: {
        files: ['test/*.html']
      },
      //--------------------LINTING---------------------------//
      bootlint: {
        options: {
          stoponerror: false,
          relaxerror: []
        },
        files: ['test/target/*.php']
      },
      jshint: {
        files: ['js/frontend.js','js/backend.js']
      },
      //--------------------TEST-FILE-GENERATE----------------//
      curl: {
        'test/target/index.php' : 'http://localhost/tourney/index.php'
      },
      clean: {
        test: ['test/target/*'],
        lib: ['lib/*'],
        bower: ['bower_components'],
        deploy: {
          src: ['/var/www/html/tourney/*'],
          options: { force: true }
        }
      },
      //--------------------DEPLOY----------------------------//
      copy: {
        deploy: {
          files: [{expand: true, src: [
                '*.php',
                'admin/*.php',
                'js/{frontend,backend}.min.js',
                'img/*',
                'fonts/*',
                'css/{frontend,backend}.css'
          ], dest: '/var/www/html/tourney/'}]
        },
        bower: {
          files: [{expand: true, cwd: 'bower_components', src: [
                'bootstrap/{fonts,js,less}/**',
                'fontawesome/{fonts,less}/**',
                'jquery/dist/*.js',
                'quill/dist/{quill.js,quill.base.css}'
            ], dest: 'lib/'}]
        }
      },
      //--------------------INSTALL-DEPENDENCIES--------------//
      shell: {
        bower_install: {
          command: 'bower install'
        },
        bower_config: {
          command: [
            'mv lib/jquery/dist/* lib/jquery/',
            'mv lib/quill/dist/* lib/quill/',
            'rmdir lib/quill/dist lib/jquery/dist',
            'mv lib/bootstrap/fonts/* fonts/',
            'mv lib/fontawesome/fonts/* fonts/',
            'rmdir lib/bootstrap/fonts lib/fontawesome/fonts'
              ].join('&&')
        }
      }
  });

  // Plugin loading
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bootlint');
  grunt.loadNpmTasks('grunt-phplint');
  grunt.loadNpmTasks('grunt-phpunit');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-curl');

  // Task definition
  grunt.registerTask('default', ['minify', 'deploy']);
  grunt.registerTask('bower', ['clean:bower', 'clean:lib', 'shell:bower_install', 'copy:bower', 'shell:bower_config', 'clean:bower']);
  grunt.registerTask('deploy', ['clean:deploy', 'copy:deploy']);
  grunt.registerTask('lint', ['jshint','curl','clean:test']);
  grunt.registerTask('minify', ['bower', 'less', 'concat', 'uglify']);
};
