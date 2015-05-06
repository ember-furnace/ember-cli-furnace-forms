/**
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from "ember";

/**
 * @method f-messages
 * @for Furnace.Forms.helpers
 * @param {Hash} options
 * @return {String} HTML string  
 */
export default function controlHelper(params, hash, options, env) {
	var view = env.data.view;
	var component=view.container.lookup('component:forms.messages');	
	env.helpers.view.helperFunction.call(this,[component],hash,options,env);
}
