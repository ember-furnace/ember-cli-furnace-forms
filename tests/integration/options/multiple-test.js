import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import Forms from 'furnace-forms';
import wait from 'ember-test-helpers/wait';

var person1;
var person2;
var company1;
var company2;
var friends1=[];
var friends2=[];
var MultipleStaticOptionsForm=Forms.Form.extend({
	friends:Forms.input('checklist').options(Forms.option('a','a'),Forms.option('b','b'),Forms.option('c','c')).multiple(),

	validator:null
}).model('person');

function getTestOptions(model,options) {
	var friends;
	switch(model) {
		case person1:
		case company1:
			friends=friends1;
			break;
		case person2:
		case company2:
			friends=friends2;
			break;
		default:
			friends=[];
			break;
	}
	friends.forEach((friend)=>{
		options.push(Forms.option(friend,friend.get('firstName')));
	});
	return options;
}

function getAttributeTestOptions(model,options) {
	var friends;
	switch(model.get('optionsToggle')) {
		case false:
			friends=friends1;
			break;
		case true:
			friends=friends2;
			break;
		default:
			friends=[];
			break;
	}
	friends.forEach((friend)=>{
		options.push(Forms.option(friend,friend.get('firstName')));
	});
	return options;
}

var MultipleDynamicOptionsForm=Forms.Form.extend({
	friends:Forms.input('checklist').options(function(options){
		return getTestOptions(this.getModel(),options);
	}).multiple(),
	
	validator:null
}).model('person');

var MultiplePromiseOptionsForm=Forms.Form.extend({
	friends:Forms.input('checklist').options(function(options) {
		return new Ember.RSVP.Promise((resolve)=>{
			resolve(getTestOptions(this.getModel(),options));
		});
	}).multiple(),
	validator:null
}).model('person');

var MultipleAttributeDynamicOptionsForm=Forms.Form.extend({
	friends:Forms.input('checklist').options(function(options){
		return getAttributeTestOptions(this.getModel(),options);
	}).multiple().on('optionsToggle'),
	optionsToggle:Forms.attr('optionsToggle'),
	validator:null
}).model('person');

var MultipleAttributePromiseOptionsForm=Forms.Form.extend({
	friends:Forms.input('checklist').options(function(options) {
		return new Ember.RSVP.Promise((resolve)=>{
			resolve(getAttributeTestOptions(this.getModel(),options));
		});
	}).multiple().on('optionsToggle'),
	optionsToggle:Forms.attr('optionsToggle'),
	validator:null
}).model('person');

moduleForComponent('furnace-form', 'Integration | Options | Multiple', {
	integration: true,
	beforeEach() {
		var owner=Ember.getOwner(this);
		owner.lookup('application:main').set('defaultLocale','en');
		owner.factoryFor('initializer:furnace-forms').class.initialize(owner);
		owner.factoryFor('initializer:furnace-i18n').class.initialize(owner);
		owner.factoryFor('initializer:furnace-validation').class.initialize(owner);
		owner.factoryFor('instance-initializer:furnace-i18n').class.initialize(owner);
		this.register('form:multiple-static-options',MultipleStaticOptionsForm)
		this.register('form:multiple-dynamic-options',MultipleDynamicOptionsForm)
		this.register('form:multiple-promise-options',MultiplePromiseOptionsForm)
		this.inject.service('store');
		friends1=[];
		friends2=[];
		friends1.push(this.get('store').createRecord('person',{
			firstName:'Chris',
		}));
		friends1.push(this.get('store').createRecord('person',{
			firstName:'David',
		}));
		friends1.push(this.get('store').createRecord('person',{
			firstName:'Eddy',
		}));
		friends2.push(this.get('store').createRecord('person',{
			firstName:'Garry',
		}));
		friends2.push(this.get('store').createRecord('person',{
			firstName:'Harry',
		}));
		friends2.push(this.get('store').createRecord('person',{
			firstName:'Ian',
		}));
		friends2.push(this.get('store').createRecord('employee',{
			firstName:'John',
		}));
		person1=this.get('store').createRecord('person',{
			firstName:'Adrian',
			optionsToggle:false,
			friends:friends1.slice(0,1)
		});
		person2=this.get('store').createRecord('person',{
			firstName:'Brian',
			optionsToggle:false,
			friends:friends2.slice(0,2)
		});
		company1=this.get('store').createRecord('company',{
			firstName:'TestCorp Inc',
			optionsToggle:false,
			friends:friends1.slice(0,1)
		});
		company2=this.get('store').createRecord('company',{
			firstName:'Testing Ltd',
			optionsToggle:false,
			friends:friends2.slice(0,2)
		});
	},
	testModel() {
		return person1;
	}
});

test('MultipleStaticOptionsForm renders', function(assert) {

	this.set('model',this.testModel());
	
	this.render(hbs`{{furnace-form 'multiple-static-options' for=model}}`);

	assert.ok(this.$('form[type=MultipleStaticOptions]').length===1,'Form renders');

	assert.ok(this.$('form[type=MultipleStaticOptions] > controls > control.friends').length===1,'List renders');
	
	assert.ok(this.$('form[type=MultipleStaticOptions] > controls > control.friends > options > control').length===3,'List contains 3 controls');
	
});

test('MultipleDynamicOptionsForm renders', function(assert) {

	this.set('model',this.testModel());
	
	this.render(hbs`{{furnace-form 'multiple-dynamic-options' for=model}}`);

	assert.ok(this.$('form[type=MultipleDynamicOptions]').length===1,'Form renders');

	assert.ok(this.$('form[type=MultipleDynamicOptions] > controls > control.friends').length===1,'List renders');

	return wait().then(()=>{
		assert.ok(this.$('form[type=MultipleDynamicOptions] > controls > control.friends > options > control').length===3,'List contains 3 controls');
	});
});

test('MultiplePromiseOptionsForm renders', function(assert) {

	this.set('model',this.testModel());
	
	this.render(hbs`{{furnace-form 'multiple-promise-options' for=model}}`);

	assert.ok(this.$('form[type=MultiplePromiseOptions]').length===1,'Form renders');

	assert.ok(this.$('form[type=MultiplePromiseOptions] > controls > control.friends').length===1,'List renders');

	return wait().then(()=>{
		Ember.run(() => {
			assert.ok(this.$('form[type=MultiplePromiseOptions] > controls > control.friends > options > control').length===3,'List contains 3 controls');
		});
		return wait().then(()=>{
			Ember.run(() => {
				assert.ok(this.$('form[type=MultiplePromiseOptions] > controls > control.friends > options > control').length===3,'List contains 3 controls');
			});
		});
	});
});

test('Model update - Async attribute - Model based promise options',function(assert){
	var formControl,optionControls;
	
	Ember.run(() => {
		formControl=MultiplePromiseOptionsForm.create(Ember.getOwner(this).ownerInjection(),{
			'for': person1,
			target: this,
			_rootControl:true
		});
	});

	Ember.run(()=>{
		// Trigger control load, don't get the option controls yet
		// Options won't be ready and the reload occurs in the computed property
		formControl.get('friends');
	});
	
	return wait().then(()=> {
		Ember.run(()=>{
			optionControls=formControl.get('friends.optionControls');
			
			assert.equal(optionControls.length,3,'3 optionControls');
			
			assert.equal(Ember.compare(person1.get('friends').toArray(),friends1.slice(0,1)),0,'Person1 friend');

			assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');

			assert.equal(optionControls[1].get('selected'),false,'OptionControl1 not selected');
			
			assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
		});
		
		Ember.run(()=>{
			formControl.set('for',person2);
		});
		
		Ember.run(()=>{
			optionControls=formControl.get('friends.optionControls');
		});
		
		Ember.run(()=>{
			assert.equal(optionControls.length,4,'4 optionControls');
			
			assert.equal(Ember.compare(person2.get('friends').toArray(),friends2.slice(0,2)),0,'Person 2 friends');
			
			assert.notEqual(Ember.compare(person2.get('friends').toArray(),friends1.slice(0,1)),0,'Not person 1 friends');
			
			assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');

			assert.equal(optionControls[1].get('selected'),true,'OptionControl1 selected');

			assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
			
			assert.equal(optionControls[3].get('selected'),false,'OptionControl3 not selected');
		});
	});
});

test('Model update - Synced attribute - Model based promise options',function(assert){
	var formControl,optionControls;
	
	Ember.run(() => {
		formControl=MultiplePromiseOptionsForm.create(Ember.getOwner(this).ownerInjection(),{
			'for': company1,
			target: this,
			_rootControl:true
		});
	});

	Ember.run(()=>{
		// Trigger control load, don't get the option controls yet
		// Options won't be ready and the reload occurs in the computed property
		formControl.get('friends');
	});
	
	return wait().then(()=> {
		Ember.run(()=>{
			optionControls=formControl.get('friends.optionControls');
			
			assert.equal(optionControls.length,3,'3 optionControls');
			
			assert.equal(Ember.compare(person1.get('friends').toArray(),friends1.slice(0,1)),0,'Person1 friend');

			assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');

			assert.equal(optionControls[1].get('selected'),false,'OptionControl1 not selected');
			
			assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
		});
		
		Ember.run(()=>{
			formControl.set('for',company2);
		});
		
		Ember.run(()=>{
			optionControls=formControl.get('friends.optionControls');
		});
		
		Ember.run(()=>{
			assert.equal(optionControls.length,4,'4 optionControls');
			
			assert.equal(Ember.compare(company2.get('friends').toArray(),friends2.slice(0,2)),0,'Person 2 friends');
			
			assert.notEqual(Ember.compare(company2.get('friends').toArray(),friends1.slice(0,1)),0,'Not person 1 friends');
			
			assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');

			assert.equal(optionControls[1].get('selected'),true,'OptionControl1 selected');

			assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
			
			assert.equal(optionControls[3].get('selected'),false,'OptionControl3 not selected');
		});
	});
});

test('Attribute update - Async attribute - Model based promise options',function(assert){
	var formControl,optionControls;
	Ember.run(() => {
		formControl=MultiplePromiseOptionsForm.create(Ember.getOwner(this).ownerInjection(),{
			'for': person1,
			target: this,
			_rootControl:true
		});
	});
	
	Ember.run(()=>{
		// Trigger control load, don't get the option controls yet
		// Options won't be ready and the reload occurs in the computed property
		formControl.get('friends');
	});
	
	return wait().then(()=> {
		Ember.run(()=>{
			optionControls=formControl.get('friends.optionControls');
			assert.equal(optionControls.length,3,'3 optionControls');
			
			assert.equal(Ember.compare(person1.get('friends').toArray(),friends1.slice(0,1)),0,'Person1 friend');
	
			assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');
	
			assert.equal(optionControls[1].get('selected'),false,'OptionControl1 not selected');
			
			assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
		});
		
		Ember.run(()=>{
			person1.get('friends').pushObject(friends1.objectAt(1));
		});
		
		Ember.run(()=>{
			assert.equal(optionControls.length,3,'3 optionControls');
			
			assert.equal(Ember.compare(person1.get('friends').toArray(),friends1.slice(0,2)),0,'Person1 friend');
	
			assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');
	
			assert.equal(optionControls[1].get('selected'),true,'OptionControl1 selected');
			
			assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
		});
	});
});

test('Attribute update - Synced attribute - Model based promise options',function(assert){
	var formControl,optionControls;
	Ember.run(() => {
		formControl=MultiplePromiseOptionsForm.create(Ember.getOwner(this).ownerInjection(),{
			'for': company1,
			target: this,
			_rootControl:true
		});
	});
	
	Ember.run(()=>{
		// Trigger control load, don't get the option controls yet
		// Options won't be ready and the reload occurs in the computed property
		formControl.get('friends');
	});
	
	return wait().then(()=> {
		Ember.run(()=>{
			optionControls=formControl.get('friends.optionControls');
			assert.equal(optionControls.length,3,'3 optionControls');
			
			assert.equal(Ember.compare(company1.get('friends').toArray(),friends1.slice(0,1)),0,'Person1 friend');
	
			assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');
	
			assert.equal(optionControls[1].get('selected'),false,'OptionControl1 not selected');
			
			assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
		});
		
		Ember.run(()=>{
			company1.get('friends').pushObject(friends1.objectAt(1));
		});
		
		Ember.run(()=>{
			assert.equal(optionControls.length,3,'3 optionControls');
			
			assert.equal(Ember.compare(company1.get('friends').toArray(),friends1.slice(0,2)),0,'Person1 friend');
	
			assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');
	
			assert.equal(optionControls[1].get('selected'),true,'OptionControl1 selected');
			
			assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
		});
	});
});

test('Attribute update - Attribute based promise options',function(assert){
	var formControl,optionControls;
	
	Ember.run(() => {
		formControl=MultipleAttributePromiseOptionsForm.create(Ember.getOwner(this).ownerInjection(),{
			'for': person1,
			target: this,
			_rootControl:true
		});
	});

	Ember.run(()=>{
		// Trigger control load, don't get the option controls yet
		// Options won't be ready and the reload occurs in the computed property
		formControl.get('friends');
	});
	
	return wait().then(()=> {
		Ember.run(()=>{
			optionControls=formControl.get('friends.optionControls');
			
			assert.equal(optionControls.length,3,'3 optionControls');
			
			assert.equal(Ember.compare(person1.get('friends').toArray(),friends1.slice(0,1)),0,'Person1 friend');

			assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');

			assert.equal(optionControls[1].get('selected'),false,'OptionControl1 not selected');
			
			assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
		});
		
		Ember.run(()=>{
			formControl.set('for.optionsToggle',true);
		});
		return wait().then(()=> {
			
			Ember.run(()=>{
				optionControls=formControl.get('friends.optionControls');
			});
			
			Ember.run(()=>{
				assert.equal(optionControls.length,4,'4 optionControls');
				
				assert.equal(Ember.compare(person1.get('friends').toArray(),friends1.slice(0,1)),0,'Person 1 friends');
				
				assert.equal(optionControls[0].get('selected'),false,'OptionControl0 not selected');
	
				assert.equal(optionControls[1].get('selected'),false,'OptionControl1 not selected');
	
				assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
				
				assert.equal(optionControls[3].get('selected'),false,'OptionControl3 not selected');
			});
		});
	});
});

test('Model update - Async attribute - Model based options',function(assert){
	var formControl,optionControls;
	
	Ember.run(() => {
		formControl=MultipleDynamicOptionsForm.create(Ember.getOwner(this).ownerInjection(),{
			'for': person1,
			target: this,
			_rootControl:true
		});
	});
	
	Ember.run(()=>{
		optionControls=formControl.get('friends.optionControls');
	});
	
	Ember.run(()=>{
		assert.equal(optionControls.length,3,'3 optionControls');
		
		assert.equal(Ember.compare(person1.get('friends').toArray(),friends1.slice(0,1)),0,'Person1 friend');

		assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');

		assert.equal(optionControls[1].get('selected'),false,'OptionControl1 not selected');
		
		assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
	});
	
	Ember.run(()=>{
		formControl.set('for',person2);
	});
	
	Ember.run(()=>{
		optionControls=formControl.get('friends.optionControls');
	});
	
	Ember.run(()=>{
		assert.equal(optionControls.length,4,'4 optionControls');
		
		assert.equal(Ember.compare(person2.get('friends').toArray(),friends2.slice(0,2)),0,'Person 2 friends');
		
		assert.notEqual(Ember.compare(person2.get('friends').toArray(),friends1.slice(0,1)),0,'Not person 1 friends');
		
		assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');

		assert.equal(optionControls[1].get('selected'),true,'OptionControl1 selected');

		assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
		
		assert.equal(optionControls[3].get('selected'),false,'OptionControl3 not selected');
	});
	
});

test('Model update - Synced attribute - Model based options',function(assert){
	var formControl,optionControls;
	
	Ember.run(() => {
		formControl=MultipleDynamicOptionsForm.create(Ember.getOwner(this).ownerInjection(),{
			'for': company1,
			target: this,
			_rootControl:true
		});
	});
	
	Ember.run(()=>{
		optionControls=formControl.get('friends.optionControls');
	});
	
	Ember.run(()=>{
		assert.equal(optionControls.length,3,'3 optionControls');
		
		assert.equal(Ember.compare(company1.get('friends').toArray(),friends1.slice(0,1)),0,'Person1 friend');

		assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');

		assert.equal(optionControls[1].get('selected'),false,'OptionControl1 not selected');
		
		assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
	});
	
	Ember.run(()=>{
		formControl.set('for',company2);
	});
	
	Ember.run(()=>{
		optionControls=formControl.get('friends.optionControls');
	});
	
	Ember.run(()=>{
		assert.equal(optionControls.length,4,'4 optionControls');
		
		assert.equal(Ember.compare(company2.get('friends').toArray(),friends2.slice(0,2)),0,'Person 2 friends');
		
		assert.notEqual(Ember.compare(company2.get('friends').toArray(),friends1.slice(0,1)),0,'Not person 1 friends');
		
		assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');

		assert.equal(optionControls[1].get('selected'),true,'OptionControl1 selected');

		assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
		
		assert.equal(optionControls[3].get('selected'),false,'OptionControl3 not selected');
	});
});

test('Attribute update - Async attribute - Model based options',function(assert){
	var formControl,optionControls;
	Ember.run(() => {
		formControl=MultipleDynamicOptionsForm.create(Ember.getOwner(this).ownerInjection(),{
			'for': person1,
			target: this,
			_rootControl:true
		});
	});
	
	Ember.run(()=>{
		optionControls=formControl.get('friends.optionControls');
	});
	
	Ember.run(()=>{
		assert.equal(optionControls.length,3,'3 optionControls');
		
		assert.equal(Ember.compare(person1.get('friends').toArray(),friends1.slice(0,1)),0,'Person1 friend');

		assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');

		assert.equal(optionControls[1].get('selected'),false,'OptionControl1 not selected');
		
		assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
	});
	
	Ember.run(()=>{
		person1.get('friends').pushObject(friends1.objectAt(1));
	});
	
	Ember.run(()=>{
		assert.equal(optionControls.length,3,'3 optionControls');
		
		assert.equal(Ember.compare(person1.get('friends').toArray(),friends1.slice(0,2)),0,'Person1 friend');

		assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');

		assert.equal(optionControls[1].get('selected'),true,'OptionControl1 selected');
		
		assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
	});
});

test('Attribute update - Synced attribute - Model based options',function(assert){
	var formControl,optionControls;
	Ember.run(() => {
		formControl=MultipleDynamicOptionsForm.create(Ember.getOwner(this).ownerInjection(),{
			'for': company1,
			target: this,
			_rootControl:true
		});
	});
	
	Ember.run(()=>{
		optionControls=formControl.get('friends.optionControls');
	});
	
	Ember.run(()=>{
		assert.equal(optionControls.length,3,'3 optionControls');
		
		assert.equal(Ember.compare(company1.get('friends').toArray(),friends1.slice(0,1)),0,'Person1 friend');

		assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');

		assert.equal(optionControls[1].get('selected'),false,'OptionControl1 not selected');
		
		assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
	});
	
	Ember.run(()=>{
		company1.get('friends').pushObject(friends1.objectAt(1));
	});
	
	Ember.run(()=>{
		assert.equal(optionControls.length,3,'3 optionControls');
		
		assert.equal(Ember.compare(company1.get('friends').toArray(),friends1.slice(0,2)),0,'Person1 friend');

		assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');

		assert.equal(optionControls[1].get('selected'),true,'OptionControl1 selected');
		
		assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
	});
});

test('Attribute update - Attribute based options',function(assert){
	var formControl,optionControls;
	
	Ember.run(() => {
		formControl=MultipleAttributeDynamicOptionsForm.create(Ember.getOwner(this).ownerInjection(),{
			'for': person1,
			target: this,
			_rootControl:true
		});
	});
	
	Ember.run(()=>{
		optionControls=formControl.get('friends.optionControls');
	});
	
	Ember.run(()=>{
		assert.equal(optionControls.length,3,'3 optionControls');
		
		assert.equal(Ember.compare(person1.get('friends').toArray(),friends1.slice(0,1)),0,'Person1 friend');

		assert.equal(optionControls[0].get('selected'),true,'OptionControl0 selected');

		assert.equal(optionControls[1].get('selected'),false,'OptionControl1 not selected');
		
		assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
	});
	
	Ember.run(()=>{
		formControl.set('for.optionsToggle',true);
	});
	
	Ember.run(()=>{
		optionControls=formControl.get('friends.optionControls');
	});
	
	Ember.run(()=>{
		assert.equal(optionControls.length,4,'4 optionControls');
		
		assert.equal(Ember.compare(person1.get('friends').toArray(),friends1.slice(0,1)),0,'Person 1 friends');
		
		assert.equal(optionControls[0].get('selected'),false,'OptionControl0 not selected');

		assert.equal(optionControls[1].get('selected'),false,'OptionControl1 not selected');

		assert.equal(optionControls[2].get('selected'),false,'OptionControl2 not selected');
		
		assert.equal(optionControls[3].get('selected'),false,'OptionControl3 not selected');
	});
});

test('Model updates - Control retention',function(assert){
	assert.expect(0);
});


test('Model updates - Dirty state',function(assert){
	assert.expect(0);
});

test('Relation updates - Control retention',function(assert){
	assert.expect(0);
});


test('Relation updates - Dirty state',function(assert){
	assert.expect(0);
});