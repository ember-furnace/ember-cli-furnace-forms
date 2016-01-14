import Ember from 'ember';
import Abstract from './abstract';
import OptionMixin from 'furnace-forms/mixins/controls/option';

export default Abstract.extend(OptionMixin).reopenClass({
	typeKey: 'option'
});