sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	'sap/m/MessageToast',
    'sap/ui/model/Filter'
], function(BaseController, MessageToast, Filter) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S2_ItensCarteira", {
		
		handleIconTabBarSelect: function (oEvent) {
			var sKey = oEvent.getParameter("key"),
				oBinding = this.getView().getId('Table').getBinding("items"),
				aFilters = [];
			
			aFilters.push(new Filter(new Filter("BaseStatus", "EQ", sKey), true));
			oBinding.filter(aFilters);
		}
		
	});

});