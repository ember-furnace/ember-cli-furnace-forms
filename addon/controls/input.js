import Ember from 'ember';
import Control from './abstract';
import Component from 'furnace-forms/components/input';

export default Control.extend({
	_component : Component,
	
	caption : null,
	
	extendHash: function(hash) {
		var ret=this._super(hash);	
		ret.caption=this.caption;
		return ret;
	}
});