import Ember from 'ember';
import Panel from './panel';
import getName from 'furnace-forms/utils/get-name';

export default Panel.extend({
	tagName: 'form',
	
	classNameBindings: ['_name','_modelName'],
	
	_syncFromSource : true,
	
	_syncToSource : true,
	
	_observer : null,
	
	_valid : null,
	
	_messages : Ember.A(),
	
	_name: Ember.computed.alias('_modelName'),
	
	controlMessages: function() {
		if(!this.get('_messages')) {
			return Ember.A();
		}
		return this.get('_messages').filterBy('name',this._modelName);		
	}.property('_messages'),
	
	actions : {
		submit: function(action) {			
			this.sendAction('willSubmit',this);
			if(this.get('_observer')) {
				var form=this;
				this.get('_observer').run(function(result) {
					if(result.isValid()) {
						form._submit();
						form.send(action,this);				
						form.sendAction('didSubmit');
					}
				});
			}	
			else {
				this._submit();
				this.send(action,this);				
				this.sendAction('didSubmit');	
			}
			
		}
	},
	
	_proxy : function() {
		var properties={}
		this.get('inputControls').forEach(function(control) {
			properties[control._name]=Ember.computed(function(key) {
				return control.get('value');
			});
		});
		return Ember.ObjectProxy.extend(properties).create({content: this['for']});
	}.property('for'),
	
	validator : function() {
		if(this._form && this._form.get("_validator."+this._path)) {			
			return this._form.get("_validator."+this._path);
		}
		return this._modelName;
	}.property('_modelName'),
	
	_validator: function() {
		var validator=this.get('validator');
		if(typeof validator==='object') {
			return validator;
		}
		else {
			var fn=this.container.lookup('validator:lookup');
			if(fn) {
				return fn.call(this,validator);
			}
			return null;
		}
	}.property('validator'),
	
	init : function() {
		this._super();
		var targetObject=this._syncToSource ? this['for'] : this.get('_proxy');
		
		var validator=this.get('_validator');
		
		if(validator && (!this._form || !this._form.get("_validator."+this._path))) {
			var form=this;
			this.set('_valid',false);
			
			this._observer = this.get('_validator').observe(this,'for',function(result) {
				form.set('_valid',result.isValid());
				form.set('_messages', result.getMessages());
				
			},this.get('_path') || this.get('_modelName'));
		}
	},
	
	willSubmit : null,
	
	didSubmit : null,
	
	_submit : function() {
		this._apply();
	},

	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}
		var name='forms/'+getName(this.get('targetObject')).replace(/\./g,'/');
		if(!this.get('container').lookup('template:'+name)) {
			if(getName(this.get('for'))) {
				name='forms/'+getName(this.get('for')).replace(/\./g,'/');
			}
			if(!name || !this.get('container').lookup('template:'+name)) {
				name='form';
			}
		}
		return name ;
	}.property('targetObject','for'),
	
	destroy: function() {
		if(this._observer) {
			this._observer.destroy();
		}
		this._super();
	}
});