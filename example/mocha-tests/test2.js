define([
	'chai'
], function(chai){

	var expect = chai.expect;

	describe('async suite', function(){

		it('should work', function(done){

			var xhr = new XMLHttpRequest();

			xhr.onreadystatechange = function(){
				if(xhr.readyState === 4 && xhr.status === 200){
					expect(xhr.responseText).to.equal('test');
					done();
				}
			}

			xhr.open('GET', '/test-route', true);
			xhr.send();
		});

	});

});