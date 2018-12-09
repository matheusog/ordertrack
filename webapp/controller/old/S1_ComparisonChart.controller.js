sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	'sap/m/MessageToast'
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S1_ComparisonChart", {
		
		onComparisonPressBar : function(oEvent) {
			//var oBar		= oEvent.getSource(); 
			//var oContext	= oBar.getBindingContext('embarques'); 
			//var oObject	= oContext.getObject();
			//MessageToast.show(oObject.id);
			
			//var selectedEmbarquetId 	= oEvent.getSource().getBindingContext('embarques').getProperty("id");
			//MessageToast.show(selectedEmbarquetId);
			
			//this.getRouter().navTo("itensCarteira", {}, true);

			var selEmbarqueId = oEvent.getSource().getBindingContext('embarques').getProperty("id");
			//MessageToast.show(selEmbarqueId);
				
			if (oEvent.getSource().getBindingContext('embarques').getProperty("peso_bruto") == "0") {
				MessageToast.show("Nenhum item disponivel para esse embarque");	
			} else {
				this.getRouter().navTo("itensCarteira", { embarqueId: selEmbarqueId });	
			}

		}
	});

});