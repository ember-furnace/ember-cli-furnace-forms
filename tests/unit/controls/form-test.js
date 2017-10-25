import { test } from 'ember-qunit';
import moduleForControl from '../../helpers/module-for-control';
import Ember from 'ember';
moduleForControl('form:form-test','Unit | Control | Form', {

});

test('Model name', function(assert) {
	var control=null;
	Ember.run(() => {
		control=this.subject({
			_rootControl:true
		});
	});
	assert.ok(control,'Control created');
	var model=this.testModel();
	control.set('for',model);
	
	assert.equal(control.get('modelName'),'test','Model name');

});
