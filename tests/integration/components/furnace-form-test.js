import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
moduleForComponent('furnace-form', 'Integration | Component | furnace form', {
	integration: true,
	beforeEach() {
		var owner=Ember.getOwner(this);
		owner.factoryFor('initializer:furnace-forms').class.initialize(owner);
		owner.factoryFor('initializer:furnace-i18n').class.initialize(owner);
		owner.factoryFor('initializer:furnace-validation').class.initialize(owner);
		owner.factoryFor('instance-initializer:furnace-i18n').class.initialize(owner);
	},
	testModel() {
		if(this._testModel===undefined) {
			this._testModel= Ember.Object.extend().reopenClass({
				modelName:'test'
			}).create({
				text:'test'
			});
		}
		return this._testModel;
	}
});

test('Bindings', function(assert) {
	this.inject.service('store');

	this.set('model',this.testModel());
	
	this.set('isValid',false);
	
	this.set('isEnabled',null);
	
	this.set('isDirty',null);
	
	this.render(hbs`{{furnace-form 'integration' for=model isValid=isValid isEnabled=isEnabled isDirty=isDirty}}`);

	assert.ok(this.$('form[type=integration]').length===1,'Rendered');

	assert.equal(this.get('isValid'), true,'isValid');
	
	this.$('.text input').val('test2');
	this.$('.text input').change();
	
	assert.equal(this.get('model.text'),'test2','Model changed');
	
	assert.equal(this.get('isDirty'), true,'isDirty');
	
	this.$('.text input').val('test');
	this.$('.text input').change();
	
	assert.equal(this.get('isDirty'), false,'isDirty');

	
});
