import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import getName from 'furnace-forms/utils/get-name';

moduleFor('form:get-name','Integration | Utils | Get-name', {
	integration: true,
	setup() {
		var owner=Ember.getOwner(this);
		owner.factoryFor('initializer:furnace-forms').class.initialize(owner);
	}
});

test('Get controller name',function(assert) {
	
	var controller=Ember.getOwner(this).lookup('controller:dummy');
	
	assert.equal(getName(controller),'dummy');

	
});