/**
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from "ember";
import Lookup from 'furnace-forms/utils/lookup-class';

/**
 * @method form
 * @for Furnace.Forms.helpers
 * @param {Furnace.Forms.Control.Form} Form Control Proxy
 * @param {Hash} options
 * @return {String} HTML string  
 */
export default function formHelper(params, hash, options, env) {
	Ember.assert("The for attribute of a form expects a object reference, not a string literal",hash['for']===undefined || (typeof hash['for']==='object' && hash['for'].isStream===true));
	var contextObject=hash['for'] ? hash['for'].value() : null;
	Ember.assert("You are required to specify a form or the 'for' attribute",params[0] || contextObject);
	var view = env.data.view;
	if(!contextObject) {
		contextObject=params[0];
		hash['for']=view;
	}
	var named=null;
	if(params[0]) {
		if(typeof params[0]==='string') {
			named=params[0];
		}else if(params[0].isStream===true) {
			named=params[0].value();
		}
	} else {
		named=view.get('renderedName');
	}
	var controlClass=Lookup.call(view,named ? named :contextObject);
	var control=controlClass.create({container:view.container,target:view.get('controller')});
	var component=control.getComponent();
	options.helperName='form';
	hash.control=control;	
	options.destroy=function() {
		this._super();
		console.log('destroying form');
		this.control.destroy();
	}
	Ember.assert('Control ('+control._name+') does not specify a component',component);
	return env.helpers.view.helperFunction.call(this,[component],hash,options,env);
}
