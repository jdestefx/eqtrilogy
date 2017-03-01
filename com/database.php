<?php
include("constants.php");

   class MySQLDB {
      var $DB_SERVER = "127.0.0.1";
      var $DB_USER = "root";
      //var $DB_PASS = "pass";
      var $DB_PASS = "";
      var $DB_NAME = "peq_20161104";

      var $connection;
      var $syslogOutput;

      var $lastGivenID;

      function __construct(){
         $this->connect();
      }

      function close() {
         mysqli_close($this->connection);
      }

      function ping() {
         mysqli_ping($this->connection);
      }

      function connect() {
         $this->connection = mysqli_connect($this->DB_SERVER, $this->DB_USER, $this->DB_PASS);
         if ($this->connection===false) die("connect failed.");

         $res = mysqli_select_db($this->connection, $this->DB_NAME);
         if ($res===false) die("select db failed");
      }

      function getNewID() {
         $newID = intval(microtime(true) * 1000);;
         if ($newID == $lastGivenID) $newID++;
         return $newID;
      }

      function queryToObject($query) {
         $res = $this->query($query);

         $rows = array();
         while($r = mysqli_fetch_object($res)) {
            $rows[] = $r;
         }

         return $rows;
      }

      function queryToAssoc($query) {
         $res = $this->query($query);

         $rows = array();
         while($r = mysqli_fetch_assoc($res)) {
            $rows[] = $r;
         }

         return $rows;
      }

      function query($query){
         if (mysqli_ping($this->connection)==false) {
            echo "detected stale connection. attempting reconnect...\n";
            $this->close();
            $this->connect();
         }

         //echo "$query\n";
         $query = str_replace(array("\r\n", "\n", "\r"), "", $query);
         syslog(LOG_INFO, "%TESTGAME-9-999999: ".$query);
         return mysqli_query($this->connection, $query);
      }

   };

$database = new MySQLDB;

?>
