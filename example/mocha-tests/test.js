define([
	'chai'
], function(chai){

	var expect = chai.expect;

	describe('test suite 1', function(){

		it('should work', function(){
			
			//should make it through to command line window.
			console.log(1+1, 'test', {key: 'val',nested:{here:'test'}});

			expect(true).to.equal(true);

		});

	});

});