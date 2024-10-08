/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Option from 'furnace-forms/mixins/controls/option';
import MultiSelect from 'furnace-forms/mixins/controls/multi-select';
import I18n from 'furnace-i18n';
/**
 * Abstract control component
 *
 * @class Abstract
 * @namespace Furnace.Forms.Components
 * @extends Ember.Component
 */

function getControlNameClass() {
	var name=this.get('control._name');
	if(typeof name==='string') {
		return name.replace(/\./g,'-');
	}
	return null;
}

export default Ember.Component.extend({

	tagName: 'control',

	classNameBindings: ['_validClass','_focusClass','_enabledClass','_nameClass','_controlClasses','_typeClass'],

	control: null,

	_nameClass : Ember.computed({
		get : getControlNameClass
	}).readOnly(),

	_controlNameObserver: Ember.observer('control._name',function() {
		var name=getControlNameClass.apply(this);
		if(name!==this.get('_nameClass')) {
			Ember.run.schedule('actions',this,this.set,'_nameClass',name);
		}
	}),

	_focusClass : Ember.computed('_focus',{
		get : function() {
			if(this.get('_focus')===true) {
				return 'focus';
			}
			return null;
		}
	}).readOnly(),


	caption: I18n.computed(null),

	messagesId: null,

	actions: {

		focus:function() {
			this.setFocus(true);
			this.send('onFocus');
		},

		blur:function() {
			this.setFocus(false);
			this.send('onBlur');
		},

		setMessagesId(elementId) {
				this.set("messagesId", elementId);
		}

	},

	setFocus: function(focus) {
		if(focus!==this.hasFocus) {
			// If we don't schedule this, our focusClass computed property my trigger a rerender
			// if another classNameBinding already changed
			Ember.run.scheduleOnce('actions',this,this.set,'_focus',focus);
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
	name : null,

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
	_controlClasses : Ember.computed('hasError,hasWarning,hasNotice',{
		get() {
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
		}
	}),

	hasError: false,

	hasWarning: false,

	hasNotice: false,

	_registeredControl : null,

	_registerControl : function() {
		if(this._registeredControl!==this.control) {
			if(this._registeredControl) {
				this._registeredControl.unregisterComponent(this);
			}
			this.control.registerComponent(this);
			if(Option.detect(this.control)) {
				if(MultiSelect.detect(this.control._panel)) {
					this.set('name',this.get('control._panel._name')+'Option['+this.get('control.index')+']');
				} else {
					this.set('name',this.get('control._panel._name')+'Option');
				}
			} else {
				this.set('name',this.get('control._name'));
			}

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
				this.reopen({
					caption: Ember.computed.alias('control.caption')
				});
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
		var source = null;
		if(!this.control) {
			return;
		}
		var focus=this.get('_focus');
		if(!focus) {
			source= this.get('control._controlMessages').filter(function(message) {
				if(message.display==="focus") {
					return false;
				}
				return true;
			});
		} else {
			var showDelayed=this.get('_showDelayedMessages');
			source= this.get('control._controlMessages').filter(function(message) {
				if(message.display==="immediate"){
					return true;
				} else if(showDelayed && message.display==='delayed') {
					return true;
				} else if(focus && message.display==='focus') {
					return true;
				}
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


	defaultLayoutName : Ember.computed.alias('tagName'),

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
			ret.pushObject((this.get('control._form._modelName')+'.'+(this.control._path ? this.control._path : this.get('defaultLayoutName'))).replace(/\./g,'/'));

			var decoratorName=this.control._decoratorName || this.get('parentView.optionType');
			if(decoratorName) {
				ret.pushObject((this.get('control._form._modelName')+'.'+decoratorName).replace(/\./g,'/'));
				var layoutName=decoratorName.replace(/\./g,'/');
				if(layoutName===decoratorName) {
					ret.pushObject( 'forms/'+layoutName);
				} else {
					ret.pushObject(layoutName+'/'+this.control._decoratorType);
				}
			}
			ret.pushObject(this.get('defaultLayoutName'));
			return ret;
		}
	}).readOnly(),

	layoutName: Ember.computed({
		get() {
			var layoutName=null;
			var owner=Ember.getOwner(this);
			if(!owner) {
				return null;
			}
			if(this.control && this.control.get('layoutName')) {
				return this.control.get('layoutName');
			}

			this.get('layouts').forEach(function(layout){
				if(layoutName===null && owner.lookup('template:'+layout)) {
					layoutName=layout;
					return true;
				}
			});

			return layoutName;
		}

	}),

	_focusObserver : Ember.observer('_focus',function() {
		this.set('_showDelayedMessages',false);
	}),

	hasPrerequisites : Ember.computed.alias('control.hasPrerequisites'),

	willDestroy : function() {
		if(this.control) {
			this.control.unregisterComponent(this);
		} else {
			Ember.warn(this+" control went missing. This is known to happen when the Ember Inspector causes optionControls to load while they shouldn't according to the used layout. We are now leaking memory");
		}
		this._super();
	},

	getStore: function() {
		return this.get('control.store');
	},

	getFor: function(key) {
		return this.control.getFor(key);
	},

	getModel: function(key) {
		return this.control.getModel(key);
	},

	getForm: function(key) {
		if(key) {
			return this.control._form.get(key);
		}
		return this.control._form;
	}

}).reopenClass({
	positionalParams: ['control'],
});
