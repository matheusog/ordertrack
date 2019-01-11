sap.ui.define([
	"com/arcelor/scm/ordertrack/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/m/TablePersoController"
], function(BaseController, MessageToast, MessageBox, Filter, FilterOperator, FilterType, JSONModel, Export, ExportTypeCSV, TablePersoController) {
	"use strict";
	
	return BaseController.extend("com.arcelor.scm.ordertrack.controller.S2_MainScreen", {
		
		EXCEL_FORMAT: "xls",
		PDF_FORMAT: "pdf",
		DEFAULT_FILENAME: "Report",
		PATH_EXPORT_REPORT: "",
		
		onInit: function() {
			this._loadPersonalization();
			
			this.getRouter().getRoute("mainScreen2").attachMatched(this._routeMatched, this);
			this.getRouter().getRoute("mainScreenP2").attachMatched(this._routeMatchedP2, this);
			this._oComponent = this.getOwnerComponent();
			this._oBundle = this._oComponent.getModel("i18n").getResourceBundle();
			this.getView().setModel(this.oGenericModel.createDefaultViewModel(), "view");
			
			//this._requestOdataPerson();
		},
		
		_loadPersonalization : function() {
			var that = this; 
			
			function fnCallBack(aVariants) {
				var oVariantModel = new JSONModel(),
				oVariantMgmtControl = that.getView().byId("variantManagement");
				oVariantModel.oData.Variants = aVariants;
	            oVariantMgmtControl.setModel(oVariantModel);  

	            //enable save button
	         //   oVariantMgmtControl.oVariantSave.onAfterRendering = 
	         //   	function(){ this.setEnabled(true); };
			}
			
			var oVariantSet = {},
				aVariantKeysAndNames = [], 
				aExistingVariants = []; 
			
			var oComponent = this.getView().getOwnerComponent;
			var oPersonalizationService = sap.ushell.Container.getService("Personalization");
			var oScope = {
			  keyCategory : oPersonalizationService.constants.keyCategory.FIXED_KEY,
			  writeFrequency: oPersonalizationService.constants.writeFrequency.HIGH,
			  clientStorageAllowed : true,
			  validity : 30
			};
			
			//this._oPersonalizer = oPersonalizationService.getTransientPersonalizer(); 
			var oPersId = {
				container: "PersOrdertrackS2", //any
				item: "TableItens" //any- I have used the table name 
			};
			this._oPersonalizer = oPersonalizationService.getPersonalizer(oPersId, oScope, oComponent);
			this._oTPC = new TablePersoController({
				table: this.getView().byId("TableItens"),
				persoService: this._oPersonalizer
        	});
			this._oTPC.activate();
			
			this._oPersonalizationContainer = 
			oPersonalizationService.getContainer("com.arcelor.scm.ordertrack", oScope, oComponent)
			  .fail(function() {
				jQuery.sap.log.error("Loading personalization data failed.");
			})
			.done(function(oContainer) {
	            that._oPersInternalContainer = oContainer;
	            var oVariantSetAdapter = new sap.ushell.services.Personalization.VariantSetAdapter(oContainer);
	            // get the variant set
	            // check if the current variant set exists, If not, add the new variant set to the container
	            oVariantSet = oVariantSetAdapter.getVariantSet('ordertrackS2');
	            if (!oVariantSet) {
	                oVariantSet = oVariantSetAdapter.addVariantSet('ordertrackS2');
	            }
            	
            	aVariantKeysAndNames = oVariantSet.getVariantNamesAndKeys();
	            for(var sKey in aVariantKeysAndNames){
	                if (aVariantKeysAndNames.hasOwnProperty(sKey)) {
	                    var oVariantItemObject = {};
	                    oVariantItemObject.VariantKey = aVariantKeysAndNames[sKey];
	                    oVariantItemObject.VariantName = sKey;
	                    aExistingVariants.push(oVariantItemObject);
	                }
	            }
	            fnCallBack(aExistingVariants);
    			//that.oFruits = oContainer.getItemValue("fruits");
    			//that.oVegetables = oContainer.getItemValue("vegetables");
			});
			//this._oTPC.setPersoService(that._oPersonalizationContainer);
			
		},
		
		onSaveAsVariant: function(oEvent) {
			// get columns data: 
			var aColumnsData = [];
			this.getView().byId("TableItens").getColumns().forEach(function(oColumn, index) {
				var aColumn = {};
				aColumn.id = oColumn.getId();
				aColumn.order = index;
				aColumn.visible = oColumn.getVisible();
				aColumnsData.push(aColumn);
			});
			
			var oSelectedData = aColumnsData; //this._oPersonalizer.getValue();
			//oSelectedFilterData is the json object with the data seleced in the filter bar
	 		this.saveVariant(oEvent.getParameter('name'), oSelectedData, 
		 		function(bSuccess) {
		            //Do the required actions
		        }.bind(this));
		},

		/**
		 * This method is to save the variant
		 * @param {String} sVariantName- Variant name
		 * @param {Object} oFilterData- Filter data object-> consolidated filters in JSON
		 * @param {Function} fnCallBack- the call back function with the array of variants
		 */
		saveVariant: function(sVariantName, oTableData, fnCallBack) {
		    // save variants in personalization container
		    this._oPersonalizationContainer.fail(function() {
		        // call back function in case of fail
		        fnCallBack(false);
		    });
		    this._oPersonalizationContainer.done(function(oPersonalizationContainer) {
		        var oPersonalizationVariantSet ={},
		            oVariant = {},
		            sVariantKey = "";
		         var oVariantSetAdapter = new sap.ushell.services.Personalization.VariantSetAdapter(oPersonalizationContainer);
	            // get the variant set
	            // check if the current variant set exists, If not, add the new variant set to the container
	            oPersonalizationVariantSet = oVariantSetAdapter.getVariantSet('ordertrackS2');
	            if (!oPersonalizationVariantSet) {
	                oPersonalizationVariantSet = oVariantSetAdapter.addVariantSet('ordertrackS2');
	            }
		        
		        //get if the variant exists or add new variant
		        sVariantKey = oPersonalizationVariantSet.getVariantKeyByName(sVariantName);
		        if (sVariantKey) {
		               oVariant = oPersonalizationVariantSet.getVariant(sVariantKey);
		        } else {
		               oVariant = oPersonalizationVariantSet.addVariant(sVariantName);
		        }
		        if (oTableData) {
		            oVariant.setItemValue('Table', JSON.stringify(oTableData));
		        }
		        oPersonalizationContainer.save().fail(function() {
		           //call callback fn with false
		            fnCallBack(false);
		        }).done(function() {
		           //call call back with true
		            fnCallBack(true);
		        }.bind(this));
		    }.bind(this));
		},
		
	
		
		onManageVariant: function() {}, 
		
		onSelectVariant: function(oEvent) {
	        var sSelectedVariantKey = oEvent.getParameter('key');
	        if (sSelectedVariantKey) {
	        	 this.getVariantFromKey(sSelectedVariantKey, 
	        	 function(oSelectedVariant){
		            //this._oPersonalizer.setValue(oSelectedVariant.getItemValue('Table'));
		            //this._oTPC.activate();
		            this._setSelectedVariantToTable(oSelectedVariant.getItemValue('Table'), this.getView().byId('TableItens'));
	            }.bind(this));
	        }
	    }, 
	    
	    getVariantFromKey: function(sVariantKey, fnCallback) {
	        this._oPersonalizationContainer.fail(function() {
	            // call back function in case of fail
	            if (fnCallback) {
	                fnCallback('');
	            }
	        });
	        this._oPersonalizationContainer.done(function(oPersonalizationContainer) {
	            var oPersonalizationVariantSet ={};
	            var oVariantSetAdapter = new sap.ushell.services.Personalization.VariantSetAdapter(oPersonalizationContainer);
	            // check if the current variant set exists, If not, add the new variant set to the container
	            oPersonalizationVariantSet = oVariantSetAdapter.getVariantSet('ordertrackS2');
	            if (!oPersonalizationVariantSet) {
	                oPersonalizationVariantSet = oVariantSetAdapter.addVariantSet('ordertrackS2');
	            }
	            fnCallback(oPersonalizationVariantSet.getVariant(sVariantKey));
	            //oPersonalizationVariantSet.setCurrentVariantKey(sVariantKey);
	            //oPersonalizationContainer.save();
	        });
	    }, 
		
		_setSelectedVariantToTable: function(sData, oTable) {
			if (sData) {
				var oData = JSON.parse(sData);
				var aColumns = oData; //.aColumns; 
				
				// Hide all columns first
				oTable.getColumns().forEach(function(oColumn) {
					oColumn.setVisible(false);
				});
				// re-arrange columns according to the saved variant

				aColumns.forEach(function(aColumn) {
					var aTableColumn = $.grep(oTable.getColumns(), function(el, id) {
						//return el.getProperty("name") === aColumn.fieldName;
						return el.getId() === aColumn.id;
					});
					if (aTableColumn.length > 0) {
						aTableColumn[0].setVisible(aColumn.visible);
						oTable.removeColumn(aTableColumn[0]);
						oTable.insertColumn(aTableColumn[0], aColumn.order);
					}
				}.bind(this));
			}
			// null means the standard variant is selected or the variant which is not available, then show all columns
			else {
				oTable.getColumns().forEach(function(oColumn) {
					oColumn.setVisible(true);
				});
			}
		},
		
		_routeMatched: function(oEvent) {
			this.getOwnerComponent().getModel("itensEmbarque").setData(null);
			if(this.NamePressS1Get()){
				this.getView().byId("sfTitle").setTitle(this.NamePressS1Get());
			}else {
				this.getView().byId("sfTitle").setTitle('TODOS');
			}
			this._requestOdataDetailClk(this.FilterS1Get());
		},
		
		_routeMatchedP2: function(oEvent) {
			this.getOwnerComponent().getModel("itensEmbarque").setData(null);
			this.getView().byId("sfTitle").setVisible(false);
		},

		_requestOdataPerson: function(oFilters) {
			var oVariantTable	= this.getOwnerComponent().getModel("variantTable");
			var oVariantId		= this.getOwnerComponent().getModel("variantId");

			var oModel = this.getOwnerComponent().getModel("Carteira");
			oModel.read("/VARIANT_FILTERSet", {
				urlParameters: {
					$expand: "toVariantTable,toVariantId"
				},
				filters: oFilters,
				async: false,
			    success: function(oResultData, oResponse){
					oVariantTable.setData(oResultData.results[0].toVariantTable.results);
					oVariantId.setData(oResultData.results[0].toVariantId.results);
					this._PersonTable(oVariantTable);
					/**
					if(!oFilters){
						if(oVariantTable.getData()[0].Padrao == true){
							this.getView().byId('variant').setDefaultVariantKey(oVariantTable.getData()[0].Variant);
						}
						this.getView().byId('variant').setInitialSelectionKey(oVariantTable.getData()[0].Variant);
					}
					**/
			    }.bind(this),
				error: function(oError) {
					if (oError.responseText) {
						var oResponse = JSON.parse(oError.responseText);
					}
				}
			});
		},

		_requestOdataPersonSave: function(oVariaveis) {
			var oModel = this.getOwnerComponent().getModel("Carteira");
			
			var onSuccess	= function(){MessageToast.show("Success!");};
			var onError 	= function(){MessageToast.show("Error!");};
			var reqHeaders = {
                    context: this,		// mention the context you want
                    success: onSuccess, // success call back method
                    error: onError, 	// error call back method
                    async: true 		// flage for async true
                };
                
			oModel.create("/VARIANT_TABLESet", oVariaveis, reqHeaders);
		},
		
		_requestOdataDetailClk: function(oFilters) {
			var oViewModel = this.getView().getModel("view");
			var oItensEmbarque = this.getOwnerComponent().getModel("itensEmbarque");

			var oModel = this.getOwnerComponent().getModel("Carteira");
			oModel.read("/CARTEIRA_FILTERSet", {
				urlParameters: {
					$expand: "toCarteiraItens"
				},
				filters: oFilters,
			    success: function(oResultData, oResponse){
					oViewModel.setProperty("/busy", false);
					oItensEmbarque.setData(oResultData.results[0].toCarteiraItens.results);
			    }.bind(this),
				error: function(oError) {
					oViewModel.setProperty("/busy", false);
					if (oError.responseText) {
						var oResponse = JSON.parse(oError.responseText);
					}
				}
			});

			oViewModel.setProperty("/busy", true);
		},

		_PersonTable: function(oModelVariant) {
			
			var oModel		= new JSONModel(),
				aSelected	= oModelVariant.getData(),
				aColumns	= [];
				
			for(var i = 0; i < oModelVariant.getData().length; i++){
				aColumns[i] = {
				    id: 		aSelected[i].Varid, 
				    order:		aSelected[i].Varorder,
					text:		aSelected[i].Vartext,
				    visible:	aSelected[i].Varvisible
				};
			};

			var oNewData = { aColumns: aColumns };
				
			oModel.setData(oNewData, true);

			var oProvider = {
				
				getPersData: function() {
					var oDeferred = new jQuery.Deferred();
					if (!this._oBundle) {
						this._oBundle = oModel.getData();
					}
					var oBundle = this._oBundle;
					oDeferred.resolve(oBundle);
					return oDeferred.promise();
				},
				
				setPersData: function(oBundle) {
					var oDeferred = new jQuery.Deferred();
					this._oBundle = oBundle;
					oDeferred.resolve();
					return oDeferred.promise();
				},
				
				delPersData: function() {
					var oDeferred = jQuery.Deferred();
					oDeferred.resolve();
					return oDeferred.promise();
				}
				
			};
			
			this._oTPC = new TablePersoController({
				table: this.getView().byId("TableItens"),
				persoService: oProvider
        	});
		},
		
		/**
		variantOnSelect: function(oEvent) {
			var filters = [];
			
			var selVariant = oEvent.getSource().getSelectionKey();
			if(selVariant){
	  			var filter = new Filter("Variant", sap.ui.model.FilterOperator.EQ, selVariant);
				filters.push(filter);			
			}

  			this._requestOdataPerson(filters);
		},
		
		variantOnSave: function(oEvent) {
			var oVariaveis = {};
			var oVarTable = [];
			
			var oPerson = this._oTPC._getCurrentTablePersoData().aColumns;

			for(var i = 0; i < oPerson.length; i++){
			
				oVarTable.push({
					'Id': 			oPerson[i].order,
					'Variant': 		oEvent.getParameters().name,
					'Padrao': 		oEvent.getParameters().def,
					'Execucao': 	oEvent.getParameters().exe,
					'Varid':		oPerson[i].id,
					'Varorder':		oPerson[i].order,
					'Varvisible':	oPerson[i].visible
				});

			}
			
			oVariaveis = {value: oVarTable};
			
			this._requestOdataPersonSave(oVariaveis);
		},

		variantOnManage: function(oEvent) {
				
		},
		**/
		
		getAllVariants: function(fnCallBack) {
	        var oPersonalizationVariantSet= {},
	            aExistingVariants =[],
	            aVariantKeysAndNames =[];
	        //get the personalization service of shell
	        this._oPersonalizationService = sap.ushell.Container.getService('Personalization');
	        this._oPersonalizationContainer = this._oPersonalizationService.getPersonalizationContainer("MyVariantContainer");
	        this._oPersonalizationContainer.fail(function() {
	            // call back function in case of fail
	            fnCallBack(aExistingVariants);
	        });
	        this._oPersonalizationContainer.done(function(oPersonalizationContainer) {
	            // check if the current variant set exists, If not, add the new variant set to the container
	            if (!(oPersonalizationContainer.containsVariantSet('MyApplicationVariants'))) {
	                oPersonalizationContainer.addVariantSet('MyApplicationVariants');
	            }
	            // get the variant set
	            oPersonalizationVariantSet = oPersonalizationContainer.getVariantSet('MyApplicationVariants');
	            aVariantKeysAndNames = oPersonalizationVariantSet.getVariantNamesAndKeys();
	            for(var key in aVariantKeysAndNames){
	                if (aVariantKeysAndNames.hasOwnProperty(key)) {
	                    var oVariantItemObject = {};
	                    oVariantItemObject.VariantKey = aVariantKeysAndNames[key];
	                    oVariantItemObject.VariantName = key;
	                    aExistingVariants.push(oVariantItemObject);
	                }
	            }
	            fnCallBack(aExistingVariants);
	        }.bind(this));
	    },

		formatBlqToIcon: function(bCred) {
			if (bCred == "X") {
				return "sap-icon://circle-task-2";
			} else if (bCred == "0") {
				return "sap-icon://circle-task-2";
			} else if (bCred == "A") {
				return "sap-icon://sys-enter-2";
			}
		},
		
		formatBlqToColor: function(bCred) {
			if (bCred == "X") {
				return "Negative";
			} else if (bCred == "0") {
				return "Critical";
			} else if (bCred == "A") {
				return "Positive";
			}
		},
		
		formatReplanToIcon: function(replan) {
			if (replan == true) {
				return "sap-icon://overlay";
			} else{
				return null;
			}
		},

		formatBaseToDesc: function(base) {
			if (base == "01") {
				return "Em Dia";
			} else if (base == "02") {
				return "Em Atraso";
			}
		},
		
		formatBaseToColor: function(base) {
			if (base == "01") {
				return "Success";
			} else if (base == "02") {
				return "Error";
			}
		},
		
		formatTimestamp: function(timestamp) {
			if(timestamp){
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd/MM/yyyy HH:mm:ss"});
				var oText = oDateFormat.format(new Date(timestamp));
				return oText;
			}else {
				return null;
			}
		},
		
		formatItem: function(value) {
			if(value === '000000'){
				return null;
			}else {
				return value;
			}
		},
		
		formatEtapa: function(value) {
			if(value === '0000'){
				return null;
			}else {
				return value;
			}
		},
		
		formatQtdPeso: function(value) {
			if(value === '0.000'){
				return null;
			}else {
				return value;
			}
		},
		
		onPersoButtonPressed: function() {
			this._oTPC.openDialog();
		},

		onDataExport: function(oEvent) {
			if (oEvent.getParameter("item").getText() == "Excel") {
				this._export(this.EXCEL_FORMAT);
			} else if (oEvent.getParameter("item").getText() == "Pdf") {
				this._export(oEvent,this.PDF_FORMAT);
			}
		},
		
		_export: function(oEvent,sFormat) {
			
			var sPath;
			switch (sFormat) {
				case this.EXCEL_FORMAT:
					sPath = this.PATH_EXPORT_REPORT;
					break;
				case this.PDF_FORMAT:
					sPath = this.PATH_EXPORT_REPORT;
					break;
				default:
					return;
			}
			var req = new XMLHttpRequest();
			req.open("GET", sPath, true);
			req.responseType = "blob";
			req.setRequestHeader("Content-Type", "application/json");
			//req.setRequestHeader("Authorization", this.getToken(true));
			function handleSuccess(event) {
				if (req.response && req.response.size > 0) {
					var blob = req.response;
					var link = document.createElement("a");
					link.href = window.URL.createObjectURL(blob);
					link.download = this.DEFAULT_FILENAME + "." + sFormat;
					link.click();
				} else {
					MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("s1_export_error"));
				}
			}
			req.onload = handleSuccess.bind(this);
			req.send();

        },
	
		onPressFluxo: function(oEvent) {
			this.onOpenDialog();
			
			var selDocType = oEvent.getSource().getBindingContext("itensEmbarque").getObject().DocumentType;
			var selDocument = oEvent.getSource().getBindingContext("itensEmbarque").getObject().Document;
			var selItem = oEvent.getSource().getBindingContext("itensEmbarque").getObject().Item;
			var selFornec = oEvent.getSource().getBindingContext("itensEmbarque").getObject().VbelnVl;
			if(!selFornec){
				selFornec = 'not';
			}
			this.getRouter().navTo("mainScreen3", {
				documentType: selDocType,
				documentId: selDocument,
				itemId: selItem,
				fornId: selFornec
			});
			
			this.onCloseDialog();
		},
		
		onPressEvento: function(oEvent) {
			this.onOpenDialog();
			
			var selDocType = oEvent.getSource().getBindingContext("itensEmbarque").getObject().DocumentType;
			var selDocument = oEvent.getSource().getBindingContext("itensEmbarque").getObject().Document;
			var selItem = oEvent.getSource().getBindingContext("itensEmbarque").getObject().Item;
			var selFornec = oEvent.getSource().getBindingContext("itensEmbarque").getObject().VbelnVl;
			if(!selFornec){
				selFornec = 'not';
			}
			this.getRouter().navTo("mainScreen5", {
				documentType: selDocType,
				documentId: selDocument,
				itemId: selItem,
				fornId: selFornec
			});
			
			this.onCloseDialog();
		},
		
		onPressGeo: function(oEvent) {
			var selTransp = oEvent.getSource().getBindingContext("itensEmbarque").getObject().Tknum;
			if (selTransp) {
				this.onOpenDialog();
				
				this.getRouter().navTo("mainScreen4", {
					docTranspId: selTransp
				});
				
				this.onCloseDialog();
			} else {
				MessageToast.show("Item sem Transporte atribuido!");
			}
		},
		

		onSearchP2: function(oEvent) {
			var selDoc,
				selTknum,
				selNfnum,
				aFilters	= []; 
			
			this.onOpenDialog();
			
			if(this.getView().byId('filterDoc').getValue()){
				selDoc = this.getView().byId('filterDoc').getValue();
				aFilters.push(new Filter('Document', FilterOperator.EQ, selDoc));	
			}
			
			if(this.getView().byId('filterDt').getValue()){
				selTknum = this.getView().byId('filterDt').getValue();
				aFilters.push(new Filter('Tknum', FilterOperator.EQ, selTknum));	
			}
			
			if(this.getView().byId('filterNf').getValue()){
				selNfnum = this.getView().byId('filterNf').getValue();
				aFilters.push(new Filter('NfnumVl', FilterOperator.EQ, selNfnum));	
			}
			
			if(!selDoc && !selTknum && !selNfnum) {
				MessageToast.show("Favor inserir algum filtro!");
			}
			
			this.onCloseDialog();
		}
		
	});
});