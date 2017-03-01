//      var defaults = {}; thing.settings = $.extend({}, defaults, opts);

trilogy._itemsearch = function(opts) {
   var is = this;
   
   
   $.extend(this, {
      container: undefined,
   }, opts);

   // initializers
   is.allFilterColumns = [];

   // construct 
   is.construct = function() {
      is.body = trilogy.parts.siblings("#item-search-parts").find(".body").clone();
      is.body.appendTo(is.container);

      is.inpSearch = is.body.find("input.item-search").on({keypress: is.onInpSearchKeypressed});

      is.areaFilterColumnHolder = is.body.find(".filter-column-holder");
      is.setupWeaponFilters();
      is.setupSlotFilters();
      is.setupClassFilters();
      is.setupStatFilters();
   }

   // events
   is.onInpSearchKeypressed = function(event) {
      if (event.keyCode!=13) return;

      var filterData = {};

      if (is.inpSearch.val().trim().length>0) {
         filterData["name"] = is.inpSearch.val().trim();
      }

      is.allFilterColumns.forEach(function(fc) {
         var selectedFilterValues = [];
         
         fc.allFilterLines.forEach(function(filterLine) {
            if (filterLine.inpCheckbox.is(":checked")==true) {
               selectedFilterValues.push({ID:filterLine.filterData.value, value: filterLine.inpFilter.val()});
            }
         });

         if (selectedFilterValues.length>0) filterData[fc.field] = selectedFilterValues;
      });

      console.log(filterData);

      trilogy.action({m:4, filterData: filterData}, function(data) {
         console.log(data);
         var itemIDs = [];

         for (var i=0;i<data.searchResults.length;i++) {
            itemIDs.push(parseInt(data.searchResults[i].itemID));
         }

         var newInventory = new trilogy._zoneInventoryDialog({filters:[{type: FILTER_ITEMIDS, itemIDs: itemIDs}]});
      });

   }

   // methods
   is.setupStatFilters = function() {
      var newFilterColumn = new is._filterColumn({
         field: "attributes",
         width: 210,
         title: "Attributes",
         filters: trilogy.db.attributeTypes.map( function(w) { return {text: w.name, value:w.field, filter: w.filter} })
      });
      is.allFilterColumns.push(newFilterColumn);
   }
   is.setupWeaponFilters = function() {
      var newFilterColumn = new is._filterColumn({
         field: "itemtype",
         title: "Weapon Types",
         filters: $.map(trilogy.db.weaponSkillTypeIDs, function(t) {return {text: t.name, value: t.ID, filter: t.filter}})
      });
      is.allFilterColumns.push(newFilterColumn);
   }
   is.setupSlotFilters = function() {
      var newFilterColumn = new is._filterColumn({
         field: "slots",
         title: "Inventory Slots",
         filters: $.map(trilogy.db.slotTypeIDs, function(t) {return {text: t.name, value: t.ID, filter: t.filter}})
      });
      is.allFilterColumns.push(newFilterColumn);
   }
   is.setupClassFilters = function() {
      var newFilterColumn = new is._filterColumn({
         field: "classes",
         title: "Classes",
         filters: $.map(trilogy.db.classTypeIDs, function(t) {return {text: t.name, value: t.ID, filter: t.filter}})
         //filters: trilogy.db.classTypeIDs.map( function(w) { return {text: w.fullClassName, value:w.ID, filter: w.filter} })
      });
      is.allFilterColumns.push(newFilterColumn);
   }



   // children
   this._filterColumn = function(opts) {
      var fc = this;

      $.extend(this, {
         field: undefined,
         title: undefined,
         width: undefined
      }, opts);

      fc.allFilterLines = [];


      fc.construct = function() {
         fc.body = trilogy.parts.siblings("#item-search-parts").find(".filter-column").clone();
         fc.body.appendTo(is.areaFilterColumnHolder);
         if (typeof fc.width != "undefined") fc.body.css({width: fc.width + "px"});

         fc.lblTitle = fc.body.find(".title").text(fc.title);
         fc.areaLineHolder = fc.body.find(".line-holder");

         for (var i=0;i<fc.filters.length;i++) {
            var newFilterLine = new fc._filterLine({filterData: fc.filters[i]});
            fc.allFilterLines.push(newFilterLine);
         }
      }

      this._filterLine = function(opts) {

         var fl = this;

         $.extend(this, {
            filterData: undefined
         }, opts);

         fl.data;

         fl.construct = function() {
            fl.body = trilogy.parts.siblings("#item-search-parts").find(".filter-line").clone();
            fl.body.appendTo(fc.areaLineHolder);

            fl.body.on({click: fl.onBodyClicked});
            fl.inpCheckbox = fl.body.find("input[type=\"checkbox\"]");
            fl.inpCheckbox.attr("ID", utils.getRandomString(12));
            fl.lblFilter = fl.body.find("label").text(fl.filterData.text).attr("FOR", fl.inpCheckbox.attr("ID"));
            fl.inpFilter = fl.body.find("input[type=\"text\"]"); fl.inpFilter.hide();


            if (fl.filterData.filter==FILTER_TXT_NUMBER||fl.filterData.filter==FILTER_TXT_NUMBER_RANGE) {
               fl.inpFilter.show();
            }


         }

         fl.onBodyClicked = function(event) {
            if (event.target==fl.body[0]) {
               fl.inpCheckbox.prop("checked", !fl.inpCheckbox.is(":checked"));
               return false;
            }
         }

         fl.construct();
         return this;

      }

      fc.construct();
      return this;
   }


   is.construct();
   return this;
}

