/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from './input';
import ControlSupport from 'furnace-forms/mixins/controls/control-support';
import getControl from 'furnace-forms/utils/get-control';
/**
 * Input control component proxy 
 * 
 * @class Input
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Control.extend(ControlSupport,{
	
	_component : 'list',
	
	_componentType : 'input',

	
	_itemComponent : null,
	
	_itemComponentType : 'input',
	
	_itemControls : null,
	
	init : function() {
		this._super();
		Ember.run.later(this,this._loadItemControls);
	},

	itemControls : Ember.computed('_itemControls',function() {
		if(!this._itemControls) {
			return Ember.A();
		}
		return this._itemControls;
	}),
	
	_loadItemControls : Ember.observer('value',function() {
		var control=this;
		var value=this.get('value');
		var oldControls=this._itemControls;
		var itemControls=Ember.A();
		Ember.assert('List control '+this+' doest not have its itemControl property set. Did you forget to call .item() in your form?',this._itemControl);
		if(this.isDestroying)
			return;
		if(Ember.Enumerable.detect(value)) {			
			value.forEach(function(value,index) {
				var oldControl=oldControls ? oldControls.findBy('value',value) : undefined;
				if(oldControl) {
					itemControls.pushObject(oldControl);
					oldControls.removeObject(oldControl);
				} else {
					var options=control._itemControl._meta.options;	
					options['for']=null;
					itemControls.pushObject(getControl.call(control,index,options._controlType,options));
				}
				
			});
		}
		if(oldControls) {
			oldControls.forEach(function(oldControl) {
				oldControl.destroy();
			});
		}
		this.set('_itemControls',itemControls);
	}),
	
	
//	_controlDirtyObserver: Ember.observer('itemControls.@each.isDirty',function(){		
//		this.setDirty(this._dirty);
//	}),
	
	controls: Ember.computed('itemControls',function() {
		var controls = this._super();
		return controls.pushObjects(this.get('itemControls'));
	}),
	
	// We alias the for property for panels and forms
	'for' : Ember.computed(function() {
		return this.get('value');
	}),
	
}).reopenClass({
	
	generate : function(mixins,options) {
		var options=options || {};
		mixins=mixins || [];
		mixins.push(options);
		var typeKey=this.typeKey;
		var component = this.extend.apply(this,mixins);
		component.typeKey=typeKey;
		return component;
	}
});