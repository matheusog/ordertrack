sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator', 
	'sap/ui/model/json/JSONModel',
	'sap/ui/core/util/Export',
	'sap/ui/core/util/ExportTypeCSV',
], function(BaseController, MessageToast, MessageBox, Filter, FilterOperator, JSONModel, Export, ExportTypeCSV) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S2_MainScreen", {

		onInit: function() {
			this.getRouter().getRoute("mainScreen2").attachMatched(this._routeMatched, this);
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();
			
			this.getView().setModel( this.oGenericModel.createDefaultViewModel(), 'view');
		}, 
		
		_routeMatched: function(oEvent) {
			//var selEmbarqueId = oEvent.getParameter('arguments').embarqueId;
			//MessageToast.show(selEmbarqueId);
			this._requestOdataDetailClk(this.FilterGet());
		},
		
		_requestOdataDetailClk: function(oFilters){
			
			var oViewModel		= this.getView().getModel('view');
			var oItensEmbarque  = this.getOwnerComponent().getModel('itensEmbarque');

			var onSuccess = function(oResultData, oResponse) {
				oItensEmbarque.setData(oResultData.results[0].toCarteiraItens.results);
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
						$expand: 'toCarteiraItens'
					}, 
					filters: oFilters,
					success: onSuccess, 
					error: onError
				
			});
			oViewModel.setProperty('/busy', true);
		}, 
		
		onDataExport : sap.m.Table.prototype.exportData || function(oEvent) {
	
			if(oEvent.getParameter("item").getText() == 'Excel'){
					
				var oExport = new Export({
					// Type that will be used to generate the content. Own ExportType's can be created to support other formats
					exportType: new ExportTypeCSV({ separatorChar: ";" }),
					// Pass in the model created above
					models: this.getOwnerComponent().getModel('itensEmbarque'),
					// binding information for the rows aggregation
					rows: {path : "{itensEmbarque>/}"},
					// column definitions with column name and binding info for the content
					columns: [{	
								name : "Documento",
								template : {content: "{itensEmbarque>Document}"}
							}, {
								name : "Item",
								template : {content: "{itensEmbarque>Item}"}
							}, {
								name : "Tipo Documento",
								template : {content: "{itensEmbarque>Type}"}
							}, {
								name : "Fornecimento",
								template : {content: "{itensEmbarque>VbelnVl}"}
							}, {
								name : "Item",
								template : {content: "{itensEmbarque>PosnrVl}"}
							}, {
								name : "Material",
								template : {content: "{itensEmbarque>Matnr}"}
							}, {
								name : "Descrição Material",
								template : {content: "{itensEmbarque>Arktx}"}
							}]
				});
	
				// download exported file
				oExport.saveFile().catch(function(oError) {
					MessageBox.error("Erro ao exportar dados!\n\n" + oError);
				}).then(function() {
					oExport.destroy();
				});
				
			}
		}
		
	});

});