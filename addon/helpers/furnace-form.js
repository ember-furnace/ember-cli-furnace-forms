import Ember from 'ember';

import lookup from 'furnace-forms/utils/lookup-class';
import getName from 'furnace-forms/utils/get-name';

export default Ember.Component.extend({
	
	tagName: '',
	
	_control: null,
	
	_lookup: lookup,
	
	control : Ember.computed.alias('_control').readOnly(),
	
	attrList : null,
	
	form: Ember.computed('_named,for',{
		get() {
			if(this.get('_named')) {
				return this.get('_named');
			} else {
				return getName(this.get('for'));
			}
		}
	}).readOnly(),
	
	_formObserver: Ember.observer('form',function() {
		let Clazz=this._lookup(this.get('form'));
		let control=Clazz.create(Ember.getOwner(this).ownerInjection(),{			
			'for': this.get('for'),
			target: this,
			_rootControl:true
		});
		this.set('_control',control);
	}).on('init'),
	
	decorator: Ember.computed.alias('_control._decorator'),
	
	'for' : null,
	
	send: function() {
		this.sendAction.apply(this,arguments);
	},
	
	sendAction(action) {
		let actionName=action || 'action';
		if(this.get('attrs.'+actionName)) {
			this._super(...arguments);			
		} else {
			var targetObject=this.get('_targetObject') || this.get('targetObject');
			if(targetObject) {
				targetObject.send.apply(targetObject,arguments);
			}
		}
	},
	
	receiveParentAttributes : Ember.on('didReceiveAttrs',function(attrs) {
		if(!this.attrList) {
			var attrList=Ember.A();
			for(let name in attrs.newAttrs) {
				if(name!=='for' && name!=='_named') {
					attrList.push(name);
				}
			}
			this.set('attrList',attrList);
		}
	}),
	
	
	
}).reopenClass({
	positionalParams: ['_named'],
});