
$(document).bind("selectstart", function(event) {if ($(event.target).parents().hasClass("no-select") == true || $(event.target).hasClass("no-select") == true) return false; });

var utils = new function() {
   var utils = this;

   utils.word = function(width, txt) {
      var b = $(document.createElement("DIV"));
      var a = $(document.createElement("DIV")).addClass("yui3-u").css("width", width).html(txt).appendTo(b);
      return b.html();   
   }
   
   // no higer than 32 bits
   // bits = bit length
   // cat = number of times to generate a number and cat it together for the return
   // num = return a number variable (may reduce low accuracy if over 53 bits) false = return a string representing the number
   utils.getRandomNumberByBits = function(bits, cat, num) {
      var r = "";

      for (var i=0; i<cat; i++) {
         var n = Math.pow(2,bits)
         r = r + Math.floor((Math.random() * n));
      }
      
      if (num == true) {return Number(r)} else {return r}
   
   }


   utils.zero_pad = function(n, w) {
      nn = n.toString();
      
      if (nn.length >= w) {
         return nn;
      } else {
         while (nn.length < w) {
            nn = "0" + nn;
         }
      }
      return nn;
   }
   utils.sort_by = function(field, reverse, primer) {
      var key = function (x) {return primer ? primer(x[field]) : x[field]};
      return function (a,b) {
          var A = key(a), B = key(b);
          return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1,1][+!!reverse];                  
      }
   }

   
   utils.ttf = function(n) {
      if (n==true) return 1;
      if (n==false) return 0;   
   }
   
   utils.input = function(opts) {
      if ( typeof opts.defaultValue == "undefined" ) { opts.defaultValue = "" }
      if ( typeof opts.text == "undefined" ) { return false };
      if ( typeof opts.title == "undefined" ) { opts.title = "Input" };
      if ( typeof opts.width == "undefined" ) { opts.width = "auto" };
      if ( typeof opts.height == "undefined" ) { opts.height = "auto" };
      if ( typeof opts.maxtxtwidth == "undefined") {opts.maxtxtwidth = "auto"};
      if ( typeof opts.buttons == "undefined" ) { opts.buttons = {"Ok": function(event) {newDialogContent.remove()}} };
   
      var newDialogContent = $(document.createElement("div")).addClass("yui3-u-1 rapid-input-dialog opt-dialog-v1");

      newDialogContent.append("<div class=\"yui3-u-1 input-text\"></div><div class=\"yui3-u-1 iw\"><input class=\"v1\"type=\"text\"></div>");
      newDialogContent.find(".input-text").html(opts.text)
      newDialogContent.find(".iw").css({"width":opts.maxtxtwidth, "margin": "auto"});
      newDialogContent.find(".v1").bind("focus", function(event) {this.select()}).val(opts.defaultValue).focus();
      
      newDialogContent.dialog({
         dialogClass: "opt-dialog-v1-dialog-class",
         title: opts.title,
         resizable: false,
         draggable: false,
         width: opts.width,
         height: opts.height,
         modal: true,
         buttons: opts.buttons,
         create: function(event) {
            var d = newDialogContent.parent(".ui-dialog");
            d.find(".ui-dialog-buttonset").css("float", "none").css("text-align", "center").children().width(70);
            d.find(".ui-dialog-buttonpane").css("padding", "0.3em 0.4em 0.5em 0.4em")
            d.find(".ui-dialog-buttonpane button").css("margin", "0.5em 0.4em 0.3em");

            // unbind the buttons and rebind, this time passing the value back
            d.find(".ui-button").each(function () {
               $(this).unbind("click").bind("click", function(event) { if (opts.buttons[$(this).text()](event,d.find(".v1").val()) != false) {d.remove();} } );
            });
         }
      });
   }
   
   utils.setQueryParam = function(qs, n, v) {
      var replaceQ;
      if (qs.indexOf("?") == 0) {
         replaceQ = true;
         qs = qs.replace(/\?/, "", 1);
      }
      
      var p = qs.split("&");
      
      for (var i=0;i<p.length;i++) {
         var pair = p[i].split("=");
         if (pair[0] == n) pair[1] = v;
         if (pair.length > 2) {
            for (var j=1;j<pair.length;j++) {p[1] += p[j];}
         }; pair.length = 2;
         
         p[i] = pair.join("=");
      }

      return ((replaceQ == true)? "?" : "") + p.join("&"); 
   }
   
   
   utils.epochNow = function(r) {
      if (r == null) r = 1;
      // r will round down to the nearest multiple 
      var n = (new Date()).getTime() / 1000;
      n = parseInt((n / r)) * r;
      return n;
   }
   
   utils.getNowEpoch = function(secsAgo) {
      var n = parseInt((new Date()).getTime() / 1000)
      n = parseInt(n/60) *  60
      
      if (typeof secsAgo != "undefined") n = n + secsAgo;
      
      return n;
   }
   
   utils.epochNowM = function(r) {
      if (r == null) r = 1;
      // r will round down to the nearest multiple 
      var n = (new Date()).getTime();
      n = parseInt((n / r)) * r;
      return n;
   }

   utils.secondsByDescription = function(a) {
      var finalint = 0;
      var parts = a.split(" ");
   
      for (var i=0;i<parts.length;i++) {
         if (parts[i].indexOf("w")!=-1) { finalint = finalint + parseInt(parts[i]) * 604800 }
         if (parts[i].indexOf("d")!=-1) { finalint = finalint + parseInt(parts[i]) * 86400 }
         if (parts[i].indexOf("h")!=-1) { finalint = finalint + parseInt(parts[i]) * 3600 }
         if (parts[i].indexOf("m")!=-1) { finalint = finalint + parseInt(parts[i]) * 60 }
         if (parts[i].indexOf("s")!=-1) { finalint = finalint + parseInt(parts[i]) * 1 }
      }
      
      return finalint;
   }

   utils.describeSeconds = function(nn, longFormat, seconds) {
      if (typeof seconds == "undefined") seconds = false;
      var n, xd, xdt, xh, xht, xm, xmt, xs, xst;
      var ret = "";
      
      n = nn;
      xd = parseInt(n / 86400); n = n - (xd * 86400); if (xd == 0) {xdt = ""} else {xdt = xd.toString()} 
      xh = parseInt(n / 3600); n = n - (xh * 3600); if (xh == 0) {xht = ""} else {xht = xh.toString()}
      xm = parseInt(n / 60); n = n - (xm * 60); if (xm == 0) {xmt = ""} else {xmt = xm.toString()}
      if (seconds == true) {xs = parseInt(n); if (xs == 0) {xst = ""} else {xst = xs.toString()}}
   
      if (longFormat == true) {
         if (xdt != "") {if (xd > 1) {ret = ret + xdt + " days "} else {ret = ret + xdt + " day "}}
         if (xht != "") {if (xh > 1) {ret = ret + xht + " hours "} else {ret = ret + xht + " hour "}}
         if (xmt != "") {if (xm > 1) {ret = ret + xmt + " minutes "} else {ret = ret + xmt + " minute "}}
         if (seconds == true) if (xst != "") {if (xs > 1) {ret = ret + xst + " seconds, "} else {ret = ret + xst + " second, "}}
      } else {
         if (xdt != "") {ret = ret + xdt + "d "}
         if (xht != "") {ret = ret + xht + "h "}
         if (xmt != "") {ret = ret + xmt + "m "}
         if (seconds == true) if (xst != "") {ret = ret + xst + "s "}
      }
      ret = $.trim(ret);
      ret = ret.replace(/^,|,$/g, '') ;
      return ret;
   }

   // takes n and finds nearest v multiple
   utils.toNearest = function(n, v) {
      var r = 0;
      var res;
      
      r = (n/v) - parseInt(n/v);
      
      res = parseInt(n/v) * v;
      
      if (r >= .5 ) {
         res = res + v;
      } else {
         //res = res - v;
      }     
   
      return Number(res);
   }
   
   utils.translateChecked = function(n) {
      if (parseInt(n) == 0) return "";
      if (parseInt(n) == 1) return "CHECKED";
      return "";
   }
   
   utils.translateEnabled = function(enabled) {
      if (enabled == 1) return "Yes";
      if (enabled == 0) return "No";      
   }
   
   utils.getRandomString = function(length) {
       var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
       
       if (! length) {
           length = Math.floor(Math.random() * chars.length);
       }
       
       var str = '';
       for (var i = 0; i < length; i++) {
           str += chars[Math.floor(Math.random() * chars.length)];
       }
       return str;
   }
   
   utils.toNdp = function(n, places, fill, format) {
      var ret;
      newplaces = Math.pow(10, places);
      ret = Math.round(n * newplaces) / newplaces;
      
      if (fill == true && ret == parseInt(ret) ) ret = ret.toString() + "." + Array(places+1).join("0");
      if (format == true) ret = rapid.numFormat(ret);
      return ret;
   }

   utils.removeChartsByOwnerClass = function(classname) {
      for (var i = 0; i < AmCharts.charts.length; i++) {
         $(AmCharts.charts[i].chartDiv).parents().each( function() {
            if ( $(this).hasClass(classname) == true ) {
               AmCharts.charts[i].clear(); // clear removes the timer and also removes it from AmCharts.charts array.
               i--;
               return false;
            }
         });
      };
   }

   utils.removeChartByParentDivID = function(divID) {
      for (var i = 0; i < AmCharts.charts.length; i++) {
         $(AmCharts.charts[i].chartDiv).parents().each( function() {
            if ( $(this).attr("ID") == divID ) {
               AmCharts.charts[i].clear(); // clear removes the timer and also removes it from AmCharts.charts array. 
               i--;
               return false;
            }
         });
      };
   }

   utils.alert = function(opts) {
      if ( typeof opts.text == "undefined" ) { return false };
      if ( typeof opts.title == "undefined" ) { opts.title = "Alert" };
      if ( typeof opts.width == "undefined" ) { opts.width = "auto" };
      if ( typeof opts.height == "undefined" ) { opts.height = "auto" };
      if ( typeof opts.buttons == "undefined" ) { opts.buttons = {"Ok": function(event) {newConfirm.dialog("close")}} };
   
      var newConfirm = $(document.createElement("div"))
         .addClass("yui3-u-1")
         .css("text-align", "center")
         .css("margin", "15px 25px 15px 25px")
         .html(opts.text)

      newConfirm.dialog({
         dialogClass: "opt-dialog-v1-dialog-class",
         title: opts.title,
         resizable: false,
         draggable: false,
         width: opts.width,
         height: opts.height,
         modal: true,
         buttons: opts.buttons,
         create: function(event) {
            var d = $(this).parents(".ui-dialog");
            d.css("min-width", "175px");
            d.find(".ui-dialog-content").css("min-height", "0px !important");
            d.find(".ui-dialog-buttonset").css("float", "none").css("text-align", "center").children().width(70);
            d.find(".ui-dialog-buttonpane").css("padding", "0.3em 0.4em 0.5em 0.4em")
            d.find(".ui-dialog-buttonpane button").css("margin", "0.5em 0.4em 0.3em");
            d.find(".ui-button").each(function () { 
               $(this).bind("click", function() { d.remove()});
            });
         }
      });
   }

   utils.rgb2hex = function (rgb) {
      rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      function hex(x) {
         return ("0" + parseInt(x).toString(16)).slice(-2);
      }
      return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
   }
   
   utils.plural = function(nonplural, plural, n) {
      if (n == 0) return plural;
      if (n > 1) return plural;
      if (n = 1) return nonplural;
   }

   utils.numFormat = function(nStr) {
      nStr += '';
      x = nStr.split('.');
      x1 = x[0];
      x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1))
         x1 = x1.replace(rgx, '$1' + ',' + '$2');
      return x1 + x2;
   }

   // general cookie retrieval / set functions
   utils.getCookie = function(c_name) {
      if (document.cookie.length > 0) {
         c_start = document.cookie.indexOf(c_name + "=");
         if (c_start!=-1) {
            c_start = c_start + c_name.length+1;
            c_end = document.cookie.indexOf(";",c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
         }
      }
      return null;
   }
   
   utils.setCookie = function(c_name,value,expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate()+expiredays);
      document.cookie = c_name+ "=" +escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toUTCString());
   }
   
   
   utils.rbytes = function(opts) {
      var defaults = {
         force: 0,
         commas: false,
         dp: 2
      }
      var opts = $.extend({}, defaults, opts);
      if (typeof opts.value == "undefined") return false;
      if (typeof opts.force == "string") opts.force = opts.force.toUpperCase();

      var o = new Array();
      o["TB"] = 1099511627776;
      o["GB"] = 1073741824;
      o["MB"] = 1048576;
      o["KB"] = 1024;
      o["B"] = 1;

      // return object
      var r = {};

      // auto representation? find best range
      if (opts.force == 0) {
         if (opts.value > o["TB"]) {r.value = Math.dp(opts.value/o["TB"],opts.dp); r.unit = o["TB"]; r.abbr = "TB"} else 
         if (opts.value > o["GB"]) {r.value = Math.dp(opts.value/o["GB"],opts.dp); r.unit = o["GB"]; r.abbr = "GB"} else 
         if (opts.value > o["MB"]) {r.value = Math.dp(opts.value/o["MB"],opts.dp); r.unit = o["MB"]; r.abbr = "MB"} else 
         if (opts.value > o["KB"]) {r.value = Math.dp(opts.value/o["KB"],opts.dp); r.unit = o["KB"]; r.abbr = "KB"}
                           else {r.value = opts.value; r.unit = o["B"]; r.abbr = "B"}
      } else {
         if (typeof o[opts.force] == "undefined") return false; // "rapid.rbytes():unknown-force-type";
         r.value = Math.dp(opts.value/o[opts.force],opts.dp); r.unit = o[opts.force]; r.abbr = opts.force;
      }
      
      if (opts.commas == true) {
         r.text = rapid.numFormat(r.value);
      } else {
         r.text = r.value;
      }
      
      r.html = r.text + "<span class=\"wordify\">"+r.abbr+"</span>";
      r.text = r.text + r.abbr;
   
      return r;
   
   }
   
   utils.roundBytes = function(v, htmlReturn) {
      // v = bytes
      // round TB-range data
      if (v > 1099511627776) {
         ret = Math.dp(v/1099511627776);
         retExt = "TB";      
      } else if (v > 1073741824) {
         ret = Math.dp(v / 1073741824,2);
         retExt = "GB";
      } else if (v > 1048576) {
         ret = Math.dp(v / 1048576 , 2);
         retExt = "MB";
      } else if (v > 1024){
         ret = Math.dp(v / 1024,2);
         retExt = "KB";
      } else {
         ret = v; Math.dp(v,2);
         retExt = "B";
      }
      
      if (htmlReturn == true) {
          ret = ret + "<span class=\"wordify\">" + retExt + "</span>";
          return ret;
      } else {
          return ret;
      }
   }

   utils.getDataPointCount = function(width, st, et, res) {
      var secs = 0;
      var dp = 0;
      var iv = 0;
      st = Number(st); et = Number(et); 

      secs = et - st;
      //return parseInt(secs / 60); 
      iv = rapid.getInterval(width, st, et, res);
      for (dp=1; st+(dp*iv) < et; dp++) {
         // count until correct dp is reached
      }
      
      // to fix bleeding of dps from zoom in/out
      
      //if (typeof res != "undefined") {dp = dp / res}
      dp = dp + 1;

      return(dp);
   }

   utils.getInterval = function(width, st, et, mul) {
      var secs = 0;
      var iv = 0;

      secs = parseInt(et - st);
      iv = parseInt(secs / (width));
      iv = parseInt(iv/60) * 60 + 60;
      
      if (iv < 60) iv = 60;
      if (typeof mul != "undefined") {iv = rapid.toNearest(iv,mul) || mul};

      return iv;
   }

   utils.addslashes = function(str) {
    // Escapes single quote, double quotes and backslash characters in a string with backslashes  
    // 
    // version: 1107.2516
    // discuss at: http://phpjs.org/functions/addslashes
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Ates Goral (http://magnetiq.com)
    // +   improved by: marrtins
    // +   improved by: Nate
    // +   improved by: Onno Marsman
    // +   input by: Denny Wardhana
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Oskar Larsson H�gfeldt (http://oskar-lh.name/)
    // *     example 1: addslashes("kevin's birthday");
    // *     returns 1: 'kevin\'s birthday'
      return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
   }
   
};


// Add a "remove" function for all arrays
Array.prototype.remove = function (index) {
   if (index >= 0 && index < this.length) {
      this.splice.apply(this, [index, 1]);
   }
};

String.prototype.endsWith = function(suffix) {
   return this.indexOf(suffix, this.length - suffix.length) !== -1; 
};

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

String.prototype.w = function(w) {
   var b = $(document.createElement("DIV"));
   var a = $(document.createElement("DIV")).addClass("yui3-u").css("min-width", w).html(this.toString()).appendTo(b);
   return b.html();
}

String.prototype.quoted = function() {
   return "\""+this+"\"";
}

String.prototype.fr = function() {
   var b = $(document.createElement("DIV"));
   var a = $(document.createElement("DIV")).addClass("yui3-u").css("float", "right").html(this.toString()).appendTo(b);
   return b.html();
}


RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

Math.dp = function (num, dec) {
   dec = typeof dec === "undefined" ? 2 : dec;
   return Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
};

Date.prototype.AddDays = function(days) {
   this.setDate(this.getDate() + days);
   return this;
};

Date.prototype.AddHours = function(hours) {
   this.setHours(this.getHours() + hours);
   return this;
};

Date.prototype.AddMilliseconds = function(milliseconds) {
   this.setMilliseconds(this.getMilliseconds() + milliseconds);
   return this;
};

Date.prototype.AddMinutes = function(minutes) {
   this.setMinutes(this.getMinutes() + minutes, this.getSeconds(), this.getMilliseconds());
   return this;
};

Date.prototype.AddMonths = function(months) {
   this.setMonth(this.getMonth() + months, this.getDate());
   return this;
};

Date.prototype.AddSeconds = function(seconds) {
   this.setSeconds(this.getSeconds() + seconds, this.getMilliseconds());
   return this;
};

Date.prototype.AddYears = function(years) {
   this.setFullYear(this.getFullYear() + years);
   return this;
};


Math.add = function(a,b) {return Number(a) + Number(b)};
