sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S1_MainScreen", {
		
		onInit: function() {
			this.getRouter().getRoute("mainScreen").attachMatched(this._routeMatched, this);
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();
			
		},
		
		_routeMatched : function(oEvent) {

		}
	});

});