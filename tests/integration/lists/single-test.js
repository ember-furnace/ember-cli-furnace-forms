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
					friends: [this.get('store').createRecord('person',{
						firstName:'Brian',
						lastName:'Brooks'
					}),this.get('store').createRecord('person',{
						firstName:'Chris',
						lastName:'Cross'
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


test('Model updates',function(assert){
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
			lastName:'Edison'
		});
		formControl.set('for', this.get('store').createRecord('employee',{
			firstName:'David',
			lastName:'Dove',
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


test('Relation updates',function(assert){
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
	
	Ember.run(() => {
		friend=this.get('store').createRecord('person',{
			firstName:'Eddy',
			lastName:'Edison'
		});
		this.testModel().get('friends').pushObject(friend);
	});
	
	itemControls=friendsControl.get('itemControls');
	
	assert.equal(itemControls.length,2,'2 itemControl');
	
	assert.equal(itemControls.objectAt(1).get('for'),friend,'ItemControl model updated');
});