
// some constants:
trilogy._zoneInventoryDialog = function(opts) {
   var iid = this;

   $.extend(this, {}, opts);

   
   //initializers
   iid.expanded = false;
   iid.zone = undefined;
   iid.allRows = [];

   if (iid.filters.filter(function(f) {
      if (f.type==FILTER_ZONENAMES) iid.zone = trilogy.db.getZoneByShortName(iid.filters.filter(function(f) {return f.type==1})[0].zoneNames[0]);
      if (f.type==FILTER_ZONEIDS) iid.zone = trilogy.db.getZoneByID(iid.filters.filter(function(f) {return f.type==6})[0].zoneIDs[0]);

      if (f.type==FILTER_ZONENAMES || f.type==FILTER_ZONEIDS || f.type==FILTER_ITEMIDS) return true;
   }).length==0) return false;   // must have a FILTER_ZONEIDS or FILTER_ZONENAMES filter


   iid.construct = function() {
      iid.body = trilogy.parts.children("#zone-inventory-dialog-parts > .body").clone();
      iid.filterarea = iid.body.find(".top");
      iid.body.dialog({
         dialogClass: "zone-inventory-dialog",
         autoOpen: false,
         height:600,
         width:1100,
         minWidth:915,
         minHeight: 400,
         resizable: true,
         title: "Item Search",
         buttons:{"Minimize": iid.minimize, "Close": iid.goAway},
         //beforeClose: iid.goAway,
         close: iid.destroy
      });
      iid.parentBody = iid.body.parent(".ui-dialog");
      iid.body.html("<br>Loading...");
      //iid.renderFilters();
      iid.fetchInventory();
      iid.show();
   }
   
   // iid events
   iid.onLiveFilterChanged = function(event) {
      var filterValue = iid.txtLiveFilter.val().toLowerCase();
      
      if (iid.txtLiveFilter.val().trim().length==0) {
         for (var i=0;i<iid.allRows.length;i++) {
            iid.allRows[i].show();
         }
         return;
      }

      for (var i=0;i<iid.allRows.length;i++) {
         if (iid.allRows[i].highlighter.text().toLowerCase().indexOf(filterValue) == -1) {
            iid.allRows[i].hide();
         } else {
            iid.allRows[i].show();
         }
      }
   }

   // iid methods
   iid.concatFilterTypes = function(type, field) {
      var r = "";
      for (var i=0;i<iid.filters.length;i++) {
         if (iid.filters[i].type == type) {
            r = r + iid.filters[i][field] + ", ";
         }
      }
      return r.substr(0, r.length-2);
   }
   iid.filtersHave = function(field, val) {
      for (var i=0;i<iid.filters.length;i++) {
         if (iid.filters[i][field] == val) return true;
      }
      return false;   
   }
   iid.renderFilters = function() {
      for (var i=0;i<iid.filters.length;i++) {
         new iid.filterbox(iid.filters[i]);
      }
   }
   iid.fetchInventory = function() {
      trilogy.action({m:2, filters: iid.filters}, function(data) {
         console.log("zid fetch:",data);
         iid.allRows.length = 0;
         iid.body.empty();
         iid.data = data.inventory;
         for (var i=0;i<iid.data.length;i++) {

            if (i+1<iid.data.length && iid.data[i+1].itemID==iid.data[i].itemID) {
               while (i+1<iid.data.length && iid.data[i+1].itemID==iid.data[i].itemID) {
                  iid.data[i+1].source = iid.data[i].source|iid.data[i+1].source;
                  i++;
               }
            }

            var row = new iid.itemRow({data:iid.data[i]})
            iid.allRows.push(row);
         }

         iid.showLiveFilter();
      }, function(data) {
         console.log("zone inventory dialog data error: ", data.responseText);
      });
   }
   iid.showLiveFilter = function() {
      iid.txtLiveFilter = trilogy.parts.children("#zone-inventory-dialog-parts > input").clone();
      iid.body.parent().append(iid.txtLiveFilter);

      iid.txtLiveFilter.on({"input propertychange paste": iid.onLiveFilterChanged});
   }
   iid.minimize = function() {
      iid.floaterTab = iid.itemTab = new trilogy.leftfloater.item({
         onClick: iid.restore,
         label: "Zone Inventory",
         label2: iid.concatFilterTypes(1, "zonename")
      });
      iid.body.parent(".ui-dialog").hide();
      iid.floaterTab.body.toggleClass("zone-bg", true);
   }
   iid.restore = function() {
      iid.body.parent(".ui-dialog").show();
   }
   iid.show = function() {
      iid.body.dialog("open");
   }
   iid.destroy = function() {
      window.setTimeout(function() {
         var poofParent = iid.body.parent();
         console.log("poof");
         trilogy.replaceHtml(iid.body[0], "");
         window.setTimeout(function() {
            poofParent.remove();
            delete iid;
         }, 200);
      },200);
   }
   iid.goAway = function() {
      iid.body.dialog("close");
   }
   
   // iid child objects
   this.filterbox = function(filterdata) {
      var fb = this;

      fb.construct = function() {
         fb.body = trilogy.parts.children("#zone-inventory-dialog-parts > .filterbox").clone();
         fb.renderLabel();
         fb.body.appendTo(iid.filterarea);
      }

      fb.renderLabel = function() {
         if (filterdata.type == FILTER_ZONE) {
            fb.body.find(".label").text("Zone: " + filterdata.zonename);
         } else if (filterdata.type == FILTER_STAT) {
            fb.body.find(".label").text("Stat: " + filterdata.statname);
         } else if (filterdata.type == FILTER_SOURCE) {
            fb.body.find(".label").text("Source: " + filterdata.sourcename);
         }
      }

      fb.construct();
      return this;
   }
   this.itemRow = function(opts) {
      var row = this;

      $.extend(this, {}, opts);

      // initializers
      row.expanded = false;
      row.expansionDataLoaded = false;
      row.item = undefined;
      row.visible = true;

      row.construct = function() {
         row.body = trilogy.parts.children("#zone-inventory-dialog-parts > .listitem").clone();
         row.highlighter = row.body.find(".highlighter");
         //row.body.find(".name").text(row.data.name);
         row.item = new trilogy._item({data: row.data, previewer: row.body.find(".preview")});
         row.body.find(".name").html( row.item.body );
         row.body.find(".id").text(row.data.itemID);
         row.body.find(".type").text(row.item.getType());
         row.body.find(".slot").text(row.item.getSlot());
         row.body.find(".source").text(row.buildSources());
         row.body.find(".highlighter").bind("click", row.onRowClick);
         row.body.appendTo(iid.body);
         return this;
      }

      // itemRow event handlers
      row.onRowClick = function(event) {
         row.toggleExpansion();
         console.log("clicked row data:", row.data);
      }

      // itemRow methods
      row.hide = function() {
         if (row.visible==true) {
            row.body.hide();
            row.visible = false;
         }
      }
      row.show = function() {
         if (row.visible==false) {
            row.body.show();
            row.visible = true;
         }
      }
      row.buildSources = function() {
         var sources = [];

         for (i in trilogy.db.itemSourceTypeIDs) {
            if ( (row.item.data.source & trilogy.db.itemSourceTypeIDs[i].ID) == trilogy.db.itemSourceTypeIDs[i].ID) {
               sources.push(trilogy.db.itemSourceTypeIDs[i].name);
            }
         }

         return sources.join(" / ");
      }
      row.toggleExpansion = function() {
         row.expanded = !row.expanded;
         if (row.expanded == true) {row.expand()} else {row.collapse()}
      }
      row.expand = function() {
         row.body.find(".loader").toggleClass("active", true);
         row.loadExpansionData(function() {
            row.body.find(".loader").toggleClass("active", false);
            row.body.find(".indicator").toggleClass("ui-icon-triangle-1-e", false).toggleClass("ui-icon-triangle-1-s", true);
            row.body.find(".expansion").slideDown(0);
            row.body.toggleClass("expanded", true);
         });
      }
      row.collapse = function() {
         row.body.find(".indicator").toggleClass("ui-icon-triangle-1-e", true).toggleClass("ui-icon-triangle-1-s", false);
         row.body.toggleClass("expanded", false);
         row.body.find(".expansion").slideUp(0);
      }
      row.loadExpansionData = function(callback) {
         if (row.expansionDataLoaded == true) {
            if (typeof callback != "undefined") callback();
            return;
         }
         row.body.find(".loader").toggleClass("active", true);
   
         trilogy.action({m:3, itemIDs: [row.data.itemID]}, function(data) {
            console.log("expand:",data);
            row.expansionDataLoaded = true;
            var sublistitem = trilogy.parts.children("#zone-inventory-dialog-parts > .sublistitem");
            
            for (var i=0, l=data["merchant_data"].length;i<l;i++) {
               var d = data["merchant_data"][i];

               if (d.name == null || d.short_name == null) continue;
               row.body.find(".expansion .sellersources .listing").append( sublistitem.clone().append(new trilogy._npc(d), " @ ", new trilogy._zone({short_name:d.short_name}).body));
            }
            
            for (var i=0, l=data["drop_data"].length;i<l;i++) {
               var d = data["drop_data"][i];

               if (d.name == null || d.short_name == null) continue;
               row.body.find(".expansion .lootsources .listing").append( sublistitem.clone().append(new trilogy._npc(d), " @ ", new trilogy._zone({short_name:d.short_name}).body));
            }

            for (var i=0, l=data["quest_rewards"].length;i<l;i++) {
               var d = data["quest_rewards"][i];

               if (d.name == null || d.short_name == null) continue;
               row.body.find(".expansion .questsources .listing").append( sublistitem.clone().append(new trilogy._npc(d), " @ ", new trilogy._zone({short_name:d.short_name}).body));
            }



            if (typeof callback != "undefined") callback();
         }, function(data) {
            if (typeof callback != "undefined") callback();
            console.log("expansion non-json return:", data.responseText)
         });
      }

      row.construct();
      return this;
   }
   

   debug.zoneInventoryDialog = this;
   iid.construct();
   return this;
      
}

