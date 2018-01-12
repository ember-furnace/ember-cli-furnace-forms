import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import Forms from 'furnace-forms';
import wait from 'ember-test-helpers/wait';

var person1;
var friends1=[];
var friends2=[];

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

var MultipleAttributeDynamicOptionsForm=Forms.Form.extend({
	
	friends:Forms.input('checklist').options(function(options){
		return getAttributeTestOptions(this.getModel(),options);
	}).multiple().on('optionsToggle'),
	
	testPanel: Forms.panel('condition',{
		test:Forms.input('trigger-input'),
	}).on('friends',function() {
		return true;
	}),
	
	validator:null
}).model('person');

var TriggerInput = Forms.Controls.Input.extend({

	property:Ember.computed({
		get() {
			this._form.notifyPropertyChange("_model");
			return 1;
		}
	})
});

moduleForComponent('furnace-form', 'Integration | Options | Render double options refresh', {
	integration: true,
	beforeEach() {
		var owner=Ember.getOwner(this);
		owner.lookup('application:main').set('defaultLocale','en');
		owner.factoryFor('initializer:furnace-forms').class.initialize(owner);
		owner.factoryFor('initializer:furnace-i18n').class.initialize(owner);
		owner.factoryFor('initializer:furnace-validation').class.initialize(owner);
		this.register('form:multiple-dynamic-options',MultipleAttributeDynamicOptionsForm)
		this.register('input:trigger-input',TriggerInput)
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
	},
	testModel() {
		return person1;
	}
});

test('Attribute update - Attribute based options - Double refresh',function(assert){

	this.set('model',this.testModel());
	
	this.render(hbs`{{furnace-form 'multiple-dynamic-options' for=model}}`);

	assert.ok(this.$('form[type=MultipleDynamicOptions]').length===1,'Form renders');

	assert.ok(this.$('form[type=MultipleDynamicOptions] > controls > control.friends').length===1,'List renders');

	return wait().then(()=>{
		assert.ok(this.$('form[type=MultipleDynamicOptions] > controls > control.friends > options > control').length===3,'List contains 3 controls');
	});
});

