import Ember from "ember";
import { module, test } from 'qunit';
import moduleForAcceptance from '../../helpers/module-for-acceptance';
import wait from 'ember-test-helpers/wait';

moduleForAcceptance('Acceptance | Conditions | Stacked panels');
	
test("Test flow", function(assert) {
	visit('/conditions/stacked').then(function() {
		assert.ok(find('.input1.disabled').length===0,'Input 1 enabled');
		assert.ok(find('.input1.invalid').length===1,'Input 1 invalid');
		assert.ok(find('.panel2.disabled').length===1,'Panel 2 disabled');
		assert.ok(find('.panel3.disabled').length===1,'Panel 3 disabled');
		assert.ok(find('.panel1Confirm.disabled'),'Confirm 1 disabled');
		fillIn('.input1 input','1');
		andThen(() => {
			assert.ok(find('.input1.disabled').length===0,'Input 1 enabled');
			assert.ok(find('.input1.invalid').length===0,'Input 1 valid');
			assert.ok(find('.panel1Confirm.disabled').length===0,'Confirm 1 enabled');
			click('.panel1Confirm button');
		});
		andThen(() => {
			assert.ok(find('.input1.disabled').length===1,'Input 1 disabled');
			assert.ok(find('.input1.invalid').length===0,'Input 1 valid');
			assert.ok(find('.panel1Confirm.disabled').length===1,'Confirm 1 disabled');
	
			assert.ok(find('.input2.disabled').length===0,'Input 2 enabled');
			assert.ok(find('.input2.invalid').length===1,'Input 2 invalid');
			assert.ok(find('.panel2Confirm.disabled'),'Confirm 2 disabled');

			fillIn('.input2 input','1');
		});
		andThen(() => {
			assert.ok(find('.input2.disabled').length===0,'Input 2 enabled');
			assert.ok(find('.input2.invalid').length===0,'Input 2 valid');
			assert.ok(find('.panel2Confirm.disabled').length===0,'Confirm 2 enabled');
			click('.panel2Confirm button');
		});
		andThen(() => {
			assert.ok(find('.input2.disabled').length===1,'Input 2 disabled');
			assert.ok(find('.input2.invalid').length===0,'Input 2 valid');
			assert.ok(find('.panel2Confirm.disabled').length===1,'Confirm 2 disabled');
	
			assert.ok(find('.input3.disabled').length===0,'Input 3 enabled');
			assert.ok(find('.input3.invalid').length===1,'Input 3 invalid');
			assert.ok(find('.finish.disabled'),'Finish disabled');

			fillIn('.input3 input','1');
		});
		andThen(() => {
			assert.ok(find('.input3.disabled').length===0,'Input 3 enabled');
			assert.ok(find('.input3.invalid').length===0,'Input3 valid');
			assert.ok(find('.finish.disabled').length===0,'Finish enabled');
			click('.finish button');
			return wait();
		});
		andThen(() => {
			assert.ok(find('.input1.disabled').length===0,'Input 1 enabled');
			assert.ok(find('.input1.invalid').length===1,'Input 1 invalid');
			assert.ok(find('.panel1Confirm.disabled'),'Confirm 1 disabled');
			
			assert.ok(find('.panel2.disabled').length===1,'Panel 2 disabled');
			assert.ok(find('.panel3.disabled').length===1,'Panel 3 disabled');
		});
	});
});