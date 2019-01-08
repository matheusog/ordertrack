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

			var onSuccess = function(oResultData, oResponse) {
				oGeoLocalizacao.setData(oResultData.results[0].toGeoLocalizacao.results);
				oViewModel.setProperty('/busy', false);
				var oPosition  = oGeoLocalizacao.oData[0].Longitude + ';' + oGeoLocalizacao.oData[0].Latitude;
				this._setPosition(oPosition);
				this._setListPanel(oGeoLocalizacao.oData[0].Tknum,
								   oGeoLocalizacao.oData[0].Datum,
								   oGeoLocalizacao.oData[0].Uzeit,
								   oGeoLocalizacao.oData[0].Timestamp);
			}.bind(this);
			
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
					async: false,
					success: onSuccess, 
					error: onError
				
			});
			oViewModel.setProperty('/busy', true);
		}, 
			
		_setPosition: function(Position) {
			this.getView().byId('GeoMap').setInitialPosition(Position + ';0');
			this.getView().byId('GeoMap').setCenterPosition(Position);
		},
			
		_setListPanel: function(tknum,data,hora,timestamp) {
			this.getView().byId('listPanel').getItems()[0].setProperty("title",tknum);

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd/MM/yyyy HH:mm:ss"});
			timestamp = oDateFormat.format(new Date(timestamp));
			this.getView().byId('listPanel').getItems()[1].setProperty("title", timestamp);
			//this.getView().byId('listPanel').getItems()[1].setProperty("title",data + '-' + hora);
			//this.getView().byId('listPanel').getItems()[1].setProperty("title", timestamp);
		},

		_geoLoading: function() {
			
			var oGeoMap = this.getView().byId("GeoMap");
			
			//GOOGLE
			var oMapConfig = { 
				"MapProvider": [{ 
					"name": "GMAP", 
					"Source": [{
					  "id": "s1",
					  "url": 
						//"https://mt.google.com/vt/lyrs=s&x={X}&y={Y}&z={LOD}" 
						"https://mt.google.com/vt/x={X}&y={Y}&z={LOD}"
						//"https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&avoid=TOLLS&libraries=places&callback=initMap"
					}] 
				}], 
				"MapLayerStacks": [{ 
					"name": "DEFAULT", 
					"MapLayer": { 
						"name": "layer1", 
						"refMapProvider": "GMAP", 
						"opacity": "1", 
						"colBkgnd": "RGB(255,255,255)" 
					} 
				}] 
		    }; 
		    
			/**
			//HEREMAPS
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
			**/
    
			oGeoMap.setMapConfiguration(oMapConfig);
			oGeoMap.setRefMapLayerStack("DEFAULT");	
			oGeoMap.setInitialZoom(12);

		}

	});

});