sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	'sap/ui/model/Filter', 
	'sap/ui/model/FilterOperator', 
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast'
], function(BaseController, Filter, FilterOperator, JSONModel, MessageToast) {
	"use strict";
	
	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S1_MainScreenP2", {

		onInit: function() {
			this.getRouter().getRoute("mainScreenP2").attachMatched(this._routeMatched, this);
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();
		},
		
		_routeMatched : function(oEvent) {
			
		},

		onSearch: function(oEvent) {
			var aFilters		= []; 
			
			this.onOpenDialog();
			
			if(this.getView().byId('filterDoc').getValue()){
				aFilters.push(new Filter('Document', FilterOperator.EQ, this.getView().byId('filterDoc').getValue()));	
			}
			
			if(this.getView().byId('filterDt').getValue()){
				aFilters.push(new Filter('Tknum', FilterOperator.EQ, this.getView().byId('filterDt').getValue()));	
			}
			
			if(this.getView().byId('filterNf').getValue()){
				aFilters.push(new Filter('NfnumVl', FilterOperator.EQ, this.getView().byId('filterNf').getValue()));	
			}
			
			if(aFilters){ this.NamePressS1Set('-'); }
			this.FilterS1Set(aFilters);	

			this.getRouter().navTo("mainScreen2");
			
			this.onCloseDialog();
		}
		
	});

});