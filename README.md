# grunt-webdriver-qunit

> run qunit with webdriver

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-webdriver-qunit --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-webdriver-qunit');
```

## The "webdriver_start" task

### Overview
In your project's Gruntfile, add a section named `webdriver_start` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  webdriver_start: {
    options : {
      jar: '<selenium_jar_path>',
      port: '<selenium_port>',
      jvmArgs: '<jvm_args>',
      args: '<java_args>',
      env: '<environment>'
      stdio: '<stdio>'
    }
    },
})
```

### Options

#### options.jar
Type: `String`
Default value: `'node_modules/webdriverjs/bin/selenium-server-standalone-2.31.0.jar'`

The path of selenium server standalone jar.

#### options.port
Type: `Integer`
Default value: `4444`

The port of selenium server standalone.

#### options.jvmArgs
Type: `String`
Default value: `null`

The jvm arguments.

#### options.args
Type: `String`
Default value: `null`

The java arguments.

#### options.env
Type: `String`
Default value: `null`

The environment arguments.

#### options.stdio
Type: `String`
Default value: `null`


## The "webdriver_qunit" task

### Overview
In your project's Gruntfile, add a section named `webdriver_qunit` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  webdriver_qunit: {
    firefox: {
      browserName: '<browser_name>',
      reportsDir: '<reports_directory>',
      qunitJson: '<qunit_config>',
      baseUrl: '<base_url>',
    },
  },
})
```
#### options.browserName
Type: `String`
Default value: `phantomjs`

The browser name, the value is one of phantomjs, chrome, firefix, ie, safari

#### options.reportsDir
Type: `String`
Default value: `target/surefire-reports`

The reports directory.

#### options.qunitJson
Type: `String`
Default value: `null`

The configuration file of qunit.

#### options.baseUrl
Type: `String`
Default value: `null`

The base url of tests.

### Usage Examples

In this example, first start selenium server, then run qunit testing with webdriver. 

```js
grunt.initConfig({
  webdriver_start: {
    options : {
      jar: 'node_modules/webdriverjs/bin/selenium-server-standalone-2.31.0.jar',
      port: '4444',
    }
  },
  webdriver_qunit: {
    phantomjs: {
      options: {
        browserName: 'phantomjs',
        reportsDir: 'target/surefire-reports',
        qunitJson: '../test/qunit.json',
        baseUrl: 'http://localhost:8000',
      }
    },
    chrome: {
      options: {
        browserName: 'chrome',
        reportsDir: 'target/surefire-reports',
        qunitJson: '../test/qunit.json',
        baseUrl: 'http://localhost:8000',
      }
    },
    firefox: {
      options: {
        browserName: 'firefox',
        reportsDir: 'target/surefire-reports',
        qunitJson: '../test/qunit.json',
        baseUrl: 'http://localhost:8000',
      }
    },
  },
  grunt.loadTasks('tasks');
  grunt.registerTask('test', ['webdriver_startup', 'webdriver_qunit']);
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2013-06-29 v0.0.1 initial the first version.