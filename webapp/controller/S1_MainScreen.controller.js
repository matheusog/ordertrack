sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast'
], function(BaseController, JSONModel, MessageToast) {
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

		},
		
		onTilePress: function(oEvent){
			this.onOpenDialog();
			
			var oId = this.getView().getId() + '--';
			if(oEvent.getSource().getId() === oId+'idCarteira'){
				this.getRouter().navTo("mainScreenP1");
			}else if(oEvent.getSource().getId() === oId+'idDetalhe'){
				this.getRouter().navTo("mainScreenP2");
			}
			
			this.onCloseDialog();
		}
		
	});

});