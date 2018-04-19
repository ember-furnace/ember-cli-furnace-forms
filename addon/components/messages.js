import Ember from 'ember';
export default Ember.Component.extend({
	tagName : 'messages',
	layoutName: 'forms/messages',
		
	classNameBindings: ['showClass'],
	
	messages : null,
	
	errors : Ember.computed.filterBy('messages','type','error'),
	
	warnings : Ember.computed.filterBy('messages','type','warning'),

	notices : Ember.computed.filterBy('messages','type','notice'),
	
	init : function() {
		this._super();
		if(!this.get('target')) {
			this.set('target',this.get('_targetObject'));
		}
		this.messages=Ember.A();
	},

	show: false,
	
	
	
	showClass : Ember.computed('show',{
		get : function() {
			if(this.show) {
				return 'visible';
			}
			return 'hidden';
		}
	}).readOnly(),
	
	_showObserver : function(sender) {
		this.set('show',sender.get('_showMessages'));
	},
	
	
	_messagesObserver : function(sender) {
		var source=sender.get('_controlMessages');
		this._updateMessages(source,this.messages);
	},
	
	_updateMessages: function(source,target) {
		target.forEach(function(item) {
			if(!source) {
				item.visible=false;
			} else {
				var _messages=source.filterBy('type',item.type).filterBy('message',item.message);
				if(!_messages.length) {
					Ember.set(item,'visible',false);
				} else {
					Ember.set(item,'visible',true);
					_messages.forEach(function(message) {
						Ember.set(item,'attributes',message.attributes);
						source.removeObject(message);
					});
				}
			}
		});
		if(source) {
			source.forEach(function(message) {
				target.pushObject(message);
				Ember.run.later(function(){
					Ember.set(message,'visible',true);				
				});
			});
		}
	},
	
	didInsertElement: function() {
		this.get('target').addObserver('_showMessages',this,this._showObserver);
		this.get('target').addObserver('_controlMessages',this,this._messagesObserver);
		this._messagesObserver(this.get('target'),'_controlMessages');
		this._showObserver(this.get('target'),'_showMessages');
	},
	
	willClearRender : function() {
		this.get('target').removeObserver('_showMessages',this,this._showObserver);
		this.get('target').removeObserver('_controlMessages',this,this._messagesObserver);
	}
	
});