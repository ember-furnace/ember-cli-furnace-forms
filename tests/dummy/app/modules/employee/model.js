import DS from 'ember-data';
import Person from 'dummy/modules/person/model';
export default Person.extend({
	position:DS.attr(),

	picture:DS.attr(),
	
	employer: DS.belongsTo('company')
});