import DS from 'ember-data';
export default DS.Model.extend({

	firstName : DS.attr('string'),
	
	lastName : DS.attr('string'),

	age : DS.attr('number'),
	
	gender: DS.attr('string'),
	
	bestFriend : DS.belongsTo('person',{inverse: null}),
	
	friends : DS.hasMany('person',{inverse: 'friends'}),
	
	pets : DS.hasMany('pet'),
	
	address : DS.belongsTo('address')
	
});