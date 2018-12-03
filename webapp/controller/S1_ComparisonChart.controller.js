sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S1_ComparisonChart", {

		onComparisonPressBar : function(oEvent) {
			var oBar		= oEvent.getSource(); 
			var oContext	= oBar.getBindingContext('embarques'); 
			var oObject		= oContext.getObject();
		}
	});

});