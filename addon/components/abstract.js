/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from 'furnace-forms/controls/abstract';
import I18n from 'furnace-i18n';
/**
 * Abstract control component 
 * 
 * @class Abstract
 * @namespace Furnace.Forms.Components
 * @extends Ember.Component
 */
export default Ember.Component.extend({
	tagName: 'control',
	
	classNameBindings: ['_validClass','_focusClass','_enabledClass','_nameClass','_controlClasses','_typeClass'],
	
	control: null,
	
	_nameClass : Ember.computed('control._name',{
		get : function() {
			var name=this.get('control._name');		
			if(typeof name==='string')
				return name.replace(/\./g,'-');
		}
	}).readOnly(),
	
	_focusClass : Ember.computed('_focus',{
		get : function() {
			if(this.get('_focus')===true) {
				return 'focus';
			}
			return null;
		}
	}).readOnly(),

	
	caption: I18n.computed(null),
	
	actions: {
				
		focus:function() {
			this.setFocus(true);
			this.send('onFocus');
		},
		
		blur:function() {
			this.setFocus(false);
			this.send('onBlur');
		},
		
	},
	
	setFocus: function(focus) {
		if(focus!=this._focus) {
			this.set('_focus',focus);
			this.set('hasFocus',focus);
		}
		
	},
			
	_focus:false,
	
	hasFocus: false,
	
	/**
	 * The name for the control
	 * @property _name
	 * @type String
	 * @private
	 */
	name : Ember.computed.alias('control._name'),
	
	/**
	 * The form to which the control belongs
	 * @property _form
	 * @type Furnace.Validation.Components.Form
	 * @private
	 */
//	_form : null,
	
	/**
	 * The panel to which the control belongs
	 * @property _panel
	 * @type Furnace.Validation.Components.Panel
	 * @private
	 */
//	_panel : null,
	
	/**
	 * The path for the control
	 * @property _path
	 * @type String
	 * @private
	 */
//	_path : null,
	
	/**
	 * CSS class for validity
	 * @property _validClass
	 * @type String
	 * @private
	 */
	_validClass : Ember.computed('isValid',{
		get  : function() {
			var valid=this.get('isValid');
			if(valid===false) {
				return 'invalid';
			}
			else if(valid===true) {
				return 'valid';
			}
		}
	}).readOnly(),
	
	/**
	 * CSS class for enabled
	 * @property _enabledClass
	 * @type String
	 * @private
	 */
	_enabledClass :  Ember.computed('isEnabled',{
		get  : function() {
			if(this.get('isEnabled')===false) {
				return 'disabled';
			}
			return null;
		}
	}).readOnly(),
	
	
	/**
	 * Whether the control is enabled or not (alias for private property _enabled)
	 * @property isEnabled
	 * @type Boolean
	 * @default true
	 */
	isEnabled: true,
	
	
	
	
			
	/**
	 * Whether the input is valid
	 * @property _valid
	 * @type Boolean
	 * @default: null
	 * @private
	 */
//	_valid: null,

	/**
	 * Whether the control is valid or not (alias for private property _valid)
	 * @property isValid
	 * @type Boolean
	 * @default null
	 */
	isValid: null,
	
	
	
//	_dirty:false,
	
	isDirty:  false,
	
	
	
	notifyChange: function() {
		this.get('control').notifyChange();
	},
	
	
	/**
	 * Get the path for the component
	 * @method _getPath
	 * @type String
	 * @private
	 */
	
	
	
	
	/**
	 * CSS classes determined by validation errors, warnings and notices
	 * @property _controlClasses
	 * @type String
	 * @private
	 */
	_controlClasses : function() {
		var classes=[];
		if(this.get('hasError')) {
			classes.push('error');
		} 
		if(this.get('hasWarning')) {
			classes.push('warning');
		}
		if(this.get('hasNotice')) {
			classes.push('notice');
		}		
		return classes.join(" ");
	}.property('hasError,hasWarning,hasNotice'),
		
	hasError: false,
	
	hasWarning: false,
	
	hasNotice: false,
	
	_registeredControl : null,
	
	_registerControl : function() {
		if(this._registeredControl!==this.control) {
			if(this._registeredControl) {
				this._registeredControl.unregisterComponent(this);
			}
			this.get('control').registerComponent(this);
			this._registeredControl=this.control;
		}
	},
	
	init : function() {
		this._super();
		this.set('_controlMessages',Ember.A());
		Ember.assert('A form component ('+this+') initialized without a control!',this.control);
		this._registerControl();
		this.set('target',this.control);
		
		if( this.caption instanceof Ember.ComputedProperty  && this.get('caption')===null) {
			if(typeof this.control.caption ==='object') {
				this.caption=Ember.computed.alias('control.caption');
			} else if(this.get('control.caption')!==undefined) {
				this.set('caption',this.get('control.caption'));
			}
			else { 
				var prefix=this.get('control._panel._modelName') ? this.get('control._panel._modelName') + '.' : '';
				var name=prefix+ this.get('control._name');
				
				this.set('caption',name);
			}
		}
	},
	
	_enabledObserver:Ember.observer('isEnabled',function() {
		if(this.get('isEnabled') && (this.hasError || this.hasWarning || this.hasNotice)) {
			this.set('_showMessages',true);
		}
		else {
			this.set('_showMessages',false);
		}
	}),
	
	_showDelayedMessages : true,
	
	_showMessages : false,
	
	_controlMessages : null,
	
//	_errors : Ember.computed.filterBy('_controlMessages','type','error'),
//	
//	_warnings : Ember.computed.filterBy('_controlMessages','type','warning'),
//
//	_notices : Ember.computed.filterBy('_controlMessages','type','notice'),
	
	_controlObserver : Ember.observer('control',function() {
		this._registerControl();
	}),
	
	_controlMessageObserver : Ember.observer('_focus,_showDelayedMessages', function() {
		var messages=this.__controlMessages;
		var source = null;
		if(!this.control) {			
			return;
		}
		var focus=this.get('_focus');
		if(!focus) {
			source= this.get('control._controlMessages').filter(function(message) {
				if(message.display==="focus")
					return false;
				return true;
			});
		} else {
			var showDelayed=this.get('_showDelayedMessages');
			source= this.get('control._controlMessages').filter(function(message) {
				if(message.display==="immediate")
					return true;
				if(showDelayed && message.display==='delayed') 
					return true;
				if(focus && message.display==='focus') 
					return true;
				return false;
			});
		}
		this.control._updateMessages(source,this._controlMessages);
		
		this.set('hasError',this._controlMessages.findBy('type','error')!==undefined);
		this.set('hasWarning',this._controlMessages.findBy('type','warning')!==undefined);
		this.set('hasNotice',this._controlMessages.findBy('type','notice')!==undefined);
		
		
		if(this.get('isEnabled') && (this.hasError || this.hasWarning || this.hasNotice)) {
			this.set('_showMessages',true);
		}
		else {
			this.set('_showMessages',false);
		}
		
		this.propertyDidChange('_controlMessages');
		this.propertyDidChange('_showMessages');
	}),
	
	
	defaultLayout : Ember.computed.alias('tagName'),
	
	/**
	 * @TODO: Fix layoutname resolution, it is a mess
	 * Layoutnames:
	 * 
	 * - Ofcourse component override
	 * - Control specified layoutName
	 * - Form modelName, path or default layout (model.property or model.text)
	 * - Form modelName and component type (model.text) ???
	 * - Something weird with the constructor typekey.
	 * - Finally defaultLayout (panel, text)
	 */
	
	layouts: Ember.computed({
		get : function() {
			var ret=Ember.A();		
			ret.pushObject((this.get('control._form._modelName')+'.'+(this.control._path ? this.control._path : this.get('defaultLayout'))).replace(/\./g,'/'));
			if(this.constructor.typeKey) {
				ret.pushObject((this.get('control._form._modelName')+'.'+this.constructor.typeKey).replace(/\./g,'/'));			
				var layoutName=this.constructor.typeKey.replace(/\./g,'/');
				if(layoutName===this.constructor.typeKey) {
					ret.pushObject( 'forms/'+layoutName);
				} else {
					ret.pushObject(layoutName+'/'+this.control._componentType);
				}						
			}
			ret.pushObject(this.get('defaultLayout'));
			return ret;
		}
	}).readOnly(),
	
	layoutName: function() {
		var layoutName=null;
		var container=this.get('container');
		if(!container) {
			return null;
		}
		if(this.control && this.control.get('layoutName')) {
			return this.control.get('layoutName');
		}
		
		this.get('layouts').forEach(function(layout){
			if(layoutName===null && container.lookup('template:'+layout)) {
				layoutName=layout;
				return true;
			}
		});
		
		return layoutName;
		
	}.property(),
	
	_focusObserver : Ember.observer('_focus',function() {		
		this.set('_showDelayedMessages',false);
	}),
	
	hasPrerequisites : Ember.computed.alias('control.hasPrerequisites'),
	
	willDestroy : function() {
		if(this.control) {
			this.control.unregisterComponent(this);
		} else {
			Ember.warn(this+" control went missing. This is known to happen when the Ember Inspector causes optionControls to load while they shouldn't according to the used layout. We are now leaking memory")
		}
		this._super();
//		if(this.get('targetObject.'+this._name) instanceof Control) {
//			this.set('targetObject.'+this._name+'.content',null);
//		}
//		this._unregisterControl ? this._unregisterControl(this) : this._form._unregisterControl(this);
	},
	
	getStore: function() {
		return this.get('control.store');
	},
	
	getFor: function(key) {
		return this.control.getFor(key);
	},
	
	getForm: function(key) {
		if(key) {
			return this._form.get(key);
		}
		return this._form;
	}
	
});