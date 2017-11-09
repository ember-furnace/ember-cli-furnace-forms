import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import FormTest from 'dummy/forms/form-test';

moduleFor('form:-lookup','Integration | Utils | Lookup', {
	integration: true,
	setup() {
		var owner=Ember.getOwner(this);
		owner.factoryFor('initializer:furnace-forms').class.initialize(owner);
	}
});

test('Lookup',function(assert) {
	var object,formClass,formInstance,method;

	object=Ember.Object.create(Ember.getOwner(this).ownerInjection());
	
	method=Ember.getOwner(this).lookup('form:-lookup');
	
	assert.ok(typeof method ==='function','Lookup registered');
	
	assert.ok(formClass=method.call(object,'form-test'),'Get FormTest form');
	
	Ember.run(()=>{
		formInstance=formClass.create();
	});
	
	assert.ok(formInstance instanceof FormTest,'Got FormTest form');
	
	var orgAssert=Ember.assert;
	
	var didAssert=false;
	
	Ember.assert=function() {
		didAssert=true;
	}
	
	formClass=method.call(object,'no-such-form-test');
	
	assert.ok(!formClass,'No form');
	
	assert.ok(didAssert,'Asserted');
	
	Ember.assert=orgAssert;
});