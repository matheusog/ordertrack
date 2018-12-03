sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	'sap/ui/model/json/JSONModel'
], function(BaseController,JSONModel) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S1_MainScreen", {
		
		onInit: function() {
			this.getRouter().getRoute("mainScreen").attachMatched(this._routeMatched, this);
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();
			
			// Setar Data
			var oModel = new JSONModel();
			oModel.setData({ dateValue: new Date() });
			this.getView().setModel(oModel);
		},
		
		_routeMatched : function(oEvent) {

		}
	});

});