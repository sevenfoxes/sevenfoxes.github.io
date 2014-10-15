'use strict';

var
  LIVERELOAD_PORT = 35729,
  lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT }),
  mountFolder = function( connect, dir ) {
    return connect.static(require('path').resolve(dir));
  };

module.exports = function( grunt ) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    watch: {
      livereload: {
        files: [
          '{,*/}*.html',
          '{,*/}*.htm',
          'static/{,*/}*.{css,js,png,jpg,gif,svg}'
        ],
        options: {
          livereload: LIVERELOAD_PORT
        }
      },
      sass:{
        files: ['css/source/**/*'],
        tasks: ['sass']
      },
      jade:{
        files: ['jade/*.jade'],
        tasks: ['jade']
      }
    },
    sass:{
      options: {
        style: 'compressed'
      },
      dist:{
        files: {'css/main.css': 'css/source/main.scss'}
      }
    },
    jade: {
      compile: {
        options: {
          pretty: true,
          data: {
            debug: false
          }
        },
        files: {
          "index.html": ["jade/index.jade"]
        }
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function( connect ) {
            return [
              lrSnippet,
              mountFolder(connect, './')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    }
  });

  grunt.registerTask('server', function() {
    grunt.task.run([
      'connect:livereload',
      'sass',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('default', [ 'server' ]);
};