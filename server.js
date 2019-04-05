'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const uri = "mongodb+srv://8912652:good0101_@cluster0-bie1i.mongodb.net/urls?retryWrites=true";

// mongoose.disconnect();
mongoose.connect(uri, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true,
}).then(() => {
    console.log('Database connection successful')
  })
  .catch(err => {
    console.error('Database connection error')
  }
);

// define schema
const Schema = mongoose.Schema;

// create instance of schema
const websiteSchema = new Schema({
  address: { type: String, required: true },
  id: Number,
});

// create model from schema
const Website = mongoose.model('Website', websiteSchema);

app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyParser.json());

const websites = [];

app.post("/api/shorturl/*", function(req, res) {
  dns.lookup(req.body.url.split("/").pop(), (error, address, family) => {
    if (!address) {
      res.json({ "error": "invalid URL" });
    }
  });

  // create document of model
  const webInstance = new Website({
    id: 1,
    address: 'https://google.com',
  });

  // save document
  const createAndSaveWebsite = function(done) {
    webInstance.save(function(err, webInstance) {
      console.log('---- webInstance.save');
       if (err) {
         console.log(err);
       }
       done(null, webInstance);
    });
  };
  createAndSaveWebsite();

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('we are connected!');
  });

  res.json({
    original_url: req.body.url, "short_url": websites.length - 1,
  });
});

app.get("/api/shorturl/:num?", function(req, res) {
  const num = req.params.num;
  console.log('== /api/shorturl/:num? ==', num);
  // res.redirect(websites[num]);
  res.json({
    text: "success",
  });
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});

mongoose.disconnect();