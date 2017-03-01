trilogy._zone = function(opts) {
   var zone = this;

   // resolve the rest of the info
   if (typeof opts.long_name != "undefined") $.extend(this, trilogy.db.getZoneByLongName(opts.long_name));
   if (typeof opts.short_name != "undefined") $.extend(this, trilogy.db.getZoneByShortName(opts.short_name));
   if (typeof opts.ID != "undefined") $.extend(this, trilogy.db.getZoneByID(opts.ID));

   $.extend(this, {
      display: "short",
   }, opts);

   zone.construct = function() {
      zone.body = trilogy.parts.siblings("#zone-parts").find(".il-zone").clone();
      zone.body.attr("title", zone.long_name);
      if (zone.display == "short") {zone.body.text(zone.short_name)} else {zone.body.text(zone.long_name)}
      zone.body.bind("mouseenter", zone.onMouseOver);
      zone.body.bind("click", zone.onClicked);
   }
   
   // zone event handlers
   zone.onClicked = function() {
      zone.detailWindow = new trilogy.detailer.window({content:"todo: details about:"+zone.short_name, sidelabel: zone.short_name});
      zone.detailWindow.body.toggleClass("zone-bg", true);
   }
   zone.onMouseOver = function(event) {
   }

   // methods

   zone.construct();
   return this;

}
