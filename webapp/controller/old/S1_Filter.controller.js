sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	'jquery.sap.global',
	'sap/ui/model/json/JSONModel'
], function(BaseController,jQuery,JSONModel) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S1_Filter", {

		onInit: function () {
			this.onSearch();	
		},
		
		onSearch: function () {
			//EXECUTA ODATA DE ACORDO COM OS FILTROS
		},
		
		onReset: function () {
			//Limpa todos os filtros
		}

	});

});