sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/model/json/JSONModel"
], function(BaseController, MessageToast, MessageBox, Filter, FilterOperator, FilterType, JSONModel) {
	"use strict";

	var selDocumentType, 
		selDocumentId, 
		selItemId, 
		selFornId;
		
	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S5_MainScreen", {

		onInit: function() {
			this.getRouter().getRoute("mainScreen5").attachMatched(this._routeMatched, this);
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();
			
			this.getView().setModel( this.oGenericModel.createDefaultViewModel(), 'view');
		},
		
		_routeMatched: function(oEvent) {
			selDocumentType = oEvent.getParameter('arguments').documentType;
			selDocumentId = oEvent.getParameter('arguments').documentId;
			selItemId = oEvent.getParameter('arguments').itemId;
			selFornId = oEvent.getParameter('arguments').fornId;
		}

	});

});