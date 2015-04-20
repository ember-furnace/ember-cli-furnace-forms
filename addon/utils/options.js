export default function inputOptions() {
	if(arguments.length===1) {
		if(typeof arguments[0] ==='function') {
			this._meta.options._optionFn=arguments[0];
			return this;
		} else if(typeof arguments[0]==='string') {
			var prop=arguments[0];
			this._meta.options._optionFn=function() {
				return this.getTarget().get(prop);
			};
			return this;
		}
	}
	
	var options=Ember.A();
	for(var i=0;i<arguments.length;i++) {
		options.push(arguments[i]);
	}
	this._meta.options._options=options;
	
	return this;
}