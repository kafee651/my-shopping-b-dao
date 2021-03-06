// Demo server app - developed for Gamification demo .... 
// This will expose some sample APIs via REST to call product database 

// import express module - web app server
// import body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body as something easier to interact with
// import mysql modeule to connect to mysql

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require("mysql");

// set port
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// we will use JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
	
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();

});
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'Following APIs supported - /api/status/ ; /api/getproducts/' })
});


//mysql configuration - Gamification project mysql connect details
var mysqlHost = process.env.OPENSHIFT_MYSQL_DB_HOST || 'custom-mysql.gamification.svc.cluster.local';
var mysqlPort = process.env.OPENSHIFT_MYSQL_DB_PORT || 3306;
var mysqlUser = 'xxuser'; 
var mysqlPass = 'welcome1';

// we will use sampledb as database
var mysqlDb = 'sampledb';

//form the connection string to connect to mysql - you can connect directly too 
var mysqlString = 'mysql://' + mysqlUser + ':' + mysqlPass + '@' + mysqlHost + ':' + mysqlPort + '/' + mysqlDb;
console.log(mysqlString);
var mysqlClient = mysql.createConnection({
    host: mysqlHost,
    user: mysqlUser,
    password: mysqlPass,
    database: mysqlDb,
    debug: false,
    port: mysqlPort,
    multipleStatements: true
});

//connect to mysql/sampledb database
//var connection = mysql.createConnection({multipleStatements: true});
//var mysqlClient = mysql.createConnection(mysqlString);
mysqlClient.connect(function (err) {
    if (err) console.log(err);
});

//GET DB STATUS - To validate if database is running call this API ... URL/isdbon
app.get('/api/status/db', function (req, res) {
    mysqlClient.query('SELECT 0 + 0 AS status', function (err, rows, fields) {
        if (err) {
            res.send('MYSQL IS NOT CONNECTED' + JSON.stringify(err));
        } else {
            res.send('MYSQL IS CONNECTED - Status Msg: ' + rows[0].status);
        }
    });
});

//GET ALL PRODUCTS - To retrieve all all products call this API ... URL/api/getproducts
app.get('/api/getproducts',(req, res) => {
let sql = "SELECT * FROM XXIBM_PRODUCT_SKU";  
console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//GET A PRODUCT by DESCRIPTION ... To retrieve all all products call this API ... URL/api/getproducts/'Description'
app.get('/api/getproducts/desc/:desc',(req, res) => {
  var reqs = req.params.desc.split(" ");
  var i;
  let sql = "SELECT * FROM XXIBM_PRODUCT_SKU WHERE LOWER(DESCRIPTION) LIKE '%" + reqs[0] + "%' ";
  for (i = 1; i < reqs.length; i++) {
  sql += " OR LOWER(DESCRIPTION) LIKE '%" + reqs[i] + "%' ";
} 
  console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//GET A PRODUCT by PRODUCT_ID ... To retrieve all all products call this API ... URL/api/getproducts/'Product_id'
app.get('/api/getproducts/id/:id',(req, res) => {
  let sql = "SELECT * FROM XXIBM_PRODUCT_SKU WHERE ITEM_NUMBER="+req.params.id;
  console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//GET PRODUCT PRICE by PRODUCT_ID ... To retrieve product price call this API ... URL/api/getproducts/price/'Product_id'
app.get('/api/getproducts/price/:id',(req, res) => {
  let sql = "SELECT * FROM XXIBM_PRODUCT_PRICING WHERE ITEM_NUMBER="+req.params.id;
  console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//GET ALL PRODUCT PRICE... To retrieve product price call this API ... URL/api/getproducts/price/
app.get('/api/getproducts/price/',(req, res) => {
  let sql = "SELECT * FROM XXIBM_PRODUCT_PRICING";
  console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//GET PRODUCT Style by Style_ID ... 
app.get('/api/getproducts/style/:id',(req, res) => {
  let sql = "SELECT * FROM XXIBM_PRODUCT_STYLE WHERE ITEM_NUMBER="+req.params.id;
  console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//GET PRODUCT CATALOG by Commodity ... 
app.get('/api/getproducts/catalog/:id',(req, res) => {
  let sql = "SELECT * FROM XXIBM_PRODUCT_CATALOG WHERE COMMODITY="+req.params.id;// 
  console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});
// set port
app.listen(port, ip);

module.exports = app;
