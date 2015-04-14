/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from 'furnace-forms/controls/abstract';


function messageFilter(item) {
	
}

/**
 * Abstract control component 
 * 
 * @class Abstract
 * @namespace Furnace.Forms.Components
 * @extends Ember.Component
 */
export default Ember.Component.extend({
	tagName: 'control',
	
	classNameBindings: ['_validClass','_focusClass','_enabledClass','_name','_controlClasses','_typeClass'],
	
	actions: {
		focus:function() {
			this.set('_focus',true);
		},
		
		blur:function() {
			this.set('_focus',false);
		},
		
		reset : function(action) {
			this._reset();
			this.send('validate');
		},
	},
	
	_focusClass : function() {
		if(this.get('_focus')===true) {
			return 'focus';
		}
		return null;
	}.property('_focus'),
	
	_focus:false,
	
	hasFocus:Ember.computed.alias('_focus'),
	
	/**
	 * The name for the control
	 * @property _name
	 * @type String
	 * @private
	 */
	_name : null,
	
	/**
	 * The form to which the control belongs
	 * @property _form
	 * @type Furnace.Validation.Components.Form
	 * @private
	 */
	_form : null,
	
	/**
	 * The panel to which the control belongs
	 * @property _panel
	 * @type Furnace.Validation.Components.Panel
	 * @private
	 */
	_panel : null,
	
	/**
	 * The path for the control
	 * @property _path
	 * @type String
	 * @private
	 */
	_path : null,
	
	/**
	 * CSS class for validity
	 * @property _validClass
	 * @type String
	 * @private
	 */
	_validClass : function() {
		var valid=this.get('_valid');
		if(valid===false) {
			return 'invalid';
		}
		else if(valid===true) {
			return 'valid';
		}
	}.property('_valid'),
	
	/**
	 * CSS class for enabled
	 * @property _enabledClass
	 * @type String
	 * @private
	 */
	_enabledClass : function() {
		if(this.get('_enabled')===false) {
			return 'disabled';
		}
		return null;
	}.property('_enabled'),
	
	
	/**
	 * Whether the input is enabled
	 * @property _enabled
	 * @type Boolean
	 * @default true
	 * @private
	 */
	_enabled : true,
	
	/**
	 * Whether the control is enabled or not (alias for private property _enabled)
	 * @property isEnabled
	 * @type Boolean
	 * @default true
	 */
	isEnabled: Ember.computed.alias('_enabled'),
	
	setEnabled: function(enabled) {		
		if(enabled!=this._enabled)
			this.set('_enabled',enabled);
	},
			
	/**
	 * Whether the input is valid
	 * @property _valid
	 * @type Boolean
	 * @default: null
	 * @private
	 */
	_valid: null,

	setValid: function(valid) {
		if(valid!=this._valid) {
			this.set('_valid',valid);
			if(this._panel)
				this._panel.propertyDidChange(this._name);
		}
	},
	
	
	/**
	 * Whether the control is valid or not (alias for private property _valid)
	 * @property isValid
	 * @type Boolean
	 * @default null
	 */
	isValid: Ember.computed.alias('_valid'),
	
	/**
	 * Get the path for the component
	 * @method _getPath
	 * @type String
	 * @private
	 */
	_getPath: function() {
		if(this._form) {
			return (this.get('_panel._path') ? this.get('_panel._path')+ "." : '')+this.get('_name');
		}
	},
	
	getFor : function() {
		if(this['for'])
			return this['for'];			
		return this.getForm()['for'];
	},
	
	getTarget : function() {
		if(this._form)
			return this.getForm().get('targetObject');
		return this.get('targetObject');
	},
	
	getPanel : function() {
		return this._panel;
	},
	
	getForm : function() {
		return this._form;
	},
	
	/**
	 * CSS classes determined by validation errors, warnings and notices
	 * @property _controlClasses
	 * @type String
	 * @private
	 */
	_controlClasses : function() {
		var classes=[];
		if(this.get('hasError') && this.get('showErrors')) {
			classes.push('error');
		} 
		if(this.get('hasWarning')) {
			classes.push('warning');
		}
		if(this.get('hasNotice')) {
			classes.push('notice');
		}		
		return classes.join(" ");
	}.property('_controlMessages,showErrors'),
	
	hasError:Ember.computed('_errors.length',function(){
		var errors=this.get('_errors.length')>0;
		return errors;
	}).volatile(),
	
	hasWarning:Ember.computed('_warnings',function() {
		var warnings=this.get('_warnings.length')>0;
		return warnings;
	}).volatile(),
	
	hasNotice:Ember.computed('_notices',function() {
		var notices=this.get('_notices.length')>0;
		return notices;
	}).volatile(),
	
	__controlMessages : null,
	
	_controlMessages : null,
	
	_controlMessageObserver : function() {
		var messages=null;
		if(this.__controlMessages) {			
			var focus=this.get('_focus');
			if(!focus) {
				messages= this.__controlMessages.filter(function(message) {
					if(message.display==="focus")
						return false;
					return true;
				});
			} else {
				var showDelayed=this.get('_showDelayedMessages');
				messages= this.__controlMessages.filter(function(message) {
					if(message.display==="immediate")
						return true;
					if(showDelayed && message.display==='delayed') 
						return true;
					if(focus && message.display==='focus') 
						return true;
					return false;
				});
			}
		}
		this.set('_controlMessages',messages);
	}.observes('__controlMessages,_focus,_showDelayedMessages'),
	
	setMessages: function(messages) {
		this.set('showErrors',true);
		this.set('__controlMessages',messages);
	},
	
	
	_errors : Ember.computed.filterBy('_controlMessages','type','error').volatile(),
	
	_warnings : Ember.computed.filterBy('_controlMessages','type','warning').volatile(),

	_notices : Ember.computed.filterBy('_controlMessages','type','notice').volatile(),

	controlErrors: Ember.computed.oneWay('_errors'),
	
	controlWarnings: Ember.computed.oneWay('_warnings'),
	
	controlNotices: Ember.computed.oneWay('_notices'),
	
	_showDelayedMessages : true,
	
	init:function() {		
		this._super();	
		this.set('target',this.get('targetObject'));
		if(this.get('targetObject.'+this._name) instanceof Control) {
			this.set('targetObject.'+this._name+'.content',this);
		}
		if(this._form) {
			this.set('_path',this._getPath());
		}
		if(this.get('caption')===null) {
			var name=this.get('_panel._modelName')+'.'+this.get('_name');
			this.set('caption',name);
			
		}
		var form=this._form || this;
		form._registerControl(this);
	},
	
	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}		
		var name='forms/'+this.get('tagName');
		return name ;
	}.property(),
	
	showErrors : true,
	
	showMessages : Ember.computed('_controlMessages,showErrors',function(){
		if((this.get('hasError') && this.get('showErrors')) || this.get('hasWarning') || this.get('hasNotice'))
			return true;
		return false;
	}),
	
	_focusObserver : function(sender,key) {		
//		if(this._focus) {
//			this.set('showErrors',false);
//		} else {
//			this.set('showErrors',true);
//		}
		this.set('_showDelayedMessages',false);
	}.observes('_focus'),
	
	_apply: function() {

	},
	
	_reset: function() {
		this.setValid(null);
	},
	
	willDestroy : function() {
		if(this.get('targetObject.'+this._name) instanceof Control) {
			this.set('targetObject.'+this._name+'.content',null);
		}
		var form=this._form || this;
		form._unregisterControl(this);
	}
	
});