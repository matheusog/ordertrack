sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	'sap/suite/ui/commons/library',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator', 
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast'
], function(BaseController, SuiteLibrary, Filter, FilterOperator, JSONModel, MessageToast) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S3_MainScreen", {

		onInit: function() {
			this.getRouter().getRoute("mainScreen3").attachMatched(this._routeMatched, this);
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();

			this.getView().setModel( this.oGenericModel.createDefaultViewModel(), 'view');
		}, 

		_routeMatched: function(oEvent) {
			var selDocumentType = oEvent.getParameter('arguments').documentType;
			var selDocumentId = oEvent.getParameter('arguments').documentId;
			var selItemId = oEvent.getParameter('arguments').itemId;
			var selFornId = oEvent.getParameter('arguments').fornId;
			
			var aFilter = []; 
			aFilter.push(new Filter('DocumentType', FilterOperator.EQ, selDocumentType)); 
			aFilter.push(new Filter('Document', FilterOperator.EQ, selDocumentId)); 
			aFilter.push(new Filter('Item', FilterOperator.EQ, selItemId)); 
			aFilter.push(new Filter('VbelnVl', FilterOperator.EQ, selFornId)); 
			this._requestOdataFluxo(aFilter);
		},

		onZoomIn: function () {
			this.getView().byId('processflow').zoomIn();
		},

		onZoomOut: function () {
			this.getView().byId('processflow').zoomOut();
		},
		
		onNodePress: function(event) {
			MessageToast.show("Node " + event.getParameters().getNodeId() + " has been clicked.");
		},

		_requestOdataFluxo: function(oFilters){
			
			var oViewModel	 = this.getView().getModel('view');
			var oFluxoNodes  = this.getOwnerComponent().getModel('fluxoNodes');
			var oFluxoLanes  = this.getOwnerComponent().getModel('fluxoLanes');

			var onSuccess = function(oResultData, oResponse) {
				oFluxoNodes.setData(oResultData.results[0].toFluxoNodes.results);
				oFluxoLanes.setData(oResultData.results[0].toFluxoLanes.results);
				oViewModel.setProperty('/busy', false);
			};
			
			var onError = function(oError) {
				oViewModel.setProperty('/busy', false);
				if(oError.responseText){
					var oResponse = JSON.parse(oError.responseText);
				}
			};
			
			var oModel = this.getOwnerComponent().getModel('Carteira'); 
			oModel.read('/FLUXO_FILTERSet', 
				{
					urlParameters: {
						$expand: 'toFluxoNodes,toFluxoLanes'
					}, 
					filters: oFilters,
					success: onSuccess, 
					error: onError
				
			});
			oViewModel.setProperty('/busy', true);
		}

	});

});