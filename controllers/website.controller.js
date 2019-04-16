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
    const websites = await Website.find({ url: req.body.url });
    const website = websites[0];
    if (!website) {
      const newWebsite = new Website(req.body);
      const result = await newWebsite.save();
      res.send({
        original_url: result.url,
        short_url: result._id,
      });
    } else {
      res.send(`Specified url already existing\nThe shorturl is: ${website._id}`);
    }
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
