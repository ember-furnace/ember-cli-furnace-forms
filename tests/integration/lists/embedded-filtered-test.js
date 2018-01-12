import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import EmbeddedListFormControl from 'dummy/forms/company';
import lookup from 'furnace-forms/utils/lookup-class';
import wait from 'ember-test-helpers/wait';

moduleForComponent('furnace-form', 'Integration | Lists | Embedded with filter', {
	integration: true,
	beforeEach() {
		var owner=Ember.getOwner(this);
		owner.lookup('application:main').set('defaultLocale','en');
		owner.factoryFor('initializer:furnace-forms').class.initialize(owner);
		owner.factoryFor('initializer:furnace-i18n').class.initialize(owner);
		owner.factoryFor('initializer:furnace-validation').class.initialize(owner);
		this.inject.service('store');
	},
	testModel() {
		if(!this._testModel) {
			Ember.run(()=>{
				this._testModel= this.get('store').createRecord('company',{
					name :'TestCorp',
					employees : [this.get('store').createRecord('employee',{
						firstName:'Adrian',
						lastName:'Anderson',
						friends: [this.get('store').createRecord('person',{
							firstName:'Brian',
							lastName:'Brooks',
							pets: [this.get('store').createRecord('pet',{
								name:'Felix the cat'
							})]
						})]
					}),
					this.get('store').createRecord('employee',{
						firstName:'Chris',
						lastName:'Cross',
						friends: [this.get('store').createRecord('person',{
							firstName:'David',
							lastName:'Dove',
							pets: [this.get('store').createRecord('pet',{
								name:'Garfield'
							})]
						})]
					})]
				});
			});
		}
		return this._testModel;
	}
});

test('Form Renders', function(assert) {

	this.set('model',this.testModel());
	
	this.render(hbs`{{furnace-form 'company' for=model}}`);

	assert.ok(this.$('form[type=company]').length===1,'Form renders');
	
	assert.ok(this.$('form[type=company] > controls > control.employees').length===1,'List renders');
	
	assert.ok(this.$('form[type=company] > controls > control.employees > form').length===2,'List contains 2 forms');
	
});

test('Model updates filtered list with ember-data relation, similar structure',function(assert){
	var Class=lookup.call(this,'company');
	var formControl,itemControls,itemControl0,itemControl1;
	Ember.run(() => {
		formControl=Class.create(Ember.getOwner(this).ownerInjection(),{
			'for': this.testModel(),
			target: this,
			_rootControl:true
		});
	});
	assert.ok(formControl instanceof EmbeddedListFormControl,'FormControl loads');
	
	assert.equal(Ember.get(formControl,'name.value'),'TestCorp','Root form name attribute');
	
	
	itemControls=formControl.get('employees.itemControls');
	
	assert.equal(itemControls.length,2,'2 itemControls');
	
	itemControl0=itemControls.objectAt(0);
	
	itemControl1=itemControls.objectAt(1);
	
	assert.equal(itemControl0.get('firstName.value'),'Adrian','ItemControl0 firstName');
	
	assert.equal(itemControl0.get('friends.itemControls.length'),1,'ItemControl0 1 friend');
	
	assert.equal(itemControl0.get('friends.itemControls').objectAt(0).get('firstName.value'),'Brian','ItemControl0-0 firstName');
	
	assert.equal(itemControl0.get('friends.itemControls').objectAt(0).get('pets.itemControls').objectAt(0).get('name.value'),'Felix the cat','ItemControl0-0-0 name');
	
	assert.equal(itemControl1.get('firstName.value'),'Chris','ItemControl1 firstName');
	
	assert.equal(itemControl1.get('friends.itemControls.length'),1,'ItemControl0 1 friend');
	
	assert.equal(itemControl1.get('friends.itemControls').objectAt(0).get('firstName.value'),'David','ItemControl10 firstName');
	
	assert.equal(itemControl1.get('friends.itemControls').objectAt(0).get('pets.itemControls').objectAt(0).get('name.value'),'Garfield','ItemControl1-0-0 name');
	
	Ember.run(() => {
		formControl.set('for',this.get('store').createRecord('company',{
			name :'NewTestCorp',
			employees : [this.get('store').createRecord('employee',{
				firstName:'Eddy',
				lastName:'Edison',
				friends: [this.get('store').createRecord('person',{
					firstName:'Ferdinand',
					lastName:'Ferrel',
					pets: [this.get('store').createRecord('pet',{
						name:'Bugs Bunny',
					})]
				})]
			}),
			this.get('store').createRecord('employee',{
				firstName:'Garry',
				lastName:'Garrison',
				friends: [this.get('store').createRecord('person',{
					firstName:'Harry',
					lastName:'Handsome',
					pets: [this.get('store').createRecord('pet',{
						name:'Tweety',
					})]
				})]
			})]
		}));
	});
	
	assert.equal(Ember.get(formControl,'name.value'),'NewTestCorp','Root form name attribute');
	
	itemControls=formControl.get('employees.itemControls');
	
	assert.equal(itemControls.length,2,'2 itemControls');
		
	assert.ok(!itemControl0.isDestroyed,'ItemControl at 0 not destroyed');
	
	assert.ok(itemControls.objectAt(0)===itemControl0,'ItemControl at 0 retained');

	assert.ok(!itemControl1.isDestroyed,'ItemControl at 1 not destroyed');
		
	assert.equal(itemControl0.get('firstName.value'),'Eddy','ItemControl0 firstName');
	
	assert.equal(itemControl0.get('friends.itemControls.length'),1,'ItemControl0 1 friend');
	
	assert.equal(itemControl0.get('friends.itemControls').objectAt(0).get('firstName.value'),'Ferdinand','ItemControl0-0 firstName');
	
	assert.equal(itemControl0.get('friends.itemControls').objectAt(0).get('pets.itemControls').objectAt(0).get('name.value'),'Bugs Bunny','ItemControl0-0-0 name');
	
	assert.equal(itemControl1.get('firstName.value'),'Garry','ItemControl1 firstName');
	
	assert.equal(itemControl1.get('friends.itemControls.length'),1,'ItemControl0 1 friend');
	
	assert.equal(itemControl1.get('friends.itemControls').objectAt(0).get('firstName.value'),'Harry','ItemControl10 firstName');
	
	assert.equal(itemControl1.get('friends.itemControls').objectAt(0).get('pets.itemControls').objectAt(0).get('name.value'),'Tweety','ItemControl1-0-0 name');
	
	Ember.run(() => {
		formControl.destroy();
	});
});

test('Model updates filtered list with ember-data relation, different structure',function(assert){
	var Class=lookup.call(this,'company');
	var formControl,itemControls,itemControl0,itemControl1;
	Ember.run(() => {
		formControl=Class.create(Ember.getOwner(this).ownerInjection(),{
			'for': this.testModel(),
			target: this,
			_rootControl:true
		});
	});
	assert.ok(formControl instanceof EmbeddedListFormControl,'FormControl loads');
	
	assert.equal(Ember.get(formControl,'name.value'),'TestCorp','Root form name attribute');
	
	
	itemControls=formControl.get('employees.itemControls');
	
	assert.equal(itemControls.length,2,'2 itemControls');
	
	itemControl0=itemControls.objectAt(0);
	
	itemControl1=itemControls.objectAt(1);
	
	assert.equal(itemControl0.get('firstName.value'),'Adrian','ItemControl0 firstName');
	
	assert.equal(itemControl0.get('friends.itemControls.length'),1,'ItemControl0 1 friend');
	
	assert.equal(itemControl0.get('friends.itemControls').objectAt(0).get('firstName.value'),'Brian','ItemControl0-0 firstName');
	
	assert.equal(itemControl1.get('firstName.value'),'Chris','ItemControl1 firstName');
	
	assert.equal(itemControl1.get('friends.itemControls.length'),1,'ItemControl0 1 friend');
	
	assert.equal(itemControl1.get('friends.itemControls').objectAt(0).get('firstName.value'),'David','ItemControl1-0 firstName');
	
	Ember.run(() => {
		formControl.set('for',this.get('store').createRecord('company',{
			name :'NewTestCorp',
			employees : [this.get('store').createRecord('employee',{
				firstName:'Eddy',
				lastName:'Edison',
				friends: [this.get('store').createRecord('person',{
					firstName:'Ferdinand',
					lastName:'Ferrel',
					pets: [this.get('store').createRecord('pet',{
						name:'Bugs Bunny',
					})]
				})]
			})]
		}));
	});
	
	assert.equal(Ember.get(formControl,'name.value'),'NewTestCorp','Root form name attribute');
	
	itemControls=formControl.get('employees.itemControls');
	
	assert.equal(itemControls.length,1,'1 itemControl');
		
	assert.ok(!itemControl0.isDestroyed,'ItemControl at 0 not destroyed');
	
	assert.ok(itemControls.objectAt(0)===itemControl0,'ItemControl at 0 retained');

	assert.ok(itemControl1.isDestroyed,'ItemControl at 1 destroyed');
		
	assert.equal(itemControl0.get('firstName.value'),'Eddy','ItemControl0 firstName');
	
	assert.equal(itemControl0.get('friends.itemControls.length'),1,'ItemControl0 1 friend');
	
	assert.equal(itemControl0.get('friends.itemControls').objectAt(0).get('firstName.value'),'Ferdinand','ItemControl0-0 firstName');
	
	Ember.run(() => {
		formControl.destroy();
	});
});

test('Model updates filtered list with array',function(assert){
	// In this test we provide a POJO as object, the validator/observer chokes on this
	// Without validation, several promises won't get fulfilled which requires these tests
	// to run inside the run loop and we need to wait for some promises to fulfill.
	var Class=lookup.call(this,'company');
	var formControl,itemControls,itemControl0,itemControl1;
	Ember.run(() => {
		formControl=Class.create(Ember.getOwner(this).ownerInjection(),{
			'for': this.testModel(),
			target: this,
			_rootControl:true,
			validator: null
		});
	});
	assert.ok(formControl instanceof EmbeddedListFormControl,'FormControl loads');
	Ember.run(() => {
		assert.equal(Ember.get(formControl,'name.value'),'TestCorp','Root form name attribute');
		
		itemControls=formControl.get('employees.itemControls');
		
		// itemControl shouldn't have loaded yet
		assert.equal(itemControls.length,0,'0 itemControls');
	});
	return wait().then(() => {
		Ember.run(() => {
			assert.equal(Ember.get(formControl,'name.value'),'TestCorp','Root form name attribute');
			
			itemControls=formControl.get('employees.itemControls');
			
			assert.equal(itemControls.length,2,'2 itemControls');
			
			itemControl0=itemControls.objectAt(0);
		
			itemControl1=itemControls.objectAt(1);
			
			assert.equal(itemControl0.get('firstName.value'),'Adrian','ItemControl0 firstName');
			
			assert.equal(itemControl0.get('friends.itemControls.length'),1,'ItemControl0 1 friend');
			
			assert.equal(itemControl0.get('friends.itemControls').objectAt(0).get('firstName.value'),'Brian','ItemControl0-0 firstName');
			
			assert.equal(itemControl1.get('firstName.value'),'Chris','ItemControl1 firstName');
			
			assert.equal(itemControl1.get('friends.itemControls.length'),1,'ItemControl0 1 friend');
			
			assert.equal(itemControl1.get('friends.itemControls').objectAt(0).get('firstName.value'),'David','ItemControl1-0 firstName');
		});
	
		Ember.run(() => {
			formControl.set('for',{
				name :'NewTestCorp',
				employees : [this.get('store').createRecord('employee',{
					firstName:'Eddy',
					lastName:'Edison',
					friends: [this.get('store').createRecord('person',{
						firstName:'Ferdinand',
						lastName:'Ferrel',
						pets: [this.get('store').createRecord('pet',{
							name:'Bugs Bunny',
						})]
					})]
				})]
			});
		});
		
		Ember.run(() => {
			assert.equal(Ember.get(formControl,'name.value'),'NewTestCorp','Root form name attribute');
			
			itemControls=formControl.get('employees.itemControls');
			
			assert.equal(itemControls.length,1,'1 itemControl');
			
			assert.ok(!itemControl0.isDestroyed,'ItemControl at 0 not destroyed');
			
			assert.ok(itemControls.objectAt(0)===itemControl0,'ItemControl at 0 retained');
		
			assert.ok(itemControl1.isDestroyed,'ItemControl at 1 destroyed');
				
			assert.equal(itemControl0.get('firstName.value'),'Eddy','ItemControl0 firstName');
			
			assert.equal(itemControl0.get('friends.itemControls.length'),1,'ItemControl0 1 friend');
			
			assert.equal(itemControl0.get('friends.itemControls').objectAt(0).get('firstName.value'),'Ferdinand','ItemControl0-0 firstName');
		});
		Ember.run(() => {
			formControl.destroy();
		});
	});
});
