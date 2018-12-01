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
			this.getRouter().getRoute("mainScreen").attachMatched(this._routeMatched, this);
			this.oVizBaseline = this.getView().byId('idVizBaseline');
			this._initializeVizChart();	
			
		},
		
		onSelectDataBaseline : function(oEvent){
			var aData = oEvent.getParameter('data');

			var oVizBaseline 	= oEvent.getSource(); 
			var oDataset 		= oVizBaseline.getDataset();
			var oBinding 		= oDataset.getBinding('data');
			var oContext 		= oBinding.getContext(aData[0]._contextRow);
			var oObject			= oContext.getObject(); 
			
			oEvent.getSource().vizSelection(
				oEvent.getParameter('data'), { clearSelection: true }
			);
		}, 
		
		_initializeVizChart: function() {
			this.oVizBaseline.setVizProperties(this._mVizDonutProperties);
		}, 
		
		_routeMatched : function(oEvent) {

		}
	});

});