import { moduleFor } from 'ember-qunit';
import Ember from 'ember';
export default function(control,name, options = {}) {
	moduleFor(control,name, {
		needs:[
			'initializer:furnace-forms',
			'initializer:furnace-i18n',
			'instance-initializer:furnace-i18n',
			'model:test'
		],
		beforeEach() {
			var owner=Ember.getOwner(this);
			owner.factoryFor('initializer:furnace-forms').class.initialize(owner);
			owner.factoryFor('initializer:furnace-i18n').class.initialize(owner);
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
};