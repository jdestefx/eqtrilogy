<?php
/**
 * Database.php
 * 
 * The Database class is meant to simplify the task of accessing
 * information from the website's database.
 *
 * Written by: Jpmaster77 a.k.a. The Grandmaster of C++ (GMC)
 * Last Updated: August 17, 2004
 */
include("constants.php");


class MySQLDB
{
   var $connection;         //The MySQL database connection

   /* Class constructor */
   function MySQLDB(){
      /* Make connection to database */
      $this->connection = mysql_connect(DB_SERVER, DB_USER, DB_PASS) or die(mysql_error());
      mysql_select_db(DB_NAME, $this->connection) or die(mysql_error());
      
   }
   
   function getNewID() {
      return intval(microtime(true) * 1000);
   }

   function json_encode_results($res) {
      $rows = array();
      while($r = mysql_fetch_assoc($res)) {
         //if (is_numeric($r) == true) {$r = floatval($r);} 
         $rows[] = $r;
      }
      return json_encode($rows);
   }
   
   function json_encode_row($r, $dotrim) {
      $rows = array();
      $rows[] = $r;

      $ret = json_encode($rows);
      if ($dotrim == true) {
         $ret = trim($ret, "[]");
         $ret = trim($ret, "{}");
      }
      return $ret;
   }


   function query($query){
      return mysql_query($query, $this->connection);
   }
};

/* Create database connection */
$database = new MySQLDB;

?>
