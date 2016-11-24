'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    copy: {
      global: {
        src: 'src/videojs.ads.js',
        dest: 'dist/videojs.ads.global.js'
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['dist/videojs.ads.js'],
        dest: 'dist/videojs.ads.js'
      },
      global: {
        src: ['dist/videojs.ads.global.js'],
        dest: 'dist/videojs.ads.global.js'
      }
    },
    connect: {
      server: {
        options: {
          keepalive: true
        }
      }
    },
    umd: {
      all: {
        options: {
          src: 'src/videojs.ads.js',
          dest: 'dist/videojs.ads.js',
          template: 'umd',
          amdModuleId: 'videojs-contrib-ads',
          globalAlias: 'videojs-contrib-ads',
          deps: {
            default: ['videojs'],
            amd: ['videojs'],
            cjs: ['video.js']
          }
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/videojs.ads.min.js'
      },
      global: {
        src: '<%= concat.global.dest %>',
        dest: 'dist/videojs.ads.global.min.js'
      },
    },
    qunit: {
      files: ['test/**/*.html', '!test/events.html']
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
    },
  });

  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', ['clean', 'copy', 'umd', 'concat', 'uglify']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'build']);

  // travis build task
  grunt.registerTask('build:travis', ['jshint', 'test:node']);

};
