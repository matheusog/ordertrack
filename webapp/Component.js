sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/arcelor/scm/ordertrack/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("com.arcelor.scm.ordertrack.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			this.getRouter().initialize();
			
			//Filtro Centro
			var oModelCentro = new sap.ui.model.json.JSONModel("/webapp/model/FilterCentro.json");
			this.setModel(oModelCentro, "filterCentro");
			
			//Filtro Cliente
			var oModelCliente = new sap.ui.model.json.JSONModel("/webapp/model/FilterCliente.json");
			this.setModel(oModelCliente, "filterCliente");
			
			//Donut Baseline/Replanejado
			var oModelDonut	= new sap.ui.model.json.JSONModel("/webapp/model/DonutChart.json");
			this.setModel(oModelDonut, "donutChart");
			
			//Donut Baseline/Replanejado
			var oModelEmbarques	= new sap.ui.model.json.JSONModel("/webapp/model/Embarques.json");
			this.setModel(oModelEmbarques, "embarques");
		}
	});
});