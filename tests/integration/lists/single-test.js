import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import SingeListFormControl from 'dummy/forms/employee';
import ListControl from 'furnace-forms/controls/list';
import lookup from 'furnace-forms/utils/lookup-class';

moduleForComponent('furnace-form', 'Integration | Lists | Single', {
	integration: true,
	beforeEach() {
		var owner=Ember.getOwner(this);
		owner.lookup('application:main').set('defaultLocale','en');
		owner.factoryFor('initializer:furnace-forms').class.initialize(owner);
		owner.factoryFor('initializer:furnace-i18n').class.initialize(owner);
		owner.factoryFor('initializer:furnace-validation').class.initialize(owner);
		owner.factoryFor('instance-initializer:furnace-i18n').class.initialize(owner);
		this.inject.service('store');
	},
	testModel() {
		if(!this._testModel) {
			Ember.run(()=>{
				this._testModel= this.get('store').createRecord('employee',{
					firstName:'Adrian',
					lastName:'Anderson',
					age:30,
					gender:null,
					position:null,
					friends: [this.get('store').createRecord('person',{
						firstName:'Brian',
						lastName:'Brooks',
						age:30,
						gender:null
					}),this.get('store').createRecord('person',{
						firstName:'Chris',
						lastName:'Cross',
						age:30,
						gender:null
					})]
				});
			});
		}
		return this._testModel;
	}
});

test('Form Renders', function(assert) {

	this.set('model',this.testModel());
	
	this.render(hbs`{{furnace-form 'employee' for=model}}`);

	assert.ok(this.$('form[type=employee]').length===1,'Form renders');
	
	assert.ok(this.$('form[type=employee] > controls > control.friends').length===1,'List renders');
	
	assert.ok(this.$('form[type=employee] > controls > control.friends > form').length===2,'List contains 2 forms');
	
});


test('Model updates - Control retention',function(assert){
	var Class=lookup.call(this,'employee');
	var formControl,friendsControl,itemControls,itemControl0,itemControl1,friend;
	Ember.run(() => {
		formControl=Class.create(Ember.getOwner(this).ownerInjection(),{
			'for': this.testModel(),
			target: this,
			_rootControl:true
		});
	});
	assert.ok(formControl instanceof SingeListFormControl,'FormControl loads');
	
	friendsControl=formControl.get('friends');
	
	assert.ok(friendsControl instanceof ListControl,'ListControl loads');

	itemControls=friendsControl.get('itemControls');
	
	assert.equal(itemControls.length,2,'2 itemControls');
	
	friend=this.testModel().get('friends').objectAt(0);
	
	itemControl0=itemControls.objectAt(0);

	itemControl1=itemControls.objectAt(1);
	
	assert.equal(itemControl0.get('for'),friend,'ItemControl model');
	
	Ember.run(() => {
		friend=this.get('store').createRecord('person',{
			firstName:'Eddy',
			lastName:'Edison',
			age: 35,
			gender:null
		});
		formControl.set('for', this.get('store').createRecord('employee',{
			firstName:'David',
			lastName:'Dove',
			age:20,
			gender:null,
			position:null,
			friends: [friend]
		}));
	});
	
	itemControls=friendsControl.get('itemControls');
	
	assert.equal(itemControls.length,1,'1 itemControl');
	
	assert.ok(!itemControl0.isDestroyed,'ItemControl at 0 not destroyed');
	
	assert.ok(itemControls.objectAt(0)===itemControl0,'ItemControl at 0 retained');
	
	assert.equal(itemControls.objectAt(0).get('for'),friend,'ItemControl model updated');
	
	assert.ok(itemControl1.isDestroyed,'ItemControl at 1 destroyed');
	
});


test('Model updates - Dirty state',function(assert){
	var Class=lookup.call(this,'employee');
	var formControl,friend;
	Ember.run(() => {
		formControl=Class.create(Ember.getOwner(this).ownerInjection(),{
			'for': this.testModel(),
			target: this,
			_rootControl:true
		});
	});
	assert.ok(formControl instanceof SingeListFormControl,'FormControl loads');
	
	assert.equal(formControl.get('isDirty'),false,'FormControl not dirty');
	
	Ember.run(() => {
		friend=this.get('store').createRecord('person',{
			firstName:'Eddy',
			lastName:'Edison',
			age: 35,
			gender:null
		});
		formControl.set('for', this.get('store').createRecord('employee',{
			firstName:'David',
			lastName:'Dove',
			age:20,
			gender:null,
			position:null,
			friends: [friend]
		}));
	});
	
	assert.equal(formControl.get('isDirty'),false,'FormControl not dirty');
});

test('Relation updates - Control retention',function(assert){
	var Class=lookup.call(this,'employee');
	var formControl,friendsControl,itemControls,itemControl0,itemControl1,friend,friends;
	Ember.run(() => {
		formControl=Class.create(Ember.getOwner(this).ownerInjection(),{
			'for': this.testModel(),
			target: this,
			_rootControl:true
		});
	});
	assert.ok(formControl instanceof SingeListFormControl,'FormControl loads');
	
	friendsControl=formControl.get('friends');
	
	friends=friendsControl.get('value');
	
	assert.ok(friendsControl instanceof ListControl,'ListControl loads');

	itemControls=friendsControl.get('itemControls');
	
	assert.equal(itemControls.length,2,'2 itemControls');
	
	friend=this.testModel().get('friends').objectAt(0);
	
	itemControl0=itemControls.objectAt(0);

	itemControl1=itemControls.objectAt(1);
	
	assert.equal(itemControl0.get('for'),friend,'ItemControl model');
	
	assert.equal(formControl.get('isDirty'),false,'FormControl not dirty');
	
	Ember.run(() => {
		friend=this.get('store').createRecord('person',{
			firstName:'David',
			lastName:'Dove'
		});
		this.testModel().get('friends').setObjects([friend]);
	});
	
	itemControls=friendsControl.get('itemControls');
	
	assert.equal(itemControls.length,1,'1 itemControl');
	
	assert.ok(!itemControl0.isDestroyed,'ItemControl at 0 not destroyed');
	
	assert.ok(itemControls.objectAt(0)===itemControl0,'ItemControl at 0 retained');
	
	assert.equal(itemControls.objectAt(0).get('for'),friend,'ItemControl model updated');
	
	assert.ok(itemControl1.isDestroyed,'ItemControl at 1 destroyed');
	
	assert.equal(formControl.get('isDirty'),true,'FormControl dirty');
	
	Ember.run(() => {
		friend=this.get('store').createRecord('person',{
			firstName:'Eddy',
			lastName:'Edison'
		});
		this.testModel().get('friends').pushObject(friend);
	});
	
	itemControls=friendsControl.get('itemControls');
	
	assert.ok(!itemControl0.isDestroyed,'ItemControl at 0 not destroyed');
	
	assert.ok(itemControls.objectAt(0)===itemControl0,'ItemControl at 0 retained');
	
	assert.equal(itemControls.length,2,'2 itemControl');

	itemControl1=itemControls.objectAt(1);
	
	assert.equal(itemControl1.get('for'),friend,'ItemControl model updated');
	
	assert.equal(formControl.get('isDirty'),true,'FormControl dirty');
	
	Ember.run(() => {
		this.testModel().get('friends').setObjects(friends);
	});
	
	itemControls=friendsControl.get('itemControls');
	
	assert.equal(itemControls.length,2,'2 itemControls');
	
	assert.ok(!itemControl0.isDestroyed,'ItemControl at 0 not destroyed');

	assert.ok(!itemControl1.isDestroyed,'ItemControl at 1 not destroyed');
	
	assert.ok(itemControls.objectAt(0)===itemControl0,'ItemControl at 0 retained');
	
	assert.ok(itemControls.objectAt(1)===itemControl1,'ItemControl at 1 retained');
	
	assert.equal(itemControl0.get('for'),friends.objectAt(0),'ItemControl at 0 for value');
	
	assert.equal(itemControl1.get('for'),friends.objectAt(1),'ItemControl at 1 for value');
});


test('Relation updates - Dirty state',function(assert){
	var Class=lookup.call(this,'employee');
	var formControl,friend,friends;
	Ember.run(() => {
		formControl=Class.create(Ember.getOwner(this).ownerInjection(),{
			'for': this.testModel(),
			target: this,
			_rootControl:true
		});
	});
	assert.ok(formControl instanceof SingeListFormControl,'FormControl loads');
	
	friends=formControl.get('friends.value').toArray();
	
	assert.equal(formControl.get('isDirty'),false,'FormControl not dirty');
	
	Ember.run(() => {
		friend=this.get('store').createRecord('person',{
			firstName:'David',
			lastName:'Dove'
		});
		this.testModel().get('friends').setObjects([friend]);
	});
	
	assert.equal(formControl.get('isDirty'),true,'FormControl dirty after setObjects');
	
	Ember.run(() => {
		friend=this.get('store').createRecord('person',{
			firstName:'Eddy',
			lastName:'Edison'
		});
		this.testModel().get('friends').pushObject(friend);
	});
	
	assert.equal(formControl.get('isDirty'),true,'FormControl dirty after pushObjects');
	
	Ember.run(() => {
		this.testModel().get('friends').setObjects(friends);
	});

	assert.equal(formControl.get('isDirty'),false,'FormControl not dirty after setObjects');
	
	Ember.run(() => {
		friend=this.testModel().get('friends').popObject(friends);
	});
	
	assert.equal(formControl.get('isDirty'),true,'FormControl dirty after popObject');
	
	Ember.run(() => {
		this.testModel().get('friends').pushObject(friend);
	});
	
	assert.equal(formControl.get('isDirty'),false,'FormControl not dirty after pushObject');
});