'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const dns = require('dns');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyParser.json());

app.post("/api/shorturl/*", function (req, res) {
  dns.lookup(req.body.url.split("/").pop(), (error, address, family) => {
    console.error(error);
    console.log(address);
    console.log(family);
  });
  res.json({
    original_url: req.body.url, "short_url": 1
  });
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});