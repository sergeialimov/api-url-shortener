'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const uri = "mongodb+srv://8912652:good0101_@cluster0-bie1i.mongodb.net/urls?retryWrites=true";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.listen(port, function () {
  console.log('Node.js listening at :3000...');
});

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

// create instance of schema
const websiteSchema = new mongoose.Schema({
  // _id: Number,
  url: String,
});

// create model from schema
const Website = mongoose.model('websites', websiteSchema);

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/shorturl/new", async (req, res, next) => {
  dns.lookup(req.body.url.split("/").pop(), (error, address, family) => {
    if (error) {
      console.log(error);
    }
    if (!address) {
      res.json({ "error": "invalid URL" });
    }
  });
  try {
    const website = new Website(req.body);
    const result = await website.save();
    const allWebsites = await Website.find();
    res.send({
      original_url: result.url,
      short_url: allWebsites.length - 1,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/read", function(req, res) {
  Website.find(function (err, product) {
    if (err) {
      return next(err);
    }
    res.send(product)
  });
});

app.get("/api/shorturl/:num?", function(req, res) {
  const num = req.params.num;
  console.log('== /api/shorturl/:num? ==', num);
  res.json({
    text: "succezz",
    // data: dbData,
  });
});