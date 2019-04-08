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
  address: String,
  test: Number,
  id: Number,
});

// create model from schema
const Websites = mongoose.model('Website', websiteSchema);

app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyParser.json());

app.post("/api/shorturl/new", async (req, res) => {
  dns.lookup(req.body.url.split("/").pop(), (error, address, family) => {
    if (!address) {
      res.json({ "error": "invalid URL" });
    }
  });

  try {
    var website = new Websites({
      id: 1,
      test: 1,
      address: 'https://google.com',
    });
    console.log('=== 02 ---');
    var result = website.save();
    console.log('=== 03 ---');
    // res.send(result);

    res.json({
      original_url: req.body.url,
    });

    console.log('=== 04 ---');
  } catch (error) {
    res.status(500).send(error);
  };

  // res.json({
  //   original_url: req.body.url,
  // });
});

app.get("/api/shorturl/:num?", function(req, res) {
  const num = req.params.num;
  console.log('== /api/shorturl/:num? ==', num);
  res.json({
    text: "succezz",
    // data: dbData,
  });
  // res.redirect(websites[num]);
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});

mongoose.disconnect();