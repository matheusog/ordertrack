sap.ui.define([
	"sap/ui/core/mvc/Controller", 
	"sap/ui/core/routing/History", 
	"com/arcelor/scm/ordertrack/util/Formatter"
], function(Controller, History, Formatter) {
	"use strict";

	return Controller.extend("com.arcelor.scm.ordertrack.controller.S0_App", {
		oFormatter: Formatter, 
		
		getRouter : function() {
			return this.getOwnerComponent().getRouter();
		}, 
		
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("mainScreen", {}, true /*no history*/);
			}
		}
	});
});