import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import CheckedSupportMixin from 'furnace-forms/mixins/components/checked-support';
moduleForComponent('checked-support', 'Integration | Component | checked-support', {
	integration: true,
	beforeEach() {
		var owner=Ember.getOwner(this);
		owner.lookup('application:main').set('defaultLocale','en');
		owner.factoryFor('initializer:furnace-forms').class.initialize(owner);
		owner.factoryFor('initializer:furnace-i18n').class.initialize(owner);
		owner.factoryFor('initializer:furnace-validation').class.initialize(owner);
		owner.factoryFor('instance-initializer:furnace-i18n').class.initialize(owner);
		this.register('component:checkbox-test',Ember.Component.extend(CheckedSupportMixin,{
			caption:'test',
			layoutName:'forms/checkbox',
			inputId: Ember.computed('elementId',{
				get : function() {
					return this.elementId+'-input';
				}
			})
		}))
		this.selectCount=0;
		this.select = function() {
			this.selectCount++;
		},
		this.count = function() {
			return this.selectCount;
		},
		this.reset = function() {
			this.selectCount=0;
		}
	},
	
});

test('Check checkbox', function(assert) {

	this.render(hbs`{{checkbox-test control=this}}`);

	assert.ok(this.$('div').length===1,'Rendered');
	
	assert.equal(this.count(),0,'selectCount');
	
	this.reset();
	
	this.$('input').click();
	
	assert.equal(this.count(),1,'selectCount');
	

	
});
