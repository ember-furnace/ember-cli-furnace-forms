import Ember from 'ember';
import Lookup from 'furnace-forms/utils/lookup-class';
import CK from 'furnace-component-keywords';

var require = Ember.__loader.require;
var registerKeyword = require('ember-htmlbars/keywords').registerKeyword;

var componentKeyword = require('ember-htmlbars/keywords/element-component').default || require('ember-htmlbars/keywords/component').default;
var assign = require('ember-metal/merge').assign || require('ember-metal/assign').default;
var formKeyword = {
	setupState(lastState, env, scope, params, hash) {
		let view=env.view;
		let target= env.hooks.getValue(scope.getSelf());
		let named=null;
		var forObject = null;
		if(hash['for']) {
			forObject=env.hooks.getValue(hash['for']);			
		}
		else {
			forObject=target;
		}
		
		if(params[0]) {
			if(typeof env.hooks.getValue(params[0])==='string') {
				named=env.hooks.getValue(params[0]);			
			}
		} 
		
		let lookupPath= named ? named : target;
		let componentPath;
		if(!lastState.lookupPath || lastState.lookupPath!==lookupPath) {
			var controlClass=Lookup.call(view,lookupPath);
			var control=controlClass.create({
				container: view.container,
				target:target,
				'for': forObject
			});
			if(hash['for']) {
				hash._forStreamSubscriber=hash['for'].subscribe(function(stream) {
					this.set('for',stream.value());
				},control);
			}
			hash.control=control;
			hash._rootControl=true;
			componentPath = control.get('_decorator');
			
		} else {
			componentPath=lastState.componentPath;
		}

		return assign({}, lastState, { lookupPath,componentPath, isComponentHelper: true });
	},

	render: componentKeyword.render,

	rerender: componentKeyword.renderer
};
/*

function formKeyword(morph, env, scope, params, hash, template, inverse, visitor) {
	let view=env.view;
	let target= env.hooks.getValue(scope.getSelf());
	let named=null;
	let forObject = null;
	
	if(hash['for']) {
		forObject=env.hooks.getValue(hash['for']);
	}
	else {
		forObject=target;
	}
	
	if(params[0]) {
		if(typeof params[0]==='string') {
			named=params[0];			
		}
	} 
	
	let lookupPath= named ? named : target;
	let componentPath;
	
	let controlClass=Lookup.call(view,lookupPath);
	let control=controlClass.create({
		container: view.container,
		target:target,
		'for': forObject
	});
	if(hash['for']) {
		hash['for'].subscribe(function(stream) {
			this.set('for',stream.value());
		},control);
	}
	hash.control=control;
	componentPath = control.get('decorator');
	
	if (componentPath === undefined || componentPath === null) {
		return;
	}

	env.hooks.component(morph, env, scope, componentPath, params, hash, { "default": template, inverse: inverse }, visitor);
	return true;
}
*/

export default function() {
	registerKeyword('form',formKeyword);
}

