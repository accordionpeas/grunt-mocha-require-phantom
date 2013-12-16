require.config({
	paths: {
		chai: '/node_modules/chai/chai'
	}
});

mocha.setup({
    ui: 'bdd'
});

require([
	testPathname
], function(){

	if(window.mochaPhantomJS){
		mochaPhantomJS.run();
	}
	else{
		mocha.run();
	}
	
});