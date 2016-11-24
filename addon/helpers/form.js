import Ember from 'ember';
import Lookup from 'furnace-forms/utils/lookup-class';

var require = Ember.__loader.require;
var registerKeyword = require('ember-htmlbars/keywords').registerKeyword;

var componentKeyword = require('ember-htmlbars/keywords/element-component').default || require('ember-htmlbars/keywords/component').default;
var assign = require('ember-metal/merge').assign || require('ember-metal/assign').default;

function FormKeywordFactory() {
	this.setupState=function(lastState, env, scope, params, hash) {
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
			var control=controlClass.create(Ember.getOwner(view).ownerInjection(),{
				target:target,
				'for': forObject
			});
			if(hash['for']) {
				hash._forStreamSubscriber=hash['for'].subscribe(function(stream) {
					Ember.run.schedule('afterRender',this,this.set,'for',stream.value());
				},control);
			}
			hash.control=control;
			hash._rootControl=true;
			componentPath = control.get('_decorator');
			
		} else {
			componentPath=lastState.componentPath;
		}
	
		return assign({}, lastState, { lookupPath,componentPath, isComponentHelper: true });
	};
}
FormKeywordFactory.prototype=componentKeyword;

var formKeyword = new FormKeywordFactory();

export default function() {
	registerKeyword('form',formKeyword);
}

