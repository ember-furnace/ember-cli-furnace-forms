import Forms from 'furnace-forms';
export default Forms.Form.extend({
	
	actions : {
		panel1Confirm : function() {
			this.get('panel1').setEnabled(false);
		},
		panel2Confirm : function() {
			this.get('panel2').setEnabled(false);
		},
		
		finish : function() {			
			this.get('panel1').setEnabled(true);
			this.get('panel2').setEnabled(true);
			return true;
		},
		panel2Back : function() {
			this.get('panel1').setEnabled(true);
			this.set('panel1.panel1Confirm.value',false);
			this.get('panel2').send('reset');
		},
		panel3Back : function() {
			this.get('panel2').setEnabled(true);
			this.set('panel2Back.panel2BackConfirm.value',false);
			this.get('panel3').send('reset');
		}
	},
	

	panel1 : Forms.panel({
		input1: Forms.input(),
		
		panel1Confirm :Forms.action('conditions.stacked.confirm').on('panel1.input1')
	}),
	
	panel2 : Forms.panel('condition',{
		input2:Forms.input(),
		panel2Confirm:  Forms.action('conditions.stacked.confirm').on('panel2.input2'),
	}).on('panel1.input1,panel1.panel1Confirm'),
	
	panel3 : Forms.panel('condition',{
		input3:Forms.input(),
		finish: Forms.action().on('panel3.input3')

	}).on('panel2,panel2.panel2Confirm')
});