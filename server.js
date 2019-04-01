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
// mongoose.connect(process.env.MONGOLAB_URI);
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
// 
// // define schema
// const Schema = mongoose.Schema;
// 
// // create instance of schema
// const websiteSchema = new Schema({
//   address : { type: String, required: true },
//   id : Number,
// })
// 
// // create model from schema
// const Website = mongoose.model('Website', websiteSchema);
// 
// // create document - an instance of model
// const webInstance = new Person({
//   name:'Arkadiy',
//   age: 32,
//   favoriteFoods: ['pelmeny', 'ryba'],
// });
// 
// // save document
// const createAndSaveWebsite = function(done) {
//   webInstance.save(function(err, webInstance) {
//      if (err) {
//        console.log(err);
//      }
//      done(null, webInstance);
//   });
// };

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

app.post("/api/shorturl/*", function(req, res) {
  dns.lookup(req.body.url.split("/").pop(), (error, address, family) => {
    console.error(error);
    console.log(address);
    console.log(family);
    if (!address) {
      res.json({ "error":"invalid URL" });
    }
  });
  res.json({
    original_url: req.body.url, "short_url": 1
  });
});

app.get("/api/shorturl/1", function(req, res) {
// app.get("api/shourturl/:num?", function(req, res) {
  // const num = req.params.num;
  // const websites = {
  //   1: 'https://www.freecodecamp.org/forum/',
  // }
  res.redirect('https://www.freecodecamp.org/forum/');
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});