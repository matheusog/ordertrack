sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	'sap/ui/model/Filter', 
	'sap/ui/model/FilterOperator', 
	'sap/ui/model/json/JSONModel'
	
], function(BaseController, Filter, FilterOperator, JSONModel) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S1_MainScreen", {
		
		_mVizDonutProperties: {
			title: {
				visible: true,
				text: ''
			}, 
			legendGroup: {
				layout: {
					alignment: 'topLeft', 
					position: 'top'
				}
			},
			plotArea: {
				dataLabel: {
					visible: true
				}
			}
		}, 
		
		onInit: function() {
			this.getRouter().getRoute("mainScreen").attachMatched(this._routeMatched, this);
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();
			
			this.getView().setModel( this.oGenericModel.createDefaultViewModel(), 'view');
			
			this._initializeControls(); 
			this._initializeVizChart();	
			this._requestOdata();
			
			// Setar Data
			var oModel = new JSONModel();
			oModel.setData({ dateValue: new Date() });
			this.getView().setModel(oModel);
			
		},
		
		onSearch: function(oEvent) {
			var aFilters		= this._createFilter(); 
			
			//var oFilters; 
			//if(aFilters.length) { 
			//	oFilters = new Filter({filters: aFilters, and: true}); 
			//}
			this._requestOdata(aFilters); 
		}, 
		
		onSelectDataBaseline : function(oEvent){
			var aData = oEvent.getParameter('data');
			var oSelectedObject = aData[0].data;
			
			var oVizBaseline 	= oEvent.getSource(); 
			var oDataset 		= oVizBaseline.getDataset();
			var oBinding 		= oDataset.getBinding('data');
			var oContext 		= oBinding.getContexts()[oSelectedObject._context_row_number];
			var oObject			= oContext.getObject(); 
			
			var aFilters = this._createFilter(); 
			aFilters.push(new Filter('Id', FilterOperator.EQ, oObject.Id)); 
			
			this._requestOdataDetail(aFilters);
			
			oEvent.getSource().vizSelection(
				oEvent.getParameter('data'), { clearSelection: true }
			);
		}, 
		
		onSelectDataReplanejado : function(oEvent){
			var aData = oEvent.getParameter('data');
			var oSelectedObject = aData[0].data;
			
			var oVizReplanejado	= oEvent.getSource(); 
			var oDataset 		= oVizReplanejado.getDataset();
			var oBinding 		= oDataset.getBinding('data');
			var oContext 		= oBinding.getContexts()[oSelectedObject._context_row_number];
			var oObject			= oContext.getObject(); 
			
			var aFilters = this._createFilter(); 
			aFilters.push(new Filter('Id', FilterOperator.EQ, oObject.Id)); 
			
			this._requestOdataDetail(aFilters);
			
			oEvent.getSource().vizSelection(
				oEvent.getParameter('data'), { clearSelection: true }
			);
		}, 
		
		_createFilter: function() {
			var aFilters		= [], 
				sPlant			, 
				sCustomer		, 
				dCreationDate	= this._oDateCreation.getDateValue();
				
			if(this._oComboWerks.getSelectedItem()) {
				sPlant= this._oComboWerks.getSelectedItem().getBindingContext('filterCentro').getObject().werks;
			}
			if(this._oComboKunnr.getSelectedItem()) {
				sCustomer= this._oComboKunnr.getSelectedItem().getBindingContext('filterCliente').getObject().kunnr;
			}
			
			
			if(sPlant){
				aFilters.push(new Filter('Centro', FilterOperator.EQ, sPlant));
			}
			if(sCustomer){
				aFilters.push(new Filter('Cliente', FilterOperator.EQ, sCustomer));
			}
			return aFilters;
		}, 
		
		_initializeControls: function() {
			this._oComboWerks	= this.getView().byId("comboWerks");
			this._oComboKunnr	= this.getView().byId("comboKunnr");
			this._oDateCreation = this.getView().byId("dateDataCri");
		},
		
		_initializeVizChart: function() {
			
			var oProp = $.extend({}, this._mVizDonutProperties);
			
			//Donut BASELINE
			oProp.title.text = this._oBundle.getText('s1TitleBaseline');
			this.oVizBaseline = this.getView().byId('idVizBaseline');
			this.oVizBaseline.setVizProperties(oProp);
			
			//Donut REPLANEJADO
			oProp = $.extend({}, this._mVizDonutProperties);
			oProp.title.text = this._oBundle.getText('s1TitleReplanejado');
			this.oVizReplanejado = this.getView().byId('idVizReplanejado');
			this.oVizReplanejado.setVizProperties(oProp);
			
		},
		
		_requestOdata: function(oFilters){
			
			var oViewModel	= this.getView().getModel('view');
			var oDonutChart = this.getOwnerComponent().getModel('donutChart');
			var oDonutChartReplan = this.getOwnerComponent().getModel('donutChartReplan');
			
			var onSuccess = function(oResultData, oResponse) {
				oDonutChart.setData(oResultData.results[0].toBaseline.results);
				oDonutChartReplan.setData(oResultData.results[0].toReplanejado.results);
				oViewModel.setProperty('/busy', false);
			};
			
			var onError = function(oError) {
				oViewModel.setProperty('/busy', false);
				if(oError.responseText){
					var oResponse = JSON.parse(oError.responseText);
				}
			};
			
			var oModel = this.getOwnerComponent().getModel('Carteira'); 
			oModel.read('/CARTEIRA_FILTERSet', 
				{
					urlParameters: {
						$expand: 'toBaseline,toReplanejado'
					}, 
					filters: oFilters,
					success: onSuccess, 
					error: onError
				
			});
			oViewModel.setProperty('/busy', true);
		}, 
		
		_requestOdataDetail: function(oFilters){
			
			var oViewModel	= this.getView().getModel('view');
			
			var onSuccess = function(oResultData, oResponse) {
				oViewModel.setProperty('/busy', false);
			};
			
			var onError = function(oError) {
				oViewModel.setProperty('/busy', false);
				if(oError.responseText){
					var oResponse = JSON.parse(oError.responseText);
				}
			};
			
			var oModel = this.getOwnerComponent().getModel('Carteira'); 
			oModel.read('/CARTEIRA_FILTERSet', 
				{
					urlParameters: {
						$expand: 'toEmbarques'
					}, 
					filters: oFilters,
					success: onSuccess, 
					error: onError
				
			});
			oViewModel.setProperty('/busy', true);
		}, 
		
		_routeMatched : function(oEvent) {

		}
	});

});