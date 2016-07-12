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
	
	_decoratorName : 'list',
	
	_itemControls : null,
	
	sortProperties: null,
	sortAscending: true,
	
	isSorted: Ember.computed.notEmpty('sortProperties'),
	
//	orderBy:Ember.Enumerable.mixins[0].properties.sortBy,
//	sortFunction:Ember.SortableMixin.mixins[1].properties.sortFunction,
	
	init : function() {
		this.set('_itemControls',Ember.A());
		this._super();
		if(this.filterBy) {
			this.addObserver('value.@each.'+this.filterBy.key,this,this._loadItemControls);
		}
		this._loadItemControls();
	},

	itemControls : Ember.computed('_itemControls,_itemControls.[],sortProperties.[]',{
		get  : function() {
			if(!this._itemControls) {
				return Ember.A();
			}
			var content = this._itemControls;
			var isSorted = this.get('isSorted');
			if (content && isSorted) {
				return content.sortBy.apply(content,this.sortProperties);
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
			var values;
			if(this.filter) {
				values=value.filter(this.filter);
			} else if(this.filterBy) {
				values=value.filterBy(this.filterBy.key,this.filterBy.value);
			} else {
				values=value;
			}
			
			values.forEach(function(value,index) {
				var oldControl=oldControls ? oldControls.findBy('for',value) : undefined;
				if(oldControl) {
					oldControls.removeObject(oldControl);
				} else {
					var meta=control._itemControl._meta;						
					itemControls.pushObject(getControl.call(control,index,meta,{'for' : null}));
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
	
	willDestroy : function() {
		var controls=this._itemControls;
		if(controls && controls.length) {
			controls.invoke('willDestroy');
		}
		this._super();	
	},
	
	destroy : function() {
		var controls=this._itemControls;
		if(controls && controls.length) {
			controls.invoke('destroy');
		}
		this._super();	
	},
	
}).reopenClass({
	filter : function(callback) {
		this.reopen({
			filter:callback
		})
		return this;
	},
	filterBy: function(key,value) {
		this.reopen({
			filterBy:{key:key,value:value}
		});
		return this;
	},
	
	generate : function(mixins,meta,options) {
		options=options || {};
		mixins=mixins || [];
		mixins.push(meta.options);
		var typeKey=this.typeKey;
		var control = this.extend.apply(this,mixins);
		control.typeKey=typeKey;
		return control;
	}
});