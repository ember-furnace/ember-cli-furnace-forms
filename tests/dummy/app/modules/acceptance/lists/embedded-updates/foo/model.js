import DS from 'ember-data';

export default DS.Model.extend({
	
	value:DS.attr('number',{defaultValue:null}),
	
	bars: DS.hasMany('acceptance.lists.embedded-updates.bar',{async:true}),
	
});