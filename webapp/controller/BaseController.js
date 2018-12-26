sap.ui.define([
	"sap/ui/core/mvc/Controller", 
	"sap/ui/core/routing/History", 
	"com/arcelor/scm/ordertrack/util/Formatter", 
	"com/arcelor/scm/ordertrack/model/models"
], function(Controller, History, Formatter, Models) {
	"use strict";
	
	var aFiltersGlobal = [];
	
	return Controller.extend("com.arcelor.scm.ordertrack.controller.S0_App", {
		oFormatter: Formatter, 
		oGenericModel: Models, 
		aFiltersGlobal: null,
		
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
		},
		
		FilterS1Set: function(oFilter){
			aFiltersGlobal = oFilter;
		},
		
		FilterS1Get: function(){
			return aFiltersGlobal;
		}
		
	});
});