import Control from './abstract';
import Component from 'furnace-forms/components/action';

export default Control.extend({
	_component: Component,
	
	caption : null,
	
	extendHash: function(hash) {
		var ret=this._super(hash);
		if(!hash.caption) {
			ret.caption=this.caption;
		}		
		ret.submit=this.submit;
		return ret;
	}
});