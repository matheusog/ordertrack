sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S1_DonutChart", {

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
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();
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
			
		}
		
	});

});