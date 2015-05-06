import Forms from 'furnace-forms';
export default Forms.form( {	
	
	actions : {
		panel1Confirm : function() {
			this.get('panel1').setEnabled(false);
		},
		panel2Confirm : function() {
			this.get('panel2').setEnabled(false);
		},
		
		add : function() {			
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
		
		panel1Confirm : Forms.action({
			actions: {
				click: function() {
					if(this.get('hasPrerequisites')) {
						this.set('value',true);
						this._super();
					}
				}
			}
		}).cond('panel1.input1')
	}),
	
	panel2 : Forms.panel('condition',{
		input2:Forms.input(),
		panel2Confirm: Forms.action({
			actions: {
				click: function() {
					if(this.get('hasPrerequisites')) {
						this.set('value',true);
						this._super();
					}
				}
			}
		}).cond('panel2.input2'),
	}).cond('panel1.input1,panel1.panel1Confirm'),
	
	panel3 : Forms.panel('condition',{
		input3:Forms.input(),
		finish: Forms.action().cond('panel3.input3')
																
	}).cond('panel2,panel2.panel2Confirm')
});