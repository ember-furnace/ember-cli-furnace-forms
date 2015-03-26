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
	
	caption: null,
	
	submit: false,
	
	actions : {
		click:  function() {
			if(this.submit===true) {
				this.get('targetObject').send('submit',this._name);
			}
			else {
				this.get('targetObject').send(this._name,this._panel);
			}
		}
	},
	
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
		if(this.constructor.typeKey)
			return this.constructor.typeKey.replace(/\./g,'/')+'/input';
		return 'forms/action' ;
	}.property(),
	
});