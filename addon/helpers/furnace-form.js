import Ember from 'ember';

import lookup from 'furnace-forms/utils/lookup-class';
import getName from 'furnace-forms/utils/get-name';

export default Ember.Component.extend({
	
	tagName: '',
	
	controlTagName: 'form',
	
	_control: null,
	
	_lookup: lookup,
	
	control : Ember.computed.alias('_control').readOnly(),
	
	attrList : null,
	
	form: Ember.computed('_named,for',{
		get() {
			if(this.get('_named')) {
				return this.get('_named');
			} else {
				return getName(this.get('_targetObject'));
			}
		}
	}).readOnly(),
	
	init() {
		var attrList=this.get('attrList');
		if(!attrList) {
			attrList = this.set('attrList',Ember.A());
		}
		this._super(...arguments);
	},
	
	// Should consider using .attrs for attrList
	// For now wait for API to stabalize
	setUnknownProperty(key,value) {
		var attrList=this.get('attrList');
		if(!attrList) {
			attrList = this.set('attrList',Ember.A());
		}
		if(key.substr(0,1)!=='_' && key!=='attrs' && key!=='renderer') {			
			if(!attrList.includes(key)) {
				attrList.pushObject(key);
			}
		}
		this[key]=value;
		return this.set(key,value);
	},
	
	_formObserver: Ember.observer('form',function() {
		let Clazz=this._lookup(this.get('form'));
		if(!(this._control instanceof Clazz)) {
			let control=Clazz.create(Ember.getOwner(this).ownerInjection(),{
				'for': this.get('for'),
				target: this,
				_rootControl:true
			});
			if(this._control) {
				this._control.destroy();
				this.sendAction('controlDestroyed',this._control);
			}
			this.set('_control',control);
			this.sendAction('controlCreated',control);
		}
	}).on('init'),
	
	decorator: Ember.computed.alias('_control._decorator'),
	
	_forObserver:Ember.observer('for',function() {
		if(this._control) {
			this.set('_control.for',this.get('for'));
		}
	}),
	
	destroy() {
		this.sendAction('controlDestroyed',this._control);
	},
	
	send: function() {
		this.sendAction.apply(this,arguments);
	},
	
	sendAction(action) {
		let actionName=action || 'action';
		if(this.get('attrs.'+actionName)) {
			this._super(...arguments);			
		} else {
			if(action!=='controlCreated' && action!=='controlDestroyed') {
				var targetObject=this.get('_targetObject') || this.get('targetObject');
				if(targetObject) {
					targetObject.send.apply(targetObject,arguments);
				}
			}
		}
	},
	
}).reopenClass({
	positionalParams: ['_named'],
});