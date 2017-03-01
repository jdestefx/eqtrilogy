trilogy._npc = function(opts) {
   var npc = this;

   // expected values
   if (typeof opts.name == "undefined") return false;
   if (typeof opts.id == "undefined") return false;

   var defaults = {}; npc.settings = $.extend({}, defaults, opts);

   npc.construct = function() {
      npc.sanitizeData();
      npc.body = trilogy.parts.children("#npc-parts .il-npc").clone();
      npc.body.text(npc.settings.name);
      npc.body.bind("mouseenter", npc.onMouseOver);
      npc.body.bind("click", npc.onBodyClicked);      
   }
   
   npc.onBodyClicked = function(event) {
      npc.detailWindow = new trilogy.detailer.window({
         content: "todo:<br><br><br>details about:"+npc.settings.name, sidelabel: npc.settings.name
      });
      npc.detailWindow.body.toggleClass("npc-bg", true);

      trilogy.action({m:5, npc_name: npc.settings.codename},
         function(data) {
            npc.detailWindow.contentArea.text(JSON.stringify(data));
         }
      );

   }
   
   npc.sanitizeData = function() {
      npc.settings.codename = npc.settings.name;
      npc.settings.name = npc.settings.name.replace(/_/g," ").replace(/#/g, "");
   }
   
   npc.onMouseOver = function(event) {
      //console.log("here");   
   }
   
   npc.construct();
   return this.body;

}
