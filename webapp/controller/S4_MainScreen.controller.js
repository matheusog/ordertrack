sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	"sap/ui/Device",
	'sap/ui/model/Filter', 
	'sap/ui/model/FilterOperator', 
], function(BaseController, Device, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S4_MainScreen", {

		onInit: function() {
			this.getRouter().getRoute("mainScreen4").attachMatched(this._routeMatched, this);
			this._oComponent	= this.getOwnerComponent();
			this._oBundle		= this._oComponent.getModel('i18n').getResourceBundle();
			
			this.getView().setModel( this.oGenericModel.createDefaultViewModel(), 'view');
			this._geoLoading();
		}, 
		
		_routeMatched: function(oEvent) {
			var selTranspId = oEvent.getParameter('arguments').docTranspId;
			var aFilter = []; 
			aFilter.push(new Filter('TranspId', FilterOperator.EQ, selTranspId)); 
			this._requestOdataGeo(aFilter);
		},
		
		_requestOdataGeo: function(oFilters){
			
			var oViewModel		= this.getView().getModel('view');
			var oGeoLocalizacao = this.getOwnerComponent().getModel('geoLocalizacao');
			var oGeoMap  		= this.getView().byId('GeoMap');

			var onSuccess = function(oResultData, oResponse) {
				oGeoLocalizacao.setData(oResultData.results[0].toGeoLocalizacao.results);
				var oPos = oGeoLocalizacao.oData[0].Longitude + ';' + oGeoLocalizacao.oData[0].Latitude + ';0';
				//oGeoMap.setInitialPosition(oPos)
				oViewModel.setProperty('/busy', false);
			};
			
			var onError = function(oError) {
				oViewModel.setProperty('/busy', false);
				if(oError.responseText){
					var oResponse = JSON.parse(oError.responseText);
				}
			};
			
			var oModel = this.getOwnerComponent().getModel('Carteira'); 
			oModel.read('/GEO_FILTERSet', 
				{
					urlParameters: {
						$expand: 'toGeoLocalizacao'
					}, 
					filters: oFilters,
					success: onSuccess, 
					error: onError
				
			});
			oViewModel.setProperty('/busy', true);
		}, 
		
		_geoLoading: function() {
			
			var oGeoMap = this.getView().byId("GeoMap");
			var oMapConfig = {
			  "MapProvider": [{
			    "name": "HEREMAPS",
			    "type": "HERETerrainMap",
			    "description": "",
			    "tileX": "256",
			    "tileY": "256",
			    "maxLOD": "20",
			    "copyright": "Tiles Courtesy of HERE Maps",
			    //Exemplos de exibição do mapa = https://developer.here.com/documentation/map-tile/topics/examples.html
			    "Source": [{
			        "id": "s1",
			        "url": "https://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/reduced.day/{LOD}/{X}/{Y}/256/png8?app_id=a9DceSVlMOTq3eSej8Dg&app_code=p2t3V4MZa7T314zVYr0XjA"
			      }, {
			        "id": "s2",
			        "url": "https://2.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/reduced.day/{LOD}/{X}/{Y}/256/png8?app_id=a9DceSVlMOTq3eSej8Dg&app_code=p2t3V4MZa7T314zVYr0XjA"
			      }
			    ]
			    
			    /**"Source": [{
			        "id": "s1",
			        "url": "https://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?app_id=a9DceSVlMOTq3eSej8Dg&app_code=p2t3V4MZa7T314zVYr0XjA"
			      }, {
			        "id": "s2",
			        "url": "https://2.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?app_id=a9DceSVlMOTq3eSej8Dg&app_code=p2t3V4MZa7T314zVYr0XjA"
			      }
			    ]**/
			    
			  }],
			  "MapLayerStacks": [{
			    "name": "DEFAULT",
			    "MapLayer": {
			      "name": "layer1",
			      "refMapProvider": "HEREMAPS",
			      "opacity": "1.0",
			      "colBkgnd": "RGB(255,255,255)"
			    }
			  }]
			};
			
			oGeoMap.setMapConfiguration(oMapConfig);
			oGeoMap.setRefMapLayerStack("DEFAULT");		
			
		}

	});

});