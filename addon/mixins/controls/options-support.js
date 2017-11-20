import Ember from 'ember';
import Option from 'furnace-forms/controls/option';
import getControl from 'furnace-forms/utils/get-control';
import I18n from 'furnace-i18n';

var ControlOption=Ember.Object.extend({
	value: null,
	caption: I18n.computed(null).explicit(),
	control: null,
	index: -1
});

export { ControlOption };

export default Ember.Mixin.create({
	actions : {
		onSelect : function() {
			
		},
		select : function() {
			
		},
		unselect : function() {
			
		},
	},
	select: function() {
		Ember.assert('Select called on control with options-support but selection type was not specified',false);
	},
	
	_options : Ember.computed({
		get : function(){
			return Ember.A();
		}
	}),
	
	_optionFn : null,
	
	_optionProps : null,
	
	isLoading : false,
	
	_controlsLoaded: false,
	
	_optionControls : null,
	
	sortProperties: null,
	sortAscending: true,
	
	isSorted: Ember.computed.notEmpty('sortProperties'),
	
//	orderBy:Ember.SortableMixin.mixins[1].properties.orderBy,
//	sortFunction:Ember.SortableMixin.mixins[1].properties.sortFunction,
	
	init : function() {
		this._super();
		if(!this.sortProperties) {
			this.set('sortProperties',['index']);
		}
		this.set('_optionControls',Ember.A());
		if(this._optionFn) {			
			var optionProps=this._optionProps ? this._optionProps+',_form._model' : '_form._model';
			// TODO: We might want an assertion here if we watch an undefined property
			optionProps=optionProps.split(',');
			optionProps.forEach((prop) =>{
				this.addObserver(prop,this,this._getOptions);
			});
			this._getOptions();
		}
	},
	
	createOption:function(args) {
		if(args.caption instanceof Ember.ComputedProperty) {
			if(args.caption._meta.i18nDefaultValue!==undefined) {
				Ember.deprecate('furnace-forms: don\'t append I18n computed properties to shallow option objects, use I18n.text instead',undefined,{id:'furnace-forms:options-i18n-computed',until:'Ember 2.4'});
				args.caption=I18n.text(args.caption._meta.i18nDefaultValue);
			} 		
		}
		// FIXME: should check for computed control explicitly and possibly throw exception
		if(args.control instanceof Ember.ComputedProperty) {
			args.control=args.control._meta;
		}		
		return ControlOption.create(Ember.getOwner(this).ownerInjection(),args);
	},
	
	createOrUpdateOption:function(args) {
		var exists=this.get('_options').findBy('value',args.value);
		if(exists) {
			if(args.control) {
				args.control=args.control._meta;
			}
			if(args.caption instanceof Ember.ComputedProperty) {
				if(args.caption._meta.i18nDefaultValue) {
					Ember.deprecate('furnace-forms: don\'t append I18n computed properties to shallow option objects, use I18n.text instead',undefined,{id:'furnace-forms:options-i18n-computed',until:'Ember 2.4'});
					args.caption=I18n.text(args.caption._meta.i18nDefaultValue);
				} 						
			}
			exists.setProperties(args);
			return exists;			
		}
		return this.createOption(args);
	},
	
	optionAt : function(index) {
		return this.get('_options').objectAt(index);
	},
	
	optionIndex : function(option) {
		return this.get('_options').indexOf(option);
	},
	
	addOption : function(option) {
		if(!(option instanceof ControlOption)) {
			option=this.createOption(option);
		}
		option.set('index',this.get('_options').length+1);
		return this.get('_options').addObject(option);
	},
	
	addOptions: function(options) {
		var indexCount=1;
		options.forEach(function(option,index){
			if(!(option instanceof ControlOption)) {
				option=this.createOrUpdateOption(option);
				options[index]=option;
			}	
			if(!this.get('_options').includes(option)) {
				option.set('index',this.get('_options').length+indexCount);
				indexCount++;
			}
		},this);
		return this.get('_options').addObjects(options);
	},
	
	setOptions: function(options) {
		options=options.toArray();
		options.forEach(function(option,index){
			if(!(option instanceof ControlOption)) {
				option=this.createOrUpdateOption(option);
				options[index]=option;
			}	
			option.set('index',index+1);
		},this);
		this.get('_options').setObjects(options);
		this._loadOptionControls();
	},
	
	removeOption: function(option) {
		return this.get('_options').removeObject(option);
	},
	
	removeOptions:function(options) {
		return this.get('_options').removeObjects(options);
	},
	
	clearOptions: function() {
		return this.get('_options').clear();
	},
	
	_getOptions: function() {
		if(this.get('_form._model')===undefined) {
			Ember.warn('furnace-forms: '+this+' not loading options, form model not ready',false,{id:'furnace-forms:control.options-support.no-model'});
			return;
		}	
		if(!this.hasModel()) {
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
						_self.setOptions(value);
					} else { 
						_self.setOptions(options);
					}
				}
			});						
		} else {
			if(value!==undefined) {
				this.setOptions(value);
			} else { 
				this.setOptions(options);
			}
		}
	},
	
//	_initOptions : Ember.on('init',function() {
//		if(this.hasModel()) {			
//			Ember.run.scheduleOnce('sync',this,this._getOptions);
//		} 
//	}),
	
	_loadOptionControls : Ember.observer('_options,_options.[]',function() {
		
		var control=this;
		var options=this.get('_options');
				
		var optionControls=this._optionControls;
		var oldControls=optionControls.toArray();
		
		if(this.isDestroying) {
			return;
		}
		options.forEach(function(option,index) {
			var oldControl=optionControls.objectAt(index);
			if(oldControl) {					
				oldControls.removeObject(oldControl);
				oldControl.set('_option',option);
			} else {
				optionControls.pushObject(getControl.call(control,index,{ options:{_controlType:Option}},{_panel:control,
					_option:option}));
			}
			
		});
		if(oldControls.length) {
			oldControls.forEach(function(oldControl) {
				optionControls.removeObject(oldControl);
				oldControl.destroy();
			});
		}
		if(this._controlsLoaded===true) {
			Ember.run.scheduleOnce('sync',this,this.notifyPropertyChange,'optionControls');
		}
		this._controlsLoaded=true;
	}),
	
	optionControls : Ember.computed('sortProperties.[]',{
		get : function() {
			if(!this._controlsLoaded) {
				this._loadOptionControls();
			}
			
			if(!this._optionControls) {
				return Ember.A();
			}
			var content = this._optionControls;
			var isSorted = this.get('isSorted');
			if (content && isSorted) {
				return content.sortBy.apply(content,this.sortProperties);
			}
			
			return content;
		}
	}).readOnly(),
	
	controls: Ember.computed.union('_controls','_optionControls').readOnly(),
	
//	_updateOptions : function(newOptions) {		
//		if(!newOptions || !newOptions.length) {
//			return newOptions;
//		}
//		newOptions.forEach(function(option,index) {
//			option.set('index',index+1);
//			option.set('selected',false);
//		});
//		return newOptions;
//	},
	
	options : Ember.computed.alias('_options'),
	
	_controlDirtyObserver: Ember.observer('_controls.@each.isDirty,_optionControls.@each.isDirty',function(){			
		this.setDirty(this._dirty);
	}),
	
	willDestroy: function() {
		// Only destroy options if we have an optionFn
		if(!this._optionsStatic) {
			this.get('_options').invoke('willDestroy');
		}
		this._super();
	},
	
	destroy: function() {
		// Only destroy options if we have an optionFn
		if(!this._optionsStatic) {
			this.get('_options').invoke('destroy');
		}
		this._super();
	},
	
});