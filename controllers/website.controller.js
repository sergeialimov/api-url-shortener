const Website = require('../models/website.model');
const dns = require('dns');

exports.website_new = async (req, res, next) => {
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
  };
};

exports.website_default = function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
};

exports.website_open_short = function(req, res) {
  const num = req.params.num;
  Website.find(function (err, product) {
    if (err) {
      return next(err);
    }
    res.redirect(product[num].url);
  });
};