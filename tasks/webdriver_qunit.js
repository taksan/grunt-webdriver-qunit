/*
 * grunt-webdriver-qunit
 * https://github.com/bulain/grunt-webdriver-qunit
 *
 * Copyright (c) 2013 Bulain Peng
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  
  var webdriver = require('selenium-webdriver'),
      remote = require('selenium-webdriver/remote'),
      async = require('async'),
      server;
  
  grunt.registerTask('webdriver_startup', 'startup selenium server standalone', function() {
    grunt.log.writeln('Startup selenium server standalone');
    
    var done = this.async();
    var options = this.options({
      jar: 'node_modules/webdriverjs/bin/selenium-server-standalone-2.31.0.jar',
      port: 4444,
      jvmArgs: null,
      args: null,
      env: null,
      stdio: null
    });
    server = new remote.SeleniumServer(options);
    server.start();
    
    setTimeout(function() {
      done(true);
    }, 10000);
    
  });
  
  grunt.registerTask('webdriver_shutdown', 'Shutdown selenium server standalone', function() {
    grunt.log.writeln('Shutdown selenium server standalone');
    
    var done = this.async();
    server.stop();
    
    setTimeout(function() {
      done(true);
    }, 100);
  });
  
  
  grunt.registerMultiTask('webdriver_qunit', 'Run qunit with webdriver.', function() {
    var options = this.options({
      browserName: 'phantomjs',
      reportsDir : 'target/surefire-reports'
    });
    
    var driver, 
        browserName = options.browserName,
        json = require(options.qunitJson),
        baseUrl = options.baseUrl || json.baseUrl,
        reportsDir = options.reportsDir;

    var testQunit = function(url, reportsDir, callback) {
      grunt.log.writeln('Testing ' + url);
      
      driver.get(url);
      var By = webdriver.By;
      var textContent = '';
      var bool = true;

      async.whilst(function() {
        return textContent.indexOf('completed') < 0;
      }, function(cb) {
        driver.findElement(By.id('qunit-testresult')).getAttribute('textContent').then(function(text) {
          textContent = text;
          cb();
        });
      }, function() {
        driver.findElement(By.id('qunit-xml')).getAttribute('innerHTML').then(function(innerHTML) {
          grunt.log.writeln(textContent);
          var fileName = url.split('/').pop();
          
          var chunk = ''; 
          chunk += '-------------------------------------------------------------------------------\n';
          chunk += 'Test set: ' + url + '\n';
          chunk += '-------------------------------------------------------------------------------\n';
          chunk += textContent;
          
          grunt.file.write(reportsDir + '/TEST-' + browserName + '-' + fileName + '.txt', chunk);
          grunt.file.write(reportsDir + '/TEST-' + browserName + '-' + fileName + '.xml', innerHTML);
        });
        driver.findElement(By.className('failed')).getText().then(function(failed) {
          callback(null, '0' === failed);
        });
      });
    };
    
    var done = this.async();
    
    driver = new webdriver.Builder().usingServer(server.address()).withCapabilities({
      browserName : browserName,
      ignoreProtectedModeSettings: true
    }).build();
    
    async.mapSeries(json.paths, function(path, callback){
      testQunit(baseUrl+path, reportsDir, callback);
    }, function(err, results){
        driver.quit();
        var test = true;
        for(var i in results){
          test = test && results[i];
        }
        setTimeout(function() {
          done(test);
        }, 100);
    });
  });
};
