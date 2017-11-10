import DS from 'ember-data';

export default DS.Model.extend({
	
	foo: DS.belongsTo('acceptance.lists.embedded-updates.foo',{async:false}),
		
});