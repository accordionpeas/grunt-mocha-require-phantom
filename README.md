# grunt-mocha-require-phantom

> Grunt plugin for testing requireJS code using mocha in phantomJS and regular browsers

The purpose of this grunt plugin is as follows:
- To provide a simple structure for writing unit tests for requireJS applications without duplicating the runner HTML.
- To allow for automated running of unit tests using phantomJS.
- To provide easy switch to manually run unit tests in a regular browser (because sometimes you just need to debug using a browser console).

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-mocha-require-phantom --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-mocha-require-phantom');
```

## The "mocha_require_phantom" task

### Overview
In your project's Gruntfile, add a section named `mocha_require_phantom` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  mocha_require_phantom: {
    options: {
      base: 'some/path/to/script',
      main: 'test-bootstrap',
      requireLib: 'libs/require.js',
      files: ['tests/**/*.js'],
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.base
Type: `String`
Default value: `' '`

Path to where your script files are within your project. Assumes that all source, libraries and test script files are within this directory.

#### options.main
Type: `String`
Default value: `'test-bootstrap'`

The path to your test bootstrap file that will be specified in requireJS's _data-main_ attribute.

#### options.mainAttr
Type: `String`
Default value: `data-main`

The attribute appended to the script tag that specifies the module defined in _options.main_.

#### options.requireLib
Type: `String`
Default value: `'require.js'`

The path to the requireJS library within your application.

#### options.files
Type: `Array`
Default value: `[]`

An array of paths to your test files.

#### options.port
Type: `Number`
Default value: `3000`

#### options.router
Type: `Function`
Default value: `null`

A function that takes the instace of Express as a parameter. This can be used to define routes etc if your tests require back-end interaction. See example for more info.

#### options.keepAlive
Type: `Boolean`
Default value: `false`

Setting this option to true will keep the server alive and the task will never complete. The purpose of this is to allow you to debug your unit tests within a browser environment if necessary (sometimes you just need a browser's dev tools).

### Command line Options

#### files

Comma-separated list of files to test relative to the "base" option. If this option is passed in then the list of files will take precedence over the files passed in via the GruntFile.js.

### Test bootstrap file
This file is used to kick off your test code. You should do any requireJS and Mocha configuration in this file. e.g.

```js
require.config({
  paths: {
    chai: '/node_modules/chai/chai'
  }
});

mocha.setup({
    ui: 'bdd'
});
```

### Test file path name
Within your bootstrap file you will need to use requireJS to load your unit tests and execute Mocha. To do this a global var named _testPathname_ is made available and should be used like so:

```js
require([
  //require other modules from your application if necessary here,
  testPathname
], function(){

  if(window.mochaPhantomJS){
    mochaPhantomJS.run();
  }
  else{
    mocha.run();
  }
  
});
```

### Test files
You do not need to create any HTML runner files. Simply create an AMD module that runs your test like so:

```js
define([
  'chai',
  //define application modules to be tested here
], function(chai){

  var expect = chai.expect;

  describe('test suite 1', function(){

    it('should work', function(){

      expect(true).to.equal(true);

    });

  });

});
```

### Browser testing
The main purpose of this plugin is to provide automated testing via phantomJS. However, you can manually run tests in regular browsers also - sometimes this is necessary for debugging. To do so you need to

- set the _keepAlive_ option to _true_.
- load up your favourite browser and enter the following url: http://localhost:3000/path/to/test-file

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2015-11-17  v0.7.1  Only hijack console.log when running in PhantomJS.
* 2015-11-09  v0.7.0  Bumped grunt-lib-phantomjs to v0.7.x.
* 2015-10-08  v0.6.2  Support for NPM 3 flattened node_modules.
* 2015-06-25  v0.6.1  Don't fail the task if no test files are found.
* 2015-06-17  v0.6.0  List all error files at the end of task.
* 2015-06-16  v0.5.1  Allow other routes to be matched if test file not found.
* 2015-06-11  v0.5.0  Router can now be passed in as a function to provide back-end routes for testing.
* 2015-02-04  v0.4.0  Main attribute can be specified as an option.
* 2014-06-05  v0.3.1  Only serve test runner page if request begins with base option.
* 2014-05-23  v0.3.0  Specific test files can now be passed in via command line options.
* 2014-05-12  v0.2.2  Bumped version after merged pull request that fixes issues with passing console.log statements through to command line.
* 2014-05-12  v0.2.0  console.log statements now make it through from phantomJS to command line.
* 2014-05-06  v0.2.1  Bumped version after merged pull request that uses Chai's built in expect messages. Changed console.log output to be comma-separated on one line.
* 2014-05-05  v0.1.5  Amended docs.
* 2014-05-05  v0.1.4  Fixed broken example by adding require's baseUrl config option.
* 2014-02-10  v0.1.3  Normalised server requests between automated and manual tests.
* 2013-12-17  v0.1.2  Don't run tests in PhantomJS if keepAlive set to true to stop task failing.
* 2013-12-17  v0.1.1  Copy mocha JS and CSS files to temp directory to fix issues.
* 2013-12-17  v0.1.0  Initial release.
