import Ember from 'ember';
import Option from 'furnace-forms/controls/option';
import getControl from 'furnace-forms/utils/get-control';

export default Ember.Mixin.create({
	
	_options : Ember.computed({
		get : function(key,value){
			return Ember.A();
		},
		set : function(key,value) {
			return this._updateOptions(value);
		}
	}),
	
	_optionFn : null,
	
	_optionProps : null,
	
	isLoading : false,
	
	_controlsLoaded: false,
	
	_optionControls : null,
	
	sortProperties: ['index'],
	sortAscending: true,
	
	isSorted: Ember.computed.notEmpty('sortProperties'),
	
	orderBy:Ember.SortableMixin.mixins[1].properties.orderBy,
	sortFunction:Ember.SortableMixin.mixins[1].properties.sortFunction,
	
	init : function() {
		this._super();
		this.set('_optionControls',Ember.A());
		if(this._optionFn) {			
			var optionProps=this._optionProps ? this._optionProps+',_form._model' : '_form._model';			
			this.reopen({
				_optionsObserver: Ember.observer(optionProps,function() {
					if(!this.get('_form._model')) {
						Ember.warn('furnace-forms: '+this+' not loading options, form model not ready');
						return;
					}	
					var options=this.get('_options');
					var newOptions=Ember.A();
					var value = this._optionFn(newOptions,options);
					if(value instanceof Ember.RSVP.Promise) {
						var _self=this;
						value.then(function(value){							
							if(!_self.isDestroyed) {
								if(value!==undefined) {
									_self.set('_options',value);
								} else { 
									_self.set('_options',options);
								}
							}
						});						
					} else {
						if(value!==undefined) {
							this.set('_options',value);
						} else { 
							this.set('_options',options);
						}
					}
					this._super();
				})
			});
			
		}
	},
	
	_initOptions : Ember.on('init',function() {
		if(this.get('_form._model')) {
			this._optionsObserver();
		} 
	}),
	
	_loadOptionControls : Ember.observer('_options,_options.@each',function() {
		if(this._controlsLoaded===true) {
			var control=this;
			var options=this.get('_options');
					
			var optionControls=this._optionControls;
			var oldControls=optionControls.toArray();
			
			if(this.isDestroying) {
				return;
			}
			options.forEach(function(option,index) {
				var oldControl=oldControls ? oldControls.findBy('_option',option) : undefined;
				if(oldControl) {
					oldControls.removeObject(oldControl);
				} else {
					optionControls.pushObject(getControl.call(control,index,Option,{_panel:control,
						_option:option}));
				}
				
			});
			if(oldControls) {
				oldControls.forEach(function(oldControl) {
					optionControls.removeObject(oldControl);
					oldControl.destroy();
				});
			}
		}
	}),
	
	optionControls : Ember.computed('_optionControls.@each,sortProperties.@each',{
		get : function() {
			if(!this._controlsLoaded) {
				this._controlsLoaded=true;
				this._loadOptionControls();
			}
			
			if(!this._optionControls) {
				return Ember.A();
			}
			var content = this._optionControls;
			var isSorted = this.get('isSorted');
			var self = this;
			if (content && isSorted) {
				content = content.slice();
				content.sort(function(item1, item2) {
		          return self.orderBy(item1, item2);
				});			
				return Ember.A(content);
			}
			
			return content;
		}
	}).readOnly(),
	
	controls: Ember.computed.union('_controls','_optionControls').readOnly(),
	
	_updateOptions : function(newOptions) {		
		if(!newOptions || !newOptions.length) {
			return newOptions;
		}
		newOptions.forEach(function(option,index) {
			option.set('index',index+1);
			option.set('selected',false);
		});
		return newOptions;
	},
	
	options : Ember.computed.alias('_options'),
	
	destroy: function() {
		// Only destroy options if we have an optionFn
		if(!this._optionsStatic) {
			this.get('_options').invoke('destroy');
		}
		this._super();
	},
	
});