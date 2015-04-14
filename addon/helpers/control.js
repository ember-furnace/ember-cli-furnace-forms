/**
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from "ember";
import getName from 'furnace-forms/utils/get-name';

/**
 * @method f-control
 * @for Furnace.Forms.helpers
 * @param {Furnace.Forms.Control.Abstract} ControlProxy
 * @param {Hash} options
 * @return {String} HTML string  
 */
export default function controlHelper(params, hash, options, env) {
	Ember.assert('You need to specify a control from your form',params[0]);
	var view = env.data.view;
	var control =params[0].value();
	Ember.assert('Control not found',control);

	var component = control.getComponentClass(view,control._panel.get('_modelName'));
	Ember.assert('Control ('+control._name+') does not specify a component',component);
	hash=control.extendHash(hash);
	env.helpers.view.helperFunction.call(this,[component],hash,options,env);
}
