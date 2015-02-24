import Control from './abstract';

export default Control.extend({
	tagName: 'button',
	
	caption: '',
	
	submit: false,
	
	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}
		var name="action";
		return name ;
	}.property(),
	
	click: function() {
		if(this.submit===true) {
			this.get('targetObject').send('submit',this._name);
		}
		else {
			this.get('targetObject').send(this._name,this._panel);
		}
	}
});