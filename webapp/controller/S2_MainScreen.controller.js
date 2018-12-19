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
	
		EXCEL_FORMAT:		'xls',
		PDF_FORMAT: 		'pdf', 
		DEFAULT_FILENAME:	"Report", 
		PATH_EXPORT_REPORT: "/GRUWEB/ManutencaoApresentacoes/ExportReportXls", 
		
		onInit: function() {
			this.getRouter().getRoute("mainScreen2").attachMatched(this._routeMatched, this);
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();
			
			var oViewModel = new JSONModel({
				searchTermIms:			"",
				searchTermImsOld:		"",
				searchTermCloseup:		"",
				searchTermCloseupOld:	"",
				busy: false
			});
			
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
		
		onDataExport: sap.m.Table.prototype.exportData || function(oEvent) {
	
			if(oEvent.getParameter("item").getText() == 'Excel'){
				this._export(this.EXCEL_FORMAT);
			}else if (oEvent.getParameter("item").getText() == 'Pdf'){
				this._export(this.PDF_FORMAT);
			}
		},
		
		_export: function(sFormat) {
			var oViewModel		= this.getView().getModel('view');
			oViewModel.setProperty("/busy", true);
			var sPath;

			switch (sFormat) {
				case this.EXCEL_FORMAT:
					sPath = this.PATH_EXPORT_REPORT ;
					break;
				case this.PDF_FORMAT:
					sPath = this.PATH_EXPORT_REPORT ;
					break;
				default:
					return;
			}

			var req = new XMLHttpRequest();
			req.open("GET", sPath, true);
			req.responseType = "blob";

			req.setRequestHeader("Content-Type", "application/json");
			//req.setRequestHeader("Authorization", this.getToken(true));

			function handleSuccess(event) {

				oViewModel.setProperty("/busy", false);
				if (req.response && req.response.size > 0) {
					var blob = req.response;
					var link = document.createElement('a');
					link.href = window.URL.createObjectURL(blob);
					link.download = this.DEFAULT_FILENAME + '.' + sFormat;
					link.click();
				} else {
					MessageBox.error(
						this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("s1_export_error"));
				}
			}

			req.onload = handleSuccess.bind(this);
			req.send();
		},
		
		onPressFluxo: function(oEvent) {
			var a;
		},
		
		onPressGeo: function(oEvent) {
			var a;
		}
		
	});

});