
// filter types:
var FILTER_ZONENAMES = 1;
var FILTER_ZONEIDS = 6
var FILTER_STAT = 2;
var FILTER_SOURCE = 3;
var FILTER_ITEMIDS = 4;

var debug = {};

var trilogy = new function(opts) {
   var trilogy = this;

   $.extend(this, {

   }, opts);

   trilogy.maxZoneID = -1;
   trilogy.totalBytes = 0;
   trilogy.totalLatency = 0;
   trilogy.totalRequests = 0;
   trilogy.base = {};

   // construct
   trilogy.construct = function() {
      trilogy.fetchParts();
      //t.questlist = trilogy.tabStrip.addTab({title:"Quests", hasCount: true, addClass:""});
   }

   // events

   // methods
   trilogy.start = function() {
      trilogy.tabStrip = new trilogy._tabStrip();
      trilogy.detailer = new trilogy._detailer();
      trilogy.leftfloater = new trilogy._leftfloater();
      trilogy.homepage = trilogy.tabStrip.addTab({title:"Home", hasCount: false, activate:true});
      trilogy.homepage.content.append(trilogy.parts.find("#home-parts").clone());
      
      trilogy.zonelist = new trilogy._zonelist({
         container: trilogy.tabStrip.addTab({title:"Zones", hasCount: true, addClass:"zonelist"}).content
      });

      trilogy.itemsearch = new trilogy._itemsearch({
         container: trilogy.tabStrip.addTab({title:"Items", hasCount: true, addClass:"items"}).content
      });
   }
   trilogy.action = function(data, callback) {
      var st = (new Date()).getTime();
      var et = 0;

      var xhr = $.ajax({url:"site-actions.php", type:"post", dataType: "text", data: JSON.stringify(data),
         success: function(data) {
            et = (new Date()).getTime();
            trilogy.addByteLength(data.length);
            trilogy.addLatency(et-st);

            try {data = JSON.parse(data) } catch(err) {}
            callback(data);
         }, error: function(data) {
            et = (new Date()).getTime();
            trilogy.addByteLength(data.responseText.length);
            trilogy.addLatency(et-st);
            callback(data.responseText);
         }
      });   
   }
   trilogy.replaceHtml = function(el, html) {
      var oldEl = (typeof el == "string"?document.getElementById(el):el);
      var newEl = oldEl.cloneNode(false);
      newEl.innerHTML = html;
      oldEl.parentNode.replaceChild(newEl, oldEl);
      return newEl;
   }
   trilogy.addLatency = function(n) {
      trilogy.totalLatency = trilogy.totalLatency + n;
      trilogy.totalRequests = trilogy.totalRequests + 1;
      $("#jeq .status-bar .latency.val").text(Math.dp(trilogy.totalLatency / trilogy.totalRequests,0) + "ms");
   }
   trilogy.addByteLength = function(n) {
      trilogy.totalBytes = trilogy.totalBytes + n;
      $("#jeq .status-bar .xfer.val").text(utils.numFormat(trilogy.totalBytes));      
   }
   trilogy.fetchParts = function() {
      $.ajax({async: false, dataType: "html", url: "site-parts.php", 
         success: function(data) {
            trilogy.parts = $(data).children();
            trilogy.parts.cache = {};
         }
      });
   }

   // children
   this._detailer = function(opts) {
      var d = this;

      d.settings = $.extend({}, opts);

      // inits
      d.allWindows = [];
      d.pinned = false;

      d.construct = function() {
         d.body = $(".content-area .detailer");
         d.body.bind("mouseenter", d.onMouseEnter);
         d.body.bind("mouseleave", d.onMouseLeave);
      }

      // detailer event handlers
      d.onMouseEnter = function() {
         if (d.pinned == true) return;
         d.settleWindows(20);
      }
      d.onMouseLeave = function() {
         if (d.pinned == true) return;
         d.settleWindows(20);
      }

      // detailer methods
      d.removeWindow = function(w) {
         var idx = d.allWindows.indexOf(w);
         d.allWindows.remove(idx);
         w.body.remove();
         d.settleWindows(20);
      }
      d.settleWindows = function(gap, showWindow) {
         var offset = 0;
         for (var i=d.allWindows.length-1;i>=0;i--) {

            if (i == d.allWindows.length-1) {
               offset = -d.allWindows[i].body.outerWidth(true) + gap;
            } else {
               offset = d.allWindows[i+1].body.position().left + gap
            }

            if (d.allWindows[i] == showWindow) {
               if (i+1 == d.allWindows.length) {
                  offset = 0;
               } else {
                  offset = d.allWindows[i+1].body.position().left + d.allWindows[i].body.outerWidth(true) - 5;
               }
            }

            d.allWindows[i].body.css({left:offset+ "px"});
         }
      }

      // detailer child objects
      d.window = function(opts) {
         var w = this;

         w.settings = $.extend({}, {content: "no-content-provided"},opts);

         w.construct = function() {
            w.body = trilogy.parts.children("#detailer-parts .window").clone();
            w.contentArea = w.body.find(".content");
            w.contentArea.html(w.settings.content);
            w.body.find(".sidelabel").text(w.settings.sidelabel);
            w.body.bind("click", w.onBodyClicked);
            w.body.find(".min").bind("click", w.onMinClicked);
            w.body.bind("mouseenter", w.onBodyMouseEnter);
            w.body.bind("mouseleave", w.onBodyMouseLeave);
            w.body.find(".closer").bind("click", w.onCloserClicked);
            w.body.appendTo(d.body);
            d.allWindows.push(w);
            d.settleWindows(20,w);
            d.pinned = true;
         }

         // window event handlers
         w.onCloserClicked = function() {
            d.removeWindow(w);
         }
         w.onBodyMouseEnter = function() {
            /*if (d.pinned == false) */
            w.body.toggleClass("hov", true);
         }
         w.onBodyMouseLeave = function() {
            w.body.toggleClass("hov", false);
         }
         w.onMinClicked = function(event) {
            d.pinned = false;
            d.onMouseEnter();
            return false;

         }
         w.onBodyClicked = function(event) {
            d.pinned = true;
            w.body.toggleClass("hov", false);
            d.settleWindows(20, w);
         }

         // window methods
         w.slideOut = function() {
            w.body.animate({left:0},200);
         }
         w.slideIn = function() {
            w.body.animate({left:0},-245);
         }
         w.goAway = function() {
            w.body.remove()
            d.settleWindows();
         }

         w.construct();
         return this;
      }

      d.construct();
      return this;
   }
   
   this._leftfloater = function(opts) {
      var fl = this;

      fl.settings = $.extend({},opts);

      // leftfloater construct
      fl.construct = function() {
         fl.body = $(".content-area .floater");
      }

      // leftfloater event handlers

      // leftfloater methods

      // leftfloater child objects
      this.item = function(opts) {
         var item = this;

         if (typeof opts.onClick == UNDEF) return false;
         if (typeof opts.label == UNDEF) return false;
         if (typeof opts.label2 == UNDEF) return false;

         item.settings = $.extend({}, opts);

         item.construct = function() {
            item.body = trilogy.parts.siblings("#floater-parts").clone();
            item.body.find(".label").text(item.settings.label);
            item.body.find(".label2").text(item.settings.label2);
            item.body.bind("click", item.onClick);
            item.body.css({left:"130px"});
            item.body.appendTo(fl.body);
            item.body.animate({left:0},200);
         }

         // item event handlers
         item.onClick = function(event) {
            item.body.remove();
            item.settings.onClick();
            delete item;         
         }

         item.construct();
         return this;
      }

      fl.construct();
      return this;
   }
   
   this._tabStrip = function(opts) {
      var ts = this;
      
      // inits
      ts.tabs = [];

      // construct (properties, binds, etc):
      ts.construct = function() {
         ts.body = $(".tab-area");
      }

      
      // child objects:
      this._tab = function(opts) {
         var tab = this;

         $.extend(this, {
            addClass: "",
         }, opts);

 
         // tab construct (properties, binds, etc):
         tab.construct = function() {
            tab.body = trilogy.parts.children(".tab").clone();
            tab.content = trilogy.parts.children(".content-column").clone();
            tab.content.addClass(tab.addClass);
            tab.body.bind("click", tab.activate);
            tab.write();
            if (tab.settings.activate == true) { tab.activate(); }
         }

         // tab child objects:

         // tab event handler proxies:

         // tab methods:
         tab.write = function() {
            var defaults = {hasCount: true, title: "untitled", count: 0,};
            tab.settings = $.extend({}, defaults, opts);

            if (tab.settings.hasCount == false) {
               //tab.body.find(".count").remove(); tab.body.find(".body").css("padding","13px");
            } else {
               tab.body.find(".count").text("(" + tab.settings.count + ")");
            }
            tab.body.find(".text").text(tab.settings.title);

            ts.body.append(tab.body);
            $("#jeq .content-area-inner").append(tab.content);
            ts.tabs.push(tab);
         }
         tab.activate = function() {
            ts.activateTab(tab);
         }

         tab.construct();
         return this;
      } 

      // tabStrip methods:
      this.activateTab = function (tab) {
         ts.body.find(".tab").toggleClass("active",false);
         $("#jeq .content-area .content-column").toggleClass("active", false);
         tab.content.toggleClass("active", true);
         tab.body.toggleClass("active", true);      
      }
      this.addTab = function(opts) {
         var t = new ts._tab(opts);
         return t;
      }

      ts.construct();
      return this;
   }   

   trilogy.construct();
   return this;
}

