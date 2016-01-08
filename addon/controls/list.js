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
	_isList : true,
	
	_component : 'list',
	
	_componentType : 'input',

	
	_itemComponent : null,
	
	_itemComponentType : 'input',
	
	_itemControls : null,
	
	sortProperties: null,
	sortAscending: true,
	
	isSorted: Ember.computed.notEmpty('sortProperties'),
	
//	orderBy:Ember.Enumerable.mixins[0].properties.sortBy,
//	sortFunction:Ember.SortableMixin.mixins[1].properties.sortFunction,
	
	init : function() {
		this.set('_itemControls',Ember.A());
		this._super();
		this._loadItemControls();
	},

	itemControls : Ember.computed('_itemControls,_itemControls.[],sortProperties.[]',{
		get  : function() {
			if(!this._itemControls) {
				return Ember.A();
			}
			var content = this._itemControls;
			var isSorted = this.get('isSorted');
			var self = this;
			if (content && isSorted) {
//				content = content.slice();
//				content.sort(function(item1, item2) {
//		          return self.orderBy(item1, item2);
//				});			
				return contents.sortBy.apply(contents,this.sortProperties);
			}
			
			return content;
		}
	}).readOnly(),
	
	_loadItemControls : function() {
		var control=this;
		var value=this.get('value');
				
		var itemControls=this._itemControls;
		var oldControls=itemControls.toArray();
		
		Ember.assert('List control '+this+' doest not have its itemControl property set. Did you forget to call .item() in your form?',this._itemControl);
		if(this.isDestroying) {
			return;
		}
		if(Ember.Enumerable.detect(value)) {	
			value.forEach(function(value,index) {
				var oldControl=oldControls ? oldControls.findBy('for',value) : undefined;
				if(oldControl) {
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
				itemControls.removeObject(oldControl);
				oldControl.destroy();
			});
		}
	},
	
	
	_valueObserver:Ember.observer('value,value.[]',function() {
		this._super();
		Ember.run.scheduleOnce('sync',this,function() {
			this._loadItemControls();
		});
	}),
	
	controls: Ember.computed.union('_controls','_itemControls').readOnly(),
	
	// We alias the for property for panels and forms
	'_model' : Ember.computed.alias('value'),
	
	_controlDirtyObserver: Ember.observer('_controls.[].isDirty,_itemControls.@each.isDirty',function(){		
		this._super();
	}),
	
	_controlValidObserver: Ember.observer('_controls.[].isValid,_itemControls.@each.isValid',function(){
		this._super();
	}),
	
}).reopenClass({
	
	generate : function(mixins,options) {
		options=options || {};
		mixins=mixins || [];
		mixins.push(options);
		var typeKey=this.typeKey;
		var component = this.extend.apply(this,mixins);
		component.typeKey=typeKey;
		return component;
	}
});