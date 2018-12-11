sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	'sap/m/MessageToast'
], function(BaseController, MessageToast, Filter) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S2_MainScreen", {

		onInit: function() {
			this.getRouter().getRoute("mainScreen2").attachMatched(this._routeMatched, this);
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();
		}, 
		
		_routeMatched: function(oEvent) {
			//var selEmbarqueId = oEvent.getParameter('arguments').embarqueId;
			//MessageToast.show(selEmbarqueId);
		}
		
	});

});