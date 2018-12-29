sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/table/TablePersoController"
], function(BaseController, MessageToast, MessageBox, Filter, FilterOperator, JSONModel, Export, ExportTypeCSV, TablePersoController) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S2_MainScreen", {
		
		EXCEL_FORMAT: "xls",
		PDF_FORMAT: "pdf",
		DEFAULT_FILENAME: "Report",
		PATH_EXPORT_REPORT: "/GRUWEB/ManutencaoApresentacoes/ExportReportXls",
		
		onInit: function() {
			this.getRouter().getRoute("mainScreen2").attachMatched(this._routeMatched, this);
			this._oComponent = this.getOwnerComponent();
			this._oBundle = this._oComponent.getModel("i18n").getResourceBundle();
			var oViewModel = new JSONModel({
				searchTermIms: "",
				searchTermImsOld: "",
				searchTermCloseup: "",
				searchTermCloseupOld: "",
				busy: false
			});
			this.getView().setModel(this.oGenericModel.createDefaultViewModel(), "view");
			
			//this._oModelPerson = this._oComponent.getModel("personTable");
			//this._PersonTable(this._oModelPerson);
			
			this._multiHeader();
		},
		
		_routeMatched: function(oEvent) {
			this._requestOdataDetailClk(this.FilterS1Get());
		},
		
		_requestOdataDetailClk: function(oFilters) {
			var oViewModel = this.getView().getModel("view");
			var oItensEmbarque = this.getOwnerComponent().getModel("itensEmbarque");
			var oModelPerson = this.getOwnerComponent().getModel('personTable');
			
			var oModel = this.getOwnerComponent().getModel("Carteira");
			
			oModel.read("/CARTEIRA_FILTERSet", {
				urlParameters: {
					$expand: "toCarteiraItens"
				},
				filters: oFilters,
			    success: function(oResultData, oResponse){
					oViewModel.setProperty("/busy", false);
					oItensEmbarque.setData(oResultData.results[0].toCarteiraItens.results);
			    }.bind(this),
				error: function(oError) {
					oViewModel.setProperty("/busy", false);
					if (oError.responseText) {
						var oResponse = JSON.parse(oError.responseText);
					}
				}
			});
			
			oModel.read('/PERFIL_ITENSSet', {
			    success: function(oResultData, oResponse){
					oModelPerson.setData(oResultData.results);
					this._PersonTable(oModelPerson);
					oViewModel.setProperty("/busy", false);
			    }.bind(this),
				error: function(oError) {
					oViewModel.setProperty("/busy", false);
					if (oError.responseText) {
						var oResponse = JSON.parse(oError.responseText);
					}
				}
			});
			
			oViewModel.setProperty("/busy", true);
		},

		_PersonTable: function(oModelPerson) {
			
			var oModel		= new JSONModel(),
				aSelected	= oModelPerson.getData(),
				aColumns	= [],
				aId			= this.getView().byId("TableItens").getId() + "-OrderTrack---s2MainScreen--",
				aVisible;
				
			for(var i = 0; i < oModelPerson.getData().length; i++){
				
		    	if( aSelected[i].Visible === 'X'){ 
		    		aVisible = true;
		    	} else { 
		    		aVisible = false;
		    	};
		    	
				aColumns[i] = {
				    id:  aId + aSelected[i].Id, 
				    text: aSelected[i].Text,
				    order: aSelected[i].Order,
				    visible: aVisible 
				};
			};

			var oNewData = { aColumns: aColumns };
				
			oModel.setData(oNewData, true);

			var oProvider = {
				
				getPersData: function() {
					var oDeferred = new jQuery.Deferred();
					if (!this._oBundle) {
						this._oBundle = oModel.getData();
					}
					var oBundle = this._oBundle;
					oDeferred.resolve(oBundle);
					return oDeferred.promise();
				},
				
				setPersData: function(oBundle) {
					var oDeferred = new jQuery.Deferred();
					this._oBundle = oBundle;
					oDeferred.resolve();
					return oDeferred.promise();
				},
				
				delPersData: function() {
					var oDeferred = jQuery.Deferred();
					oDeferred.resolve();
					return oDeferred.promise();
				}
				
			};
			
			this._oTPC = new TablePersoController({
				table: this.getView().byId("TableItens"),
				persoService: oProvider
        	}); 
        	
		},
	
		_multiHeader: function() {
			this.getView().byId("multiheaderBlq").setHeaderSpan([4,1,1,1]);
		},

		formatBlqToIcon: function(bCred) {
			if (bCred == "X") {
				return "sap-icon://status-error";
			} else if (bCred == "0") {
				return "sap-icon://status-critical";
			}
		},
		
		formatBlqToColor: function(bCred) {
			if (bCred == "X") {
				return "Negative";
			} else if (bCred == "0") {
				return "Critical";
			}
		},
		
		onPersoButtonPressed: function() {
			this._oTPC.openDialog();
		},

		onDataExport: function(oEvent) {
			if (oEvent.getParameter("item").getText() == "Excel") {
				this._export(this.EXCEL_FORMAT);
			} else if (oEvent.getParameter("item").getText() == "Pdf") {
				this._export(this.PDF_FORMAT);
			}
		},
		
		_export: function(sFormat) {
			var oViewModel = this.getView().getModel("view");
			oViewModel.setProperty("/busy", true);
			var sPath;
			switch (sFormat) {
				case this.EXCEL_FORMAT:
					sPath = this.PATH_EXPORT_REPORT;
					break;
				case this.PDF_FORMAT:
					sPath = this.PATH_EXPORT_REPORT;
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
					var link = document.createElement("a");
					link.href = window.URL.createObjectURL(blob);
					link.download = this.DEFAULT_FILENAME + "." + sFormat;
					link.click();
				} else {
					MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("s1_export_error"));
				}
			}
			req.onload = handleSuccess.bind(this);
			req.send();
		},
		
		onPressFluxo: function(oEvent) {
			var selFornec = oEvent.getSource().getBindingContext("itensEmbarque").getObject().VbelnVl;
			if (selFornec) {
				var selDocType = oEvent.getSource().getBindingContext("itensEmbarque").getObject().DocumentType;
				var selDocument = oEvent.getSource().getBindingContext("itensEmbarque").getObject().Document;
				var selItem = oEvent.getSource().getBindingContext("itensEmbarque").getObject().Item;
				this.getRouter().navTo("mainScreen3", {
					documentType: selDocType,
					documentId: selDocument,
					itemId: selItem,
					fornId: selFornec
				});
			} else {
				MessageToast.show("Item ainda n\xE3o foi fornecido!");
			}
		},
		
		onPressGeo: function(oEvent) {
			var selTransp = oEvent.getSource().getBindingContext("itensEmbarque").getObject().Tknum;
			if (selTransp) {
				this.getRouter().navTo("mainScreen4", {
					docTranspId: selTransp
				});
			} else {
				MessageToast.show("Item sem Transporte atribuido!");
			}
		}
		
	});
});