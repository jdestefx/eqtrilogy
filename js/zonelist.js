//      var defaults = {}; thing.settings = $.extend({}, defaults, opts);

trilogy._zonelist = function(opts) {
   var zl = this;
   
   // defaults:
   $.extend(this, {
      container: undefined
   }, opts);
   
   // zl initializers
   zl.data = {}
   zl.zones = [];
   zl.sorted = {column: "long_name", ascending:true};

   // zl construct 
   zl.construct = function() {
      zl.body = trilogy.parts.children("#zoneparts > .body").clone();
      zl.body.appendTo(zl.container);
      zl.body.find(".colheaders > .col").bind("click", zl.onColumnHeaderClick);
      zl.fetchZoneList();
   }

   // zl event handlers
   zl.onColumnHeaderClick = function(event) {
      var col = $(event.target);
      var sort_field = col.attr("sort_by");
      
      if (zl.sorted.column == sort_field) {
         zl.sorted.ascending = !zl.sorted.ascending;
      } else {
         zl.sorted.column = sort_field;
         zl.sorted.ascending = true;
      }
      zl.data.sort(utils.sort_by(zl.sorted.column, zl.sorted.ascending, function(a){
         if (isNaN(a) == false) a = utils.zero_pad(a, 10);
         return a.toUpperCase()
      }));
   
      zl.renderZoneList();
   }
   
   // zl methods
   zl.fetchZoneList = function() {
      trilogy.action({m:1}, function(data) {
         console.log("zonelist data:" ,data);
         zl.data = data.zone_list;
         zl.renderZoneList();
      });
   }
   zl.renderZoneList = function() {
      zl.clearZoneList();
      zl.container.find(".count").text("(" + zl.data.length + ")");
      for (var i=0;i<zl.data.length;i++) {
         zl.zones.push(new zl.zonelistitem({data: zl.data[i]}));
      }
   }
   zl.clearZoneList = function() {
      zl.body.find(".listitem").remove();
   }

   zl.filter = function(opts) {
      for (var i=0;i<zl.zones.length;i++) {
         if (opts.text == "" || zl.zones[i].data.short_name.toLowerCase().indexOf(opts.text.toLowerCase()) != -1 || zl.zones[i].data.long_name.toLowerCase().indexOf(opts.text.toLowerCase()) != -1) {
            zl.zones[i].body.show();
         } else {
            zl.zones[i].body.hide();
         }
      }
   }

   // z child objects
   this.zonelistitem = function(opts) {
      var zli = this;
      
      $.extend(this,{
         data: undefined
      },opts);

      // initializers
      
      zli.construct = function() {
         zli.body = trilogy.parts.children("#zoneparts > .listitem").clone();
         zli.body.find(".short-name").html( new trilogy._zone({short_name: zli.data.short_name, display: "short"}).body );
         zli.body.find(".long-name").html( new trilogy._zone({short_name: zli.data.short_name, display: "long"}).body );
         zli.body.find(".npc-count").text(zli.data.npc_count);
         zli.body.find(".item-count").text(zli.data.item_count);
         zli.body.find(".item-count").bind("click", zli.onItemcountClick);
         zli.body.find(".exp-name").text(zli.data.expansion_name);
         zli.body.find(".xp-bonus").text(zli.data.zone_exp_multiplier);
         zli.body.find(".requirements").text(zli.data.entrance_requirements);
         zl.body.append(zli.body);
      }
      

      // z event handlers
      zli.onItemcountClick = function(event) {
         new trilogy._zoneInventoryDialog({filters: [{type: FILTER_ZONEIDS, zoneIDs: [parseInt(zli.data.zoneID)]}]});
      }
      
      zli.construct();
      return this;
   }

   this.construct();
   return this;
}

