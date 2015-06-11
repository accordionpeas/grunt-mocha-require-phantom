/*
 * grunt-mocha-require-phantom
 * https://github.com/accordionpeas/grunt-mocha-require-phantom
 *
 */

module.exports = function(grunt) {

	'use strict';

	var fs = require('fs'),
		path = require('path'),
		colors = require('colors'),
		express = require('express'),
		server = express(),
		phantomjs = require('grunt-lib-phantomjs').init(grunt);

	grunt.registerMultiTask('mocha_require_phantom', 'Grunt plugin for testing requireJS code using mocha in phantomJS and regular browsers', function() {

		colors.setTheme({
			title: 'white',
			info: 'green',
			data: 'grey',
			error: 'red',
			warn: 'yellow',
			log: 'cyan'
		});

		var options = this.options({
				base: '',
				main: 'test-bootstrap',
				requireLib: 'require.js',
                files: [],
				port: 3000,
				keepAlive: false,
				mainAttr: 'data-main',
				router: null
			}),
			tempDirectory = 'tmp',
			done = this.async(),
			files = [],
			count = 0,
			errorCount = 0,
			passCount = 0,
			suiteLevel = 0;

		var cmdOptFiles = grunt.option('files');

		if(cmdOptFiles){
			cmdOptFiles = cmdOptFiles.split(',');
			for(var i=0; i<cmdOptFiles.length; i++){
				files.push(options.base + '/' + cmdOptFiles[i]);
			}
		}
		else{
			files = grunt.file.expand(options.base + '/' + options.files);
		}

		if(options.router){
			options.router(server);
		}

		var basePath = options.base,
			main = basePath + '/' + options.main,
			requireLib = basePath + '/' + options.requireLib,
			scriptRef = '<scr'+'ipt ' + options.mainAttr + '="/' + main + '" src="/' + requireLib + '"></scr'+'ipt>';


		function launchServer(){
			server.use(express.static(path.resolve('.')));

			var regex = new RegExp('/' + basePath + '/[.]*');

			server.get(regex, function(req, res){
				var url = req.url.substr(1);
				if(url.indexOf('.') === -1){
					copyFiles();
					writeBootstrap(url);
					res.end(grunt.file.read(tempDirectory + '/index.html', {
						encoding: 'utf8'
					}));
				}
			});

			server.listen(options.port);
		}

		function writeBootstrap(file){
			var scriptInc = 'var testPathname = "' + file.replace('.js', '') + '";';

			grunt.file.write(tempDirectory + '/include.js', scriptInc + '\ndocument.write(\'' + scriptRef + '\');', {
				encoding: 'utf8'
			});
		}

		function spawn(){
			var file = files[count];

			grunt.log.writeln('\n\nTesting: ' + file);

			writeBootstrap(file);

			phantomjs.spawn('http://localhost:' + options.port + '/' + tempDirectory + '/index.html', {
				options: {},
				done: function(err) {
					count++;

					if(count === files.length){
						if(errorCount > 0){
							grunt.fail.warn(errorCount + ' tests failed');
						}
						clean();

						//will keep server running forever - good times!
						if(!options.keepAlive){
							done(err || errorCount === 0);
						}
					}
					else{
						spawn();
					}
				}
			});

		}

		function bindPhantomListeners(){
			phantomjs.on('mocha.*', function(msg){

				var name, fullTitle, slow, err,
				evt = this.event.replace('mocha.', '');

				if(evt === 'suite'){
					var title = msg.title;
					if(title){
						writeIndented(title, suiteLevel);
						suiteLevel++;
					}
					passCount = 0;
				}
				else if(evt === 'fail'){
					writeIndented(msg.title.error, suiteLevel);
					writeIndented(msg.err.message.warn, suiteLevel);
					errorCount++;
				}
				else if(evt === 'pass'){
					writeIndented(msg.title.data, suiteLevel);
					passCount++;
				}
				else if(evt === 'suite end'){
					if(msg.title){
						writeIndented(passCount + ' passed'.info, --suiteLevel);
					}
				}
				else if (evt === 'end'){
					phantomjs.halt();
				}

			});

			phantomjs.on('log', function(msg){
				console.log(msg.log);
			});
			
			phantomjs.on('error', function(msg){
				grunt.fail.warn(msg);
			});

			// Built-in error handlers.
			phantomjs.on('fail.load', function(url) {
				phantomjs.halt();
				grunt.warn('PhantomJS unable to load URL.');
			});

			phantomjs.on('fail.timeout', function() {
				phantomjs.halt();
				grunt.warn('PhantomJS timed out.');
			});
		}

		function clean(){
			grunt.file.delete(tempDirectory);
		}

		function writeIndented(msg, tabLevel){
			var tab = '';
			for(var i=0; i<tabLevel; i++){
				tab += '  ';
			}
			grunt.log.writeln(tab + msg);
		}

		function copyFiles(){
			var html = fs.readFileSync(__dirname + '/../lib/index.html', 'utf8'),
				mochaJS = fs.readFileSync(__dirname + '/../node_modules/mocha/mocha.js', 'utf8'),
				mochaCSS = fs.readFileSync(__dirname + '/../node_modules/mocha/mocha.css', 'utf8'),
				bridge = fs.readFileSync(__dirname + '/../lib/bridge.js', 'utf8');

			grunt.file.write(tempDirectory + '/index.html', html, {
				encoding: 'utf8'
			});
			grunt.file.write(tempDirectory + '/mocha.css', mochaCSS, {
				encoding: 'utf8'
			});
			grunt.file.write(tempDirectory + '/mocha.js', mochaJS, {
				encoding: 'utf8'
			});
			grunt.file.write(tempDirectory + '/bridge.js', bridge, {
				encoding: 'utf8'
			});
		}

		if(files.length){
			launchServer();
			if(!options.keepAlive){
				copyFiles();
				bindPhantomListeners();
				spawn();
			}
		}
		else{
			//no files to test.
			grunt.fail.warn('no test files were found.');
			done();
		}
	});

};

