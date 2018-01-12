import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import lookup from 'furnace-forms/utils/lookup-class';

moduleForComponent('furnace-form', 'Integration | Control | Number', {
	integration: true,
	beforeEach() {
		var owner=Ember.getOwner(this);
		owner.lookup('application:main').set('defaultLocale','en');
		owner.factoryFor('initializer:furnace-forms').class.initialize(owner);
		owner.factoryFor('initializer:furnace-i18n').class.initialize(owner);
		owner.factoryFor('initializer:furnace-validation').class.initialize(owner);
		this.inject.service('store');
	},
});

test('Value matching initial constraints, update matching constraints',function(assert){
	var Class=lookup.call(this,'person');
	var formControl
	Ember.run(() => {
		formControl=Class.create(Ember.getOwner(this).ownerInjection(),{
			'for': this.get('store').createRecord('employee',{
				firstName:'Adrian',
				lastName:'Anderson',
				age:20
			}),
			target: this,
			_rootControl:true
		});
	});
	
	
	assert.equal(formControl.get('age.value'),20,'Control value');
	
	assert.equal(formControl.get('age.isDirty'),false,'Control isDirty');
	
	assert.equal(formControl.get('isDirty'),false,'Form isDirty');
	
	Ember.run(() =>{
		formControl.set('age.value',30);
	});
	
	assert.equal(formControl.get('age.value'),30,'Control value');
	
	assert.equal(formControl.get('age.isDirty'),true,'Control isDirty');
	
	assert.equal(formControl.get('isDirty'),true,'Form isDirty');
});

test('Value matching initial constraints, update unmatching constraints',function(assert){
	var Class=lookup.call(this,'person');
	var formControl
	Ember.run(() => {
		formControl=Class.create(Ember.getOwner(this).ownerInjection(),{
			'for': this.get('store').createRecord('employee',{
				firstName:'Adrian',
				lastName:'Anderson',
				age:20
			}),
			target: this,
			_rootControl:true
		});
	});
	
	
	assert.equal(formControl.get('age.value'),20,'Control value');
	
	assert.equal(formControl.get('age.isDirty'),false,'Control isDirty');
	
	assert.equal(formControl.get('isDirty'),false,'Form isDirty');
	
	Ember.run(() =>{
		formControl.set('age.value',null);
	});
	
	assert.equal(formControl.get('age.value'),0,'Control value');
	
	assert.equal(formControl.get('age.isDirty'),true,'Control isDirty');
	
	assert.equal(formControl.get('isDirty'),true,'Form isDirty');
});

test('Value unmatching initial constraints, update matching constraints',function(assert){
	var Class=lookup.call(this,'person');
	var formControl
	Ember.run(() => {
		formControl=Class.create(Ember.getOwner(this).ownerInjection(),{
			'for': this.get('store').createRecord('employee',{
				firstName:'Adrian',
				lastName:'Anderson',
				age:null
			}),
			target: this,
			_rootControl:true
		});
	});
	
	
	assert.equal(formControl.get('age.value'),0,'Control value');
	
	assert.equal(formControl.get('age.isDirty'),true,'Control isDirty');
	
	assert.equal(formControl.get('isDirty'),true,'Form isDirty');
	
	Ember.run(() =>{
		formControl.set('age.value',1);
	});
	
	assert.equal(formControl.get('age.value'),1,'Control value');
	
	assert.equal(formControl.get('age.isDirty'),true,'Control isDirty');
	
	assert.equal(formControl.get('isDirty'),true,'Form isDirty');
});