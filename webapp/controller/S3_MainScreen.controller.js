sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S3_MainScreen", {

		onInit: function() {
			this.getRouter().getRoute("mainScreen3").attachMatched(this._routeMatched, this);
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
		}
		
	});

});