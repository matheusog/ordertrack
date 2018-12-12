sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/core/util/Export',
	'sap/ui/core/util/ExportTypeCSV',
], function(BaseController, MessageToast, MessageBox, Export, ExportTypeCSV) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S2_MainScreen", {

		onInit: function() {
			this.getRouter().getRoute("mainScreen2").attachMatched(this._routeMatched, this);
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();
		}, 
		
		_routeMatched: function(oEvent) {
			//var selEmbarqueId = oEvent.getParameter('arguments').embarqueId;
			//MessageToast.show(selEmbarqueId);
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