sap.ui.define([
	"com/arcelor/scm/ordertrack/model/models"
], function(models) {
	"use strict";

	return {
		formatSegmentDisplay : function(fValue, fDocs) {
			return String(fDocs) + ' - ' + String(fValue) + '%';
		}
	};
}, true);