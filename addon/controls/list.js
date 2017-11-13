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
	
	_currentSortProperties: null,
	
	sortAscending: true,
	
	
	isSorted: Ember.computed.notEmpty('sortProperties'),
	
//	orderBy:Ember.Enumerable.mixins[0].properties.sortBy,
//	sortFunction:Ember.SortableMixin.mixins[1].properties.sortFunction,
	
	init : function() {
		this.set('_itemControls',Ember.A());
		this._super();
		if(this.filterBy) {
			this.addObserver('value.[].'+this.filterBy.key,this,function(){
				Ember.run.scheduleOnce('sync',this,this._loadItemControls);
			});
		}
		this._loadItemControls();
	},

	itemControls : Ember.computed({
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
	
	_sortObserver: Ember.observer('sortProperties',function() {
		if(this._currentSortProperties) {
			this._currentSortProperties.forEach(function(prop) {
				this.removeObserver('value.@each.'+prop,this,this._notifySortChanged);
			},this);
		}
		this._currentSortProperties=this.get('sortProperties');
		if(this._currentSortProperties) {
			this._currentSortProperties.forEach(function(prop) {
				this.addObserver('value.@each.'+prop,this,this._notifySortChanged);
			},this);
		}
	}),
	
	_sortInit: Ember.on('init',function() {
		this._sortObserver();
	}),
	
	_notifySortChanged() {
		Ember.run.scheduleOnce('sync',this,this.notifyPropertyChange,'itemControls');
	},
	
	_loadItemControls : function() {
		var control=this;
		var value=this.get('value');
				
		var itemControls=this._itemControls;
		var oldControls=itemControls.toArray();
		
		Ember.assert('List control '+this+' doest not have its itemControl property set. Did you forget to call .item() in your form?',this._itemControl || this._itemControlFn);
		if(this.isDestroying) {
			return;
		}
		if(Ember.Enumerable.detect(value)) {
			var values;
			var _value=value;
			if(this.filter) {
				values=value.filter(this.filter);
			} else if(this.filterBy) {
				values=value.filterBy(this.filterBy.key,this.filterBy.value);
			} else {
				values=value;
			}
			
			values=values.toArray();
			// Reuse controls with existing values;
			values.toArray().forEach(function(value) {
				var oldControl=oldControls ? oldControls.findBy('for',value) : undefined;
				if(oldControl) {
					oldControls.removeObject(oldControl);
					values.removeObject(value);
				}
			});
			// Reuse existing controls or create new control
			values.toArray().forEach(function(value) {
				var index=_value.indexOf(value);
				var _itemControlDef = control._itemControl || control._itemControlFn.call(this,value);
				var meta=_itemControlDef._meta;
				if(oldControls.length) {
					let _control=oldControls.shiftObject();
					_control.set('for',value);
				} else {
					itemControls.pushObject(getControl.call(control,index,meta,{'for' : value}));
				}
			})
		}
		if(oldControls) {
			oldControls.forEach(function(oldControl) {
				itemControls.removeObject(oldControl);
				oldControl.destroy();
			});
		}
		Ember.run.scheduleOnce('sync',this,this.notifyPropertyChange,'itemControls');
	},

	_valueObserver:function() {
		this._cleanControls();
		this._super(...arguments);
		Ember.run.scheduleOnce('sync',this,this._loadItemControls);
	},
	
	_reset: function(modelChanged) {
// Both valueObserver and reset would trigger clean controls
// We don't want that, but if I recall correctly there was a reason to clean controls in reset
		if(modelChanged) {
			this._cleanControls();
		}
		this._super(modelChanged);
	},
	
	_cleanControls : function() {
		// Immediately remove controls that are no longer backed by a value: 
		// Our child controls won't like it when their property gets yanked 
		var toRemove=Ember.A();
		var property=this.get('property');
		if(!property) {
			toRemove=this._itemControls.toArray();
		} else if(property instanceof Ember.RSVP.Promise || Ember.PromiseProxyMixin.detect(property)) {
			//toRemove=this._itemControls.toArray();
		} else {
			// Simply removing controls based on their content has severy decremental effects on performance
			// Remove controls based on their length
			if(this._itemControls.length>property.length) {
				toRemove=this._itemControls.slice(property.length,this._itemControls.length);				
			}
		}
		if(toRemove.length) {
			toRemove.invoke('destroy');
			this._itemControls.removeObjects(toRemove);
			Ember.run.scheduleOnce('sync',this,this.notifyPropertyChange,'itemControls');
		}
	},
	
	controls: Ember.computed.union('_controls').readOnly(),
	
	// We alias the for property for panels and forms
	'_model' : Ember.computed.alias('value'),
	
	
// These terrible workaround seem no long necessary.
//	_controlDirtyObserver: Ember.observer('_controls.@each.isDirty,_itemControls.@each.isDirty',function(){		
//		this._super();
//	}),
	
//	_controlValidObserver: Ember.observer('_controls.@each.isValid,_itemControls.@each.isValid',function(){
//		this._super();
//	}),
	
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
		});
		return this;
	},
	filterBy: function(key,value) {
		this.reopen({
			filterBy:{key:key,value:value}
		});
		return this;
	},
	
	generate : function(mixins,meta) {
		mixins=mixins || [];
		mixins.push(meta.options);
		var typeKey=this.typeKey;
		var control = this.extend.apply(this,mixins);
		control.typeKey=typeKey;
		return control;
	}
});