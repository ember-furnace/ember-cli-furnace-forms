import Panel from './panel';
import Component from '../components/condition';
export default Panel.extend().reopenClass({
	_component: Component,
	
	generate : function(options) {
		options=options || {};
		options._condition=options._conditionFn.property(options._conditionProps);
		return this._super(options);
	}
});