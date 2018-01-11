import { test } from 'qunit';
import moduleForAcceptance from '../../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | Options | Double refresh');
	
test("Test renders", function(assert) {
	visit('/acceptance/options/double-refresh').then(function() {
		assert.ok(find('control.test').length===1,'Renders');
		
	});
});