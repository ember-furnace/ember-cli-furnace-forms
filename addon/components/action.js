/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Control from './abstract';

/**
 * Action control component
 * 
 * @class Action
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Abstract
 */
export default Control.extend({
	tagName: 'button',
	
	caption: null,
	
	submit: false,
	
	init:function() {
		this._super();
		if(this.get('caption')===null) {
			var name=this.get('_panel._modelName')+'.'+this.get('_name');
			this.set('caption',name);
			
		}
	},
	
	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}
		var name="action";
		return name ;
	}.property(),
	
	click: function() {
		if(this.submit===true) {
			this.get('targetObject').send('submit',this._name);
		}
		else {
			this.get('targetObject').send(this._name,this._panel);
		}
	}
});