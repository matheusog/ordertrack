sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S2_ItensCarteira", {
		
		onInit: function() {
			this.getRouter().getRoute("itensCarteira").attachMatched(this._routeMatched, this);
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();
		}, 
		
		_routeMatched: function(oEvent) {
			
		}
		
	});

});