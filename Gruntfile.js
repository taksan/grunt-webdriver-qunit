/*
 * grunt-webdriver-qunit
 * https://github.com/bulain/grunt-webdriver-qunit
 *
 * Copyright (c) 2013 Bulain Peng
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      target: ['target'],
    },
    
    connect : {
      server : {
        options : {
          port : '8000',
          base : 'test'
        }
      }
    },
    
    webdriver_startup: {
      options : {
        port: '4444',
      }
    },

    // Configuration to be run (and then tested).
    webdriver_qunit: {
      phantomjs: {
        options: {
          browserNames: ['phantomjs'],
          reportsDir: 'target/surefire-reports',
          qunitJson: '../test/qunit.json',
          baseUrl: 'http://localhost:8000',
        }
      },
      linux: {
        options: {
          browserNames: ['phantomjs', 'chrome', 'firefox'],
          reportsDir: 'target/surefire-reports',
          qunitJson: '../test/qunit.json',
          baseUrl: 'http://localhost:8000',
        }
      },
      windows: {
        options: {
          browserNames: ['phantomjs', 'chrome', 'firefox', 'ie', 'safari'],
          reportsDir: 'target/surefire-reports',
          qunitJson: '../test/qunit.json',
          baseUrl: 'http://localhost:8000',
        }
      },
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['jshint', 'clean', 'connect', 'webdriver_startup', 'webdriver_qunit:linux']);
  grunt.registerTask('all', ['jshint', 'clean', 'connect', 'webdriver_startup', 'webdriver_qunit:windows']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'clean', 'connect', 'webdriver_startup', 'webdriver_qunit:phantomjs']);

};
