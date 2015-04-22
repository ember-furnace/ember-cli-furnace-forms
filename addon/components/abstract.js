/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from 'furnace-forms/controls/abstract';
import I18n from 'furnace-i18n';

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
	
	caption: I18n.computed(null),
	
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
	isEnabled: true,
	
	setEnabled: function(enabled) {		
		if(enabled!=this._enabled) {
			this.set('_enabled',enabled);
		}
		this.set('isEnabled',this._enabled && (!this._panel || this._panel.isEnabled));
	},
	
	_panelEnabledObserver:Ember.observer('_panel.isEnabled',function() {
		this.setEnabled(this._enabled);
	}),
			
	/**
	 * Whether the input is valid
	 * @property _valid
	 * @type Boolean
	 * @default: null
	 * @private
	 */
	_valid: null,

	/**
	 * Whether the control is valid or not (alias for private property _valid)
	 * @property isValid
	 * @type Boolean
	 * @default null
	 */
	isValid: null,
	
	setValid: function(valid) {
		Ember.run.once(this,function() {
			if(valid!==this._valid) {	
				this.set('isValid',valid);
				this.set('_valid',valid);
				this.notifyChange();
			}
		});
	},
	
	_dirty:false,
	
	isDirty:  false,
	
	setDirty: function(dirty) {
		Ember.run.once(this,function() {
			if(dirty!==this._dirty) {
				this.set('isDirty',dirty);
				this.set('_dirty',dirty);
				this.notifyChange();
			}
		});
	},
	
	notifyChange: function() {
		if(this._panel) {
			Ember.run.once(this,function() {
				this._panel.propertyDidChange(this._name);
			});
		}
	},
	
	
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
	
	getFor : function(path) {
		var model=null;
		if(this['for'])
			model = this.get('for');			
		else
			model = this.getForm().get('for');
		if(path) {
			return model.get(path);
		}
		return model;
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
	
	__controlMessages : null,
	
	_controlMessages : null,
	
	_controlMessageObserver : function() {
		var messages=this.__controlMessages;
		var source = null;
		
		var focus=this.get('_focus');
		if(!focus) {
			source= this.__controlMessages.filter(function(message) {
				if(message.display==="focus")
					return false;
				return true;
			});
		} else {
			var showDelayed=this.get('_showDelayedMessages');
			source= this.__controlMessages.filter(function(message) {
				if(message.display==="immediate")
					return true;
				if(showDelayed && message.display==='delayed') 
					return true;
				if(focus && message.display==='focus') 
					return true;
				return false;
			});
		}
		this._updateMessages(source,this._controlMessages);
		
		this.set('hasError',this._controlMessages.findBy('type','error')!==undefined);
		this.set('hasWarning',this._controlMessages.findBy('type','warning')!==undefined);
		this.set('hasNotice',this._controlMessages.findBy('type','notice')!==undefined);
		
		
		if(this._enabled && (this.hasError || this.hasWarning || this.hasNotice)) {
			this.set('_showMessages',true);
		}
		else {
			this.set('_showMessages',false);
		}
		
		this.propertyDidChange('_controlMessages');
		this.propertyDidChange('_showMessages');
	}.observes('_focus,_showDelayedMessages'),
	
	_enabledObserver: function() {
		if(this._enabled && (this.hasError || this.hasWarning || this.hasNotice)) {
			this.set('_showMessages',true);
		}
		else {
			this.set('_showMessages',false);
		}
	}.observes('_enabled'),
	
	setMessages: function(messages,silent) {
		this._updateMessages(messages,this.__controlMessages);
		if(!silent)
			Ember.run.once(this,this._controlMessageObserver);
	},
	
	
	_updateMessages: function(source,target) {
		var remove=Ember.A();
		target.forEach(function(item) {
			if(!source) {
				remove.pushObject(item);
			} else {
				var _messages=source.filterBy('type',item.type).filterBy('message',item.message);
				if(!_messages.length) {
					remove.pushObject(item);
				} else {
					
					_messages.forEach(function(message) {
						Ember.set(item,'attributes',message.attributes);
						source.removeObject(message);
					})
				}
			}
		});
		target.removeObjects(remove);
		if(source) {
			source.forEach(function(message) {
				target.pushObject(message)
			});
		}
	},
	
	_errors : Ember.computed.filterBy('_controlMessages','type','error'),
	
	_warnings : Ember.computed.filterBy('_controlMessages','type','warning'),

	_notices : Ember.computed.filterBy('_controlMessages','type','notice'),

	controlErrors: Ember.computed.oneWay('_errors'),
	
	controlWarnings: Ember.computed.oneWay('_warnings'),
	
	controlNotices: Ember.computed.oneWay('_notices'),
	
	_showDelayedMessages : true,
	
	_showMessages : false,
	
	init:function() {		
		this._super();	
		this.set('__controlMessages',Ember.A());
		this.set('_controlMessages',Ember.A());
		this.set('target',this.get('targetObject'));
		if(this.get('targetObject.'+this._name) instanceof Control) {
			this.set('targetObject.'+this._name+'.content',this);
		}
		if(this._form) {
			this.set('_path',this._getPath());
		}
		if(this.caption instanceof Ember.ComputedProperty && this.get('caption')===null) {
			var name=this.get('_panel._modelName')+'.'+this.get('_name');
			this.set('caption',name);
		}
		this._registerControl ? this._registerControl(this) : this._form._registerControl(this);
	},
	
	defaultLayout : Ember.computed.alias('tagName'),
	
	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}
		if(this.constructor.typeKey) {
			var layoutName=this.constructor.typeKey.replace(/\./g,'/');
			if(layoutName===this.constructor.typeKey) {
				layoutName = 'forms/'+layoutName;
			} else {
				layoutName = layoutName+'/input';
			}
			if(this.get('container').lookup('template:'+layoutName)) {
				return layoutName;
			}
		}
		return this.defaultLayout;
	}.property(),
	
	_focusObserver : function(sender,key) {		
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
		this._unregisterControl ? this._unregisterControl(this) : this._form._unregisterControl(this);
	}
	
});