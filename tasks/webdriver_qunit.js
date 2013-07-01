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
    var done = this.async();
    var options = this.options({
      jar: __dirname + '/../node_modules/webdriverjs/bin/selenium-server-standalone-2.31.0.jar',
      port: 4444,
      jvmArgs: null,
      args: null,
      env: null,
      stdio: null
    });
    
    grunt.log.writeln('Startup selenium server standalone at 0.0.0.0:' + options.port);
    
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
        defaultWaitSeconds = json.waitSeconds,
        reportsDir = options.reportsDir;

    var testQunit = function(test, callback) {
      grunt.log.writeln('Testing ' + baseUrl + test.path);
      
      driver.get(baseUrl + test.path);
      var By = webdriver.By,
          textContent = '',
          count = 0,
          waitSeconds = test.waitSeconds || defaultWaitSeconds;

      async.whilst(function() {
        return count < waitSeconds && textContent.indexOf('completed') < 0;
      }, function(cb) {
        driver.findElement(By.id('qunit-testresult')).getAttribute('textContent').then(function(text) {
          textContent = text;
          count++;
          setTimeout(cb, 1000);
        });
      }, function() {
        driver.findElement(By.id('qunit-xml')).getAttribute('innerHTML').then(function(innerHTML) {
          grunt.log.writeln(textContent);
          var fileName = test.path.split('/').pop();
          
          var chunk = ''; 
          chunk += '-------------------------------------------------------------------------------\n';
          chunk += 'Test set: ' +  baseUrl + test.path + '\n';
          chunk += '-------------------------------------------------------------------------------\n';
          chunk += textContent;
          
          grunt.file.write(reportsDir + '/TEST-' + browserName + '-' + fileName + '.txt', chunk);
          grunt.file.write(reportsDir + '/TEST-' + browserName + '-' + fileName + '.xml', innerHTML);
        }).then(function(){
          return driver.findElement(By.className('failed')).getText();
        }).then(function(failed) {
          callback(null, '0' === failed);
        }).then(null, function(e) {
          callback(null, false);
        });
      });
    };
    
    var done = this.async();
    
    driver = new webdriver.Builder().usingServer(server.address()).withCapabilities({
      browserName : browserName,
      ignoreProtectedModeSettings: true
    }).build();
    
    async.mapSeries(json.tests, function(test, callback){
      testQunit(test, callback);
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
