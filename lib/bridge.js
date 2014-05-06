(function(){

	if(window.console && window.console.log){
		var origConsoleLog = window.console.log;
		
		window.console.log = function(){
			var args = [].slice.call(arguments);
			
			for(var i=0; i<args.length; i++){
				sendMessage('log', consoleLog(args[i]));
			}
			
			origConsoleLog.apply(window.console, arguments);
		};
	}
	
	function consoleLog(val){
		if(isObject(val)){
			var str = '{';
			
			for(var attr in val){
			
				var prop = '';
			
				if(isObject(val[attr])){
					prop = consoleLog(val[attr]);
				}
				else{
					prop = getConsoleVal(val[attr]) + ', ';
				}
			
				str += attr + ':' + prop;
			}
			
			str = str.replace(/,\s$/, '');
			str += '}';
			
			return str;
		}
		else{
			return getConsoleVal(val);
		}
	}
	
	function getConsoleVal(val){
		switch(typeof val){
			case 'string':
				return '"' + val + '"';
			default:
				return val.toString();
		}
	}
	
	function isObject(val){
		return typeof val === 'object' && !Array.isArray(val) && val !== null;
	}

    function sendMessage() {
        var args = [].slice.call(arguments);
        if(window.callPhantom){
            //send messages to parent phantom.js process
            alert(JSON.stringify(args));
        }
    }

    //send error messages to phantom.js process
    window.onerror = function(message, url, linenumber){
        sendMessage('error', 'JavaScript error: ' + message + ' on line ' + linenumber + ' for ' + url);
    }

    //create a listener who'll bubble events from Phantomjs to Grunt
    function createGruntListener(ev, runner){
        runner.on(ev, function(test, err){
            var data = {
                err: err
            };

            if(test){
                data.title = test.title;
                data.fullTitle = test.fullTitle();
            }

            sendMessage('mocha.' + ev, data);
        });
    }

    var GruntReporter = function(runner){
        if (!Mocha) {
            throw new Error('Mocha was not found, make sure you include Mocha in your HTML spec file.');
        }

        //setup HTML reporter to output data on the screen
        Mocha.reporters.HTML.call(this, runner);

        //create a Grunt listener for each Mocha events
        var events = [
            'start',
            'test',
            'test end',
            'suite',
            'suite end',
            'fail',
            'pass',
            'pending',
            'end'
        ];

        for(var i=0; i<events.length; i++){
            createGruntListener(events[i], runner);
        }
    }

    mocha.setup({
        reporter: GruntReporter
    });

})();