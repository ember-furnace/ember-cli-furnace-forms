import Ember from 'ember';
import Abstract from './abstract';
import OptionMixin from 'furnace-forms/mixins/controls/option';

export default Abstract.extend(OptionMixin).reopenClass({
	create:function() {
		if(!arguments[0].optionControl)
			return this._super.apply(this,arguments);
		else 
			return this.createWithMixins.apply(this,arguments);
	}
});