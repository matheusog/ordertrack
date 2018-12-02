sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S1_MainScreen", {

		_mVizDonutProperties: {
			title: {
				visible: false
			}, 
			plotArea: {
				dataLabel: {
					visible: true
				}
			}
		}, 
		
		onInit: function() {
			//Retira o titulo dos donuts
			this._initializeVizChart();	
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
			
			var oVizBaseline 	= oEvent.getSource(); 
			var oDataset 		= oVizBaseline.getDataset();
			var oBinding 		= oDataset.getBinding('data');
			var oContext 		= oBinding.getContexts()[oSelectedObject._context_row_number];
			var oObject			= oContext.getObject(); 
			
			oEvent.getSource().vizSelection(
				oEvent.getParameter('data'), { clearSelection: true }
			);
		}, 
		
		_initializeVizChart: function() {
			this.getRouter().getRoute("mainScreen").attachMatched(this._routeMatched, this);
			
			//Donut BASELINE
			this.oVizBaseline = this.getView().byId('idVizBaseline');
			this.oVizBaseline.setVizProperties(this._mVizDonutProperties);
			
			//Donut REPLANEJADO
			this.oVizReplanejado = this.getView().byId('idVizReplanejado');
			this.oVizReplanejado.setVizProperties(this._mVizDonutProperties);
		}, 
		
		_routeMatched : function(oEvent) {

		}
	});

});