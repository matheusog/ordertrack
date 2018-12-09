sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	'sap/m/MessageToast'
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S2_ItensCarteira", {
		
		onInit: function() {
			this.getRouter().getRoute("itensCarteira").attachMatched(this._routeMatched, this);
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();
		}, 
		
		_routeMatched: function(oEvent) {
			var selEmbarqueId = oEvent.getParameter('arguments').embarqueId;
			//MessageToast.show(selEmbarqueId);
		}
		
	});

});