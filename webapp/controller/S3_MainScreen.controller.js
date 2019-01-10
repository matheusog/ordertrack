sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	'sap/suite/ui/commons/library',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator', 
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/m/Table'
], function(BaseController, SuiteLibrary, Filter, FilterOperator, JSONModel, MessageToast, Table) {
	"use strict";
	
	var selDocumentType, 
		selDocumentId, 
		selItemId, 
		selFornId;

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S3_MainScreen", {

		onInit: function() {
			this.getRouter().getRoute("mainScreen3").attachMatched(this._routeMatched, this);
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();
			this.getView().setModel( this.oGenericModel.createDefaultViewModel(), 'view');
		}, 

		_routeMatched: function(oEvent) {
			selDocumentType = oEvent.getParameter('arguments').documentType;
			selDocumentId = oEvent.getParameter('arguments').documentId;
			selItemId = oEvent.getParameter('arguments').itemId;
			selFornId = oEvent.getParameter('arguments').fornId;
			
			this._requestOdataFluxo(this._loadFilters());
		},

		_loadFilters: function() {
			var aFilter = []; 
			aFilter.push(new Filter('DocumentType', FilterOperator.EQ, selDocumentType)); 
			aFilter.push(new Filter('Document', FilterOperator.EQ, selDocumentId)); 
			aFilter.push(new Filter('Item', FilterOperator.EQ, selItemId)); 
			aFilter.push(new Filter('VbelnVl', FilterOperator.EQ, selFornId)); 
			return aFilter;
		},
		
		onZoomIn: function () {
			this.getView().byId('processflow').zoomIn();
		},

		onZoomOut: function () {
			this.getView().byId('processflow').zoomOut();
		},
		
		onNodePress: function(event) {
			if( event.getParameters().getNodeId() ) {
				//MessageToast.show("Node " + event.getParameters().getNodeId() + " has been clicked.");
			};
		},    

		_requestOdataFluxo: function(oFilters){
			var oViewModel			= this.getView().getModel('view');
			var oFluxoNodes 		= this.getOwnerComponent().getModel('fluxoNodes');
			var oFluxoLanes 		= this.getOwnerComponent().getModel('fluxoLanes');
			
			var onSuccess = function(oResultData, oResponse) {
				//oFluxoNodes.setData(oResultData.results[0].toFluxoNodes.results);
				oFluxoLanes.setData(oResultData.results[0].toFluxoLanes.results);

				var oModelNodes = $.extend([], oResultData.results[0].toFluxoNodes.results);
				for(var i=0; i< oModelNodes.length; i++) {
					
					var oChilds = $.extend([], oModelNodes[i].toChildren.results); 
					oModelNodes[i].Children = [];
					for(var j1=0; j1 < oChilds.length; j1++){
				  		oModelNodes[i].Children.push(oChilds[j1].Node);
					}
					
					var oTexts	= $.extend([], oModelNodes[i].toTexts.results); 
					oModelNodes[i].Texts	= [];
					for(var j2=0; j2 < oTexts.length; j2++){
				  		oModelNodes[i].Texts.push(oTexts[j2].Text);
					}
					
				}
				oFluxoNodes.setData(oModelNodes);
				
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
						$expand: 'toFluxoNodes,toFluxoLanes,toFluxoNodes/toChildren,toFluxoNodes/toTexts'
					}, 
					filters: oFilters,
					async: false,
					success: onSuccess, 
					error: onError
				
			});
			oViewModel.setProperty('/busy', true);
		}
		
	});

});