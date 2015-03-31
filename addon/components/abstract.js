/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from 'furnace-forms/controls/abstract';

/**
 * Abstract control component 
 * 
 * @class Abstract
 * @namespace Furnace.Forms.Components
 * @extends Ember.Component
 */
export default Ember.Component.extend({
	tagName: 'control',
	
	classNameBindings: ['_validClass','_enabledClass','_name','_controlClasses'],
	
	actions: {
		focus:function() {
			this.set('_focus',true);
		},
		
		blur:function() {
			this.set('_focus',false);
		},
		
	},
	
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
		if(this.get('_valid')===false) {
			return 'invalid';
		}
		return 'valid';
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
		return 'enabled';
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
	 * Whether the input is value
	 * @property _valid
	 * @type Boolean
	 * @default: null
	 * @private
	 */
	_valid: function() {
		if(!this._form) {
			return null;
		}
		var validations=this._form.get('_validations');
		if(!validations){
			return true;
		}
		var name=this.get('_form._modelName')+'.'+this._getPath();
		if(validations[name]===undefined) {
			return true;
		}
		else {
			return validations[name];
		}
	}.property('_form._validations'),
	
	/**
	 * Whether the control is enabled or not (alias for private property _enabled)
	 * @property isEnabled
	 * @type Boolean
	 * @default true
	 */
	isEnabled: Ember.computed.alias('_enabled'),
	
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
	
	/**
	 * CSS classes determined by validation errors, warnings and notices
	 * @property _controlClasses
	 * @type String
	 * @private
	 */
	_controlClasses : function() {
		var classes=[];
		if(this.get('controlErrors').length) {
			classes.push('error');
		} 
		if(this.get('controlWarnings').length) {
			classes.push('warning');
		}
		if(this.get('controlNotices').length) {
			classes.push('notice');
		}		
		return classes.join(" ");
	}.property('controlMessages'),
	
	controlMessages: function() {
		if(!this._form || !this._form.get('_messages')){
			return Ember.A();
		}
		return this._form.get('_messages').filterBy('path',this.get('_form._modelName')+'.'+this._path);
	}.property('_form._messages'),
	
	controlErrors: function() {
		return this.get('controlMessages').filterBy('type','error');
	}.property('controlMessages'),
	
	controlWarnings: function() {
		return this.get('controlMessages').filterBy('type','warning');
	}.property('controlMessages'),
	
	controlNotices: function() {
		return this.get('controlMessages').filterBy('type','notices');
	}.property('controlMessages'),
	
	
	
	init:function() {
		this._super();		
		this.set('target',this.get('targetObject'));
		if(this.get('targetObject.'+this._name) instanceof Control) {
			this.set('targetObject.'+this._name+'.content',this);
		}
		if(this._form) {
			this.set('_path',this._getPath());
		}
	},
	
	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}		
		var name='forms/'+this.get('tagName');
		return name ;
	}.property(),
	
	_apply: function() {

	},
	
	_reset: function() {
		
	},
	
	
});