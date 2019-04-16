const dns = require('dns');
const Website = require('../models/website.model');

exports.website_new = async (req, res) => {
  dns.lookup(req.body.url.split('/')
    .pop(), (error, address) => {
    if (error) {
      console.log(error);
    }
    if (!address) {
      res.json({ error: 'Invalid URL' });
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
    res.status(500)
      .send(error);
  }
};

exports.website_default = (req, res) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
};

exports.website_open_short = (req, res, next) => {
  const { num } = req.params;
  // according to mongoose docs – arrow function should not be used
  /* eslint-disable prefer-arrow-callback */
  Website.find(function findWebsite (err, product) {
    if (!err) {
      res.redirect(product[num].url);
    }
    return next(err);
  });
};
