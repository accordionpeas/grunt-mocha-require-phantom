(function(){

    function sendMessage() {
        var args = [].slice.call(arguments);
        if(window.callPhantom){
            //send messages to parent phantom.js process
            alert(JSON.stringify(args));
        }
        else{
            console.log(args);
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