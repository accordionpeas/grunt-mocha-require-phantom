define([
	'chai'
], function(chai){

	var expect = chai.expect;

	describe('console.log', function(){
		it('should not crash when printing null or undefined values', function(){
			console.log(null);
			console.log(undefined);
		});

		it('should cope with large and recursive data structures by limiting the output', function(){
			var bigObj = {
				1:{2:{3:{4:{5:{6:{7:{8:{9:{10:{11:""}}}}}}}}}},
				2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
				10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 15: 15,
				16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21
			}
			console.log(bigObj);
		});
	});

});
