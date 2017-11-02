import I18n from 'furnace-i18n';

export default I18n.Translation.extend({
	blank : 'This field can\'t be blank',
	stringTooLong : 'The maximum length for this field is %1$d characters (you have %3$d too many)',
	stringTooShort : 'The minimum length for this field is %1$d characters (you need %3$d more)',
	invalidUrl: 'This does not appear to be a valid url'
});