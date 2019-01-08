sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	'sap/ui/model/Filter', 
	'sap/ui/model/FilterOperator', 
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast'
], function(BaseController, Filter, FilterOperator, JSONModel, MessageToast) {
	"use strict";
	
	var aClkDonut,
		aClkStatus;

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S1_MainScreenP1", {

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
			this.getRouter().getRoute("mainScreenP1").attachMatched(this._routeMatched, this);
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();
			
			this.getView().setModel( this.oGenericModel.createDefaultViewModel(), 'view');
			
			this._initializeControls(); 
			this._initializeVizChart();	
			
			this.onSearch();
		},
		
		_routeMatched : function(oEvent) {
		},

		handleChange: function (oEvent) {
			var sFrom = oEvent.getParameter("from");
			var sTo = oEvent.getParameter("to");
			var bValid = oEvent.getParameter("valid");
			var oEventSource = oEvent.getSource();

			//this._iEvent++;

			if (bValid) {
				oEventSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEventSource.setValueState(sap.ui.core.ValueState.Error);
			}
		},
		
		onSearch: function(oEvent) {
			aClkDonut	= null;
			aClkStatus	= null;
			var aFilters		= this._createFilter(); 
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
			
			aClkDonut	= 'B';
			aClkStatus	= oObject.Id;

			var aFilters = this._createFilter(); 
			aFilters.push(new Filter('ClkDonut', FilterOperator.EQ, aClkDonut)); 
			aFilters.push(new Filter('ClkStatus', FilterOperator.EQ, aClkStatus)); 
			
			this._requestOdata(aFilters);
			
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
			
			aClkDonut	= 'R';
			aClkStatus	= oObject.Id;
			
			var aFilters = this._createFilter(); 
			aFilters.push(new Filter('ClkDonut', FilterOperator.EQ, aClkDonut)); 
			aFilters.push(new Filter('ClkStatus', FilterOperator.EQ, aClkStatus)); 
			
			this._requestOdata(aFilters);
			
			oEvent.getSource().vizSelection(
				oEvent.getParameter('data'), { clearSelection: true }
			);
		}, 
		
		_createFilter: function() {
			var aFilters		= [], 
				i				= 0,
				sValue			,
				aSelectedItems	= [], 
				dDateFrom		,
				dDateTo 		;
				
			if(this._oComboWerks.getSelectedItems()) {
				aSelectedItems = this._oComboWerks.getSelectedItems();
				if(aSelectedItems.length){
					for (i = 0; i < aSelectedItems.length; i++) {
						sValue = aSelectedItems[i].getKey();
						if(sValue){
							aFilters.push(new Filter('Centro', FilterOperator.EQ, sValue));
						}
					}				
				}
			}
				
			if(this._oComboUf.getSelectedItems()) {
				aSelectedItems = this._oComboUf.getSelectedItems();
				if(aSelectedItems.length){
					for (i = 0; i < aSelectedItems.length; i++) {
						sValue = aSelectedItems[i].getKey();
						if(sValue){
							aFilters.push(new Filter('Uf', FilterOperator.EQ, sValue));
						}
					}				
				}
			}
			
			if(this._oComboKunnr.getSelectedItems()) {
				aSelectedItems = this._oComboKunnr.getSelectedItems();
				if(aSelectedItems.length){
					for (i = 0; i < aSelectedItems.length; i++) {
						sValue = aSelectedItems[i].getKey();
						if(sValue){
							aFilters.push(new Filter('Cliente', FilterOperator.EQ, sValue));						
						}
					}				
				}
			}
				
			if(this._oComboCidade.getSelectedItems()) {
				aSelectedItems = this._oComboCidade.getSelectedItems();
				if(aSelectedItems.length){
					for (i = 0; i < aSelectedItems.length; i++) {
						sValue = aSelectedItems[i].getKey();
						if(sValue){
							aFilters.push(new Filter('Cidade', FilterOperator.EQ, sValue));						
						}
					}				
				}
			}
				
			if(this._oComboCanalDist.getSelectedItems()) {
				aSelectedItems = this._oComboCanalDist.getSelectedItems();
				if(aSelectedItems.length){
					for (i = 0; i < aSelectedItems.length; i++) {
						sValue = aSelectedItems[i].getKey();
						if(sValue){
							aFilters.push(new Filter('CanalDist', FilterOperator.EQ, sValue));						
						}
					}				
				}
			}
				
			if(this._oComboSetorAtv.getSelectedItems()) {
				aSelectedItems = this._oComboSetorAtv.getSelectedItems();
				if(aSelectedItems.length){
					for (i = 0; i < aSelectedItems.length; i++) {
						sValue = aSelectedItems[i].getKey();
						if(sValue){
							aFilters.push(new Filter('SetorAtv', FilterOperator.EQ, sValue));						
						}
					}				
				}
			}
				
			if(this._oComboEscVendas.getSelectedItems()) {
				aSelectedItems = this._oComboEscVendas.getSelectedItems();
				if(aSelectedItems.length){
					for (i = 0; i < aSelectedItems.length; i++) {
						sValue = aSelectedItems[i].getKey();
						if(sValue){
							aFilters.push(new Filter('EscVendas', FilterOperator.EQ, sValue));						
						}
					}				
				}
			}
				
			if(this._oComboEquipVendas.getSelectedItems()) {
				aSelectedItems = this._oComboEquipVendas.getSelectedItems();
				if(aSelectedItems.length){
					for (i = 0; i < aSelectedItems.length; i++) {
						sValue = aSelectedItems[i].getKey();
						if(sValue){
							aFilters.push(new Filter('EquipVendas', FilterOperator.EQ, sValue));						
						}
					}				
				}
			}
			
			if(this._oDateCreation.getDateValue()) {
				dDateFrom = this._oDateCreation.getFrom();
				dDateTo = this._oDateCreation.getTo();
				if(dDateFrom){
					if(dDateTo){
						aFilters.push(new Filter('DataCriacao', FilterOperator.BT, dDateFrom, dDateTo));
					}else{
						aFilters.push(new Filter('DataCriacao', FilterOperator.EQ, dDateFrom));	
					}
				}
			}
			
			return aFilters;
		}, 
		
		_initializeControls: function() {
			this._oComboWerks		= this.getView().byId("comboWerks");
			this._oComboUf   		= this.getView().byId("comboUf");
			this._oComboKunnr		= this.getView().byId("comboKunnr");
			this._oComboCidade		= this.getView().byId("comboCidade");
			this._oComboCanalDist	= this.getView().byId("comboCanalDistrib");
			this._oComboSetorAtv	= this.getView().byId("comboSetorAtv");
			this._oComboEscVendas	= this.getView().byId("comboEscVendas");
			this._oComboEquipVendas	= this.getView().byId("comboEquipVendas");
			this._oDateCreation 	= this.getView().byId("dateDataCri");
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
			
			var oViewModel			= this.getView().getModel('view');
			var oDonutChart 		= this.getOwnerComponent().getModel('donutChart');
			var oDonutChartReplan	= this.getOwnerComponent().getModel('donutChartReplan');
			var oChartEmbarques 	= this.getOwnerComponent().getModel('chartEmbarques');
			var oChartStatusCred 	= this.getOwnerComponent().getModel('chartStatusCred');
			var oChartStatusBlq  	= this.getOwnerComponent().getModel('chartStatusBlq');
			
			var onSuccess = function(oResultData, oResponse) {
				oDonutChart.setData(oResultData.results[0].toBaseline.results);
				oDonutChartReplan.setData(oResultData.results[0].toReplanejado.results);
				oChartEmbarques.setData(oResultData.results[0].toEmbarques.results);
				oChartStatusCred.setData(oResultData.results[0].toStatusCred.results);
				oChartStatusBlq.setData(oResultData.results[0].toStatusBlq.results);
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
						$expand: 'toBaseline,toReplanejado,toEmbarques,toStatusCred,toStatusBlq'
					}, 
					filters: oFilters,
					success: onSuccess, 
					error: onError
				
			});
			oViewModel.setProperty('/busy', true);
		}, 
		
		onEmbarquesPressBarr : function(oEvent) {
			
			var selEmbarquePeso = oEvent.getSource().getBindingContext('chartEmbarques').getObject().PesoBruto;	
			if (selEmbarquePeso == "0.000") {
				MessageToast.show("Nenhum item disponivel para esse embarque");	
			} else {
				this.onOpenDialog();
				
				var selEmbarqueId	= oEvent.getSource().getBindingContext('chartEmbarques').getObject().Id;
				var aFilter = this._createFilter(); 
				if(aClkDonut){
					aFilter.push(new Filter('ClkDonut', FilterOperator.EQ, aClkDonut)); 	
				}
				if(aClkStatus){
					aFilter.push(new Filter('ClkStatus', FilterOperator.EQ, aClkStatus)); 
				}
				aFilter.push(new Filter('ClkEmbarque', FilterOperator.EQ, selEmbarqueId)); 
				this.FilterS1Set(aFilter);
				
				this.NamePressS1Set(oEvent.getSource().getBindingContext('chartEmbarques').getObject().Descricao);

				this.getRouter().navTo("mainScreen2");
				//this.getRouter().navTo("mainScreen2", { embarqueId: selEmbarqueId });
				
				this.onCloseDialog();
			}
		},
		
		onStatusCredPressBarr : function(oEvent) {
			
			var selStatusPeso = oEvent.getSource().getBindingContext('chartStatusCred').getObject().Peso;	
			if (selStatusPeso == "0.000") {
				MessageToast.show("Nenhum item disponivel para esse status");	
			} else {
				this.onOpenDialog();
				
				var selStatusId	= oEvent.getSource().getBindingContext('chartStatusCred').getObject().Id;
				var aFilter = this._createFilter(); 
				if(aClkDonut){
					aFilter.push(new Filter('ClkDonut', FilterOperator.EQ, aClkDonut)); 	
				}
				if(aClkStatus){
					aFilter.push(new Filter('ClkStatus', FilterOperator.EQ, aClkStatus)); 
				}
				aFilter.push(new Filter('ClkStatusCred', FilterOperator.EQ, selStatusId)); 
				this.FilterS1Set(aFilter);
				
				this.NamePressS1Set(oEvent.getSource().getBindingContext('chartStatusCred').getObject().Descricao);

				this.getRouter().navTo("mainScreen2");
				//this.getRouter().navTo("mainScreen2", { embarqueId: selEmbarqueId });
				
				this.onCloseDialog();
			}
		},
		
		onStatusBlqPressBarr : function(oEvent) {
			
			var selStatusPeso = oEvent.getSource().getBindingContext('chartStatusBlq').getObject().Peso;	
			if (selStatusPeso == "0.000") {
				MessageToast.show("Nenhum item disponivel para esse status");	
			} else {
				this.onOpenDialog();
				
				var selStatusId	= oEvent.getSource().getBindingContext('chartStatusBlq').getObject().Id;
				var aFilter = this._createFilter(); 
				if(aClkDonut){
					aFilter.push(new Filter('ClkDonut', FilterOperator.EQ, aClkDonut)); 	
				}
				if(aClkStatus){
					aFilter.push(new Filter('ClkStatus', FilterOperator.EQ, aClkStatus)); 
				}
				aFilter.push(new Filter('ClkStatusBlq', FilterOperator.EQ, selStatusId)); 
				this.FilterS1Set(aFilter);
				
				this.NamePressS1Set(oEvent.getSource().getBindingContext('chartStatusBlq').getObject().Descricao);

				this.getRouter().navTo("mainScreen2");
				//this.getRouter().navTo("mainScreen2", { embarqueId: selEmbarqueId });
				
				this.onCloseDialog();
			}
		}
		
	});

});