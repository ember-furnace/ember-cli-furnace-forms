import Input from '../abstract';

export default Input.extend({
	index : null,
	
	value : null,
	
	caption : '',
	
	selected : function(key,value){
		if(value!==undefined) {	
			return value;
		}
		else {
			return this.get('_panel.selectedIndex')===this.index;
		}
	}.property('_panel.value'),
		
	showForm:function() {
		return this.get('form') && this.get('selected');
	}.property('form,selected'),
	
});