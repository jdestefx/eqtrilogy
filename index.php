<?php
   include("com/database.php");
?>

<!DOCTYPE HTML>
<html>

   <head>
      <title>JEQ</title>
      <link type="text/css" href="css/yui-3-3-0-reset-grids-fonts.css" rel="stylesheet" />
      <link type="text/css" href="css/smoothness/jquery-ui-1.7.3.custom.css" rel="stylesheet" /> 
      <link type="text/css" href="css/index.css" rel="stylesheet" />
      <script type="text/javascript" src="js/plugins/jquery-2.0.3.min.js"></script>
      <script type="text/javascript" src="js/plugins/jquery-ui-1.10.4.custom.min.js"></script>

      <script type="text/javascript" src="js/utils.js"></script>
      <script type="text/javascript" src="js/trilogy.js"></script>

      <script type="text/javascript" src="js/db.js"></script>
      <script type="text/javascript" src="js/npc.js"></script>
      <script type="text/javascript" src="js/zone.js"></script>
      <script type="text/javascript" src="js/item.js"></script>
      <script type="text/javascript" src="js/itemsearch.js"></script>
      <script type="text/javascript" src="js/zonelist.js"></script>
      <script type="text/javascript" src="js/zone-inventory-dialog.js"></script>
   </head>

   <body id="jeq">
      <div class="yui3-u-1 nav-area">
      </div>

      <div class="yui3-u-1 tab-area no-select"></div>
      
      <div class="yui3-u-1 content-outer">
         <div class="yui3-u-1 content-area">
            <div class="yui3-u floater"></div>
            <div class="yui3-u detailer"></div>
            <div class="yui3-u-1 content-area-inner">
            </div>
         </div>
      </div>
      
      <div class="yui3-u-1 status-bar">
         <div class="yui3-u-1 inner">
            <div class="yui3-u xfer label">Database Content Transferred:</div>
            <div class="yui3-u xfer val"></div>
            <div class="yui3-u latency label">Last Request Latency:</div>
            <div class="yui3-u latency val"></div>
            <div class="yui3-u zoneID label">Max zone ID:</div>
            <div class="yui3-u zoneID val"><?php echo MAX_ZONE_ID ?></div>

         </div>
      </div>
   </body>

</html>


<script type="text/javascript">
   trilogy.start();
</script>