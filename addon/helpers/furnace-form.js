import Ember from 'ember';

import lookup from 'furnace-forms/utils/lookup-class';
import getName from 'furnace-forms/utils/get-name';

export default Ember.Component.extend({
	
	tagName: 'div',
	
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
	
	_formObserver: Ember.observer('form',function() {
		let Clazz=this._lookup(this.get('form'));
		if(!(this._control instanceof Clazz)) {
			let control=Clazz.create(Ember.getOwner(this).ownerInjection(),{			
				'for': this.get('for'),
				target: this,
				_rootControl:true
			});
			this.set('_control',control);
		}
	}).on('init'),
	
	decorator: Ember.computed.alias('_control._decorator'),
	
	'for' : null,
	
	_forObserver:Ember.observer('for',function() {
		if(this._control) {
			this.set('_control.for',this.get('for'));
		}
	}),
	
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
//		if(this._control && attrs.newAttrs['for']) {
//			this.set('_control.for',attrs.newAttrs['for']);
//		} 
	}),
	
	
	
}).reopenClass({
	positionalParams: ['_named'],
});