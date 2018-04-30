import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import getControl from 'furnace-forms/utils/get-control';

function dummyFunction() {
	return 'dummyFunction';
}

moduleFor('control:injection','Integration | Injection', {
	integration: true,
	setup() {
		var owner=Ember.getOwner(this);
		owner.factoryFor('initializer:furnace-forms').class.initialize(owner);
		this.register('test:dummyFunction',dummyFunction,{instantiate:false});
		owner.inject('form', 'dummyFunction', 'test:dummyFunction');
	}
});

test('Form injection',function(assert) {
	Ember.run(() => {
		var form = Ember.getOwner(this).lookup('form:form-test');
		assert.ok(form.dummyFunction===dummyFunction,'Form control injection');
	});
});

test('Injection via getControl',function(assert) {
	Ember.run(() => {
		var form = getControl.call(this,'dummy',{ options: {
			_controlType:'form:form-test',
			for:this
		}});
		assert.ok(form.dummyFunction===dummyFunction,'Form control injection');
	});
});