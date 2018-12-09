sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S1_DonutChart", {


		
		onInit: function() {
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();
			
			this.getView().setModel( this.oGenericModel.createDefaultViewModel(), 'view');
			
			this._initializeVizChart();	
			this._requestOdata();
		},
		
		onSelectDataBaseline : function(oEvent){
			var aData = oEvent.getParameter('data');
			var oSelectedObject = aData[0].data;
			
			var oVizBaseline 	= oEvent.getSource(); 
			var oDataset 		= oVizBaseline.getDataset();
			var oBinding 		= oDataset.getBinding('data');
			var oContext 		= oBinding.getContexts()[oSelectedObject._context_row_number];
			var oObject			= oContext.getObject(); 
			
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
			
			oEvent.getSource().vizSelection(
				oEvent.getParameter('data'), { clearSelection: true }
			);
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
			
			var onSuccess = function(oResultData, oResponse) {
				oDonutChart.setData(oResultData.results[0].toBaseline.results);
				oViewModel.setProperty('/busy', false);
			};
			
			var onError = function(oError) {
				oViewModel.setProperty('/busy', false);
			};
			
			var oModel = this.getOwnerComponent().getModel('Carteira'); 
			oModel.read('/CARTEIRA_FILTERSet', 
				{
					urlParameters: {
						$expand: 'toBaseline'
					}, 
					filters: oFilters,
					success: onSuccess, 
					error: onError
				
			});
			oViewModel.setProperty('/busy', true);
		}
		
	});
});