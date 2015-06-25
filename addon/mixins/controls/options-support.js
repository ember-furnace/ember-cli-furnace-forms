import Ember from 'ember';
import Option from 'furnace-forms/controls/option';
import getControl from 'furnace-forms/utils/get-control';
import OptionMixin from 'furnace-forms/mixins/controls/option';

export default Ember.Mixin.create({
	
	_options : Ember.computed(function(key,value){
		if(value) {
			return this._updateOptions(value);
		}
		return Ember.A();
	}),
	
	_optionFn : null,
	
	_optionProps : null,
	
	isLoading : false,
	
	_controlsLoaded: false,
	
	controls: Ember.computed('_options',function() {
		var ret = Ember.A();
		var self = this;
		this._controlsLoaded=true;
		this.get('_options').forEach(function(option,index) {
			ret.pushObject(getControl.call(self,index,Option,{_panel:self,
																	_option:option}));
		});
		return ret;
	}).readOnly(),
	
	
	init : function() {
		this._super();
		this._orgOptions=Ember.A();
		if(this._optionFn) {			
			var optionProps=this._optionProps ? this._optionProps+',_form.for' : '_form.for';
			this.reopen({
				_optionsObserver: Ember.observer(optionProps,function() {
					Ember.run.once(this,function() {
						var value = this._optionFn();
						if(value instanceof Ember.RSVP.Promise) {
							var _self=this;
							value.then(function(options){
								if(!_self.isDestroyed)
									_self.set('_options',options);
							});
							return this._orgOptions;
						} else {
							this.set('_options',value);
						}
					});
				})
			});
			this._optionsObserver();
		}
	},
	
	_updateOptions : function(newOptions) {
		var ret=Ember.A();
		var options=[];
		
		if(!newOptions || !newOptions.length) {
			return ret;
		}
		newOptions.forEach(function(option,index) {
			option.index=index+1;
			ret.pushObject(option);
		});
		return ret;
	},
	
	options : Ember.computed.alias('_options'),
	
	destroy: function() {
		this.get('_options').invoke('destroy');
		this._super();
	},
	
});