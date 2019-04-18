const dns = require('dns');
const util = require('util');

const Website = require('../models/website.model');
const Counter = require('../models/counter.model');

const dnsLookupAsync = util.promisify(dns.lookup);

async function checkUrl (url) {
  return dnsLookupAsync(url)
    .then((obj) => obj.address)
    .catch((err) => console.log(err));
}

const getNextSequence = async (name) => {
  const res = Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true },
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log(response);
      }
    }
  );
  return res;
};

exports.website_new = async (req, res) => {
  const url = await checkUrl(req.body.url.split('/')
    .pop());
  if (!url) {
    res.json({ error: `The URL ${req.body.url} is invalid` });
  // else should be replaced with return next()
  } else {
    try {
      const counter = await getNextSequence('userid');
      console.log('counter', counter.seq);
      const websites = await Website.find({ url: req.body.url });
      const website = websites[0];
      if (!website) {
        const newWebsite = new Website({
          _id: counter.seq,
          url: req.body.url,
        });
        const result = await newWebsite.save();
        res.send({
          original_url: result.url,
          short_url: counter.seq,
        });
      } else {
        res.send(`Specified url already existing\nThe shorturl is: ${website._id}`);
      }
    } catch (error) {
      res.status(500)
        .send(error);
    }
  }
};

exports.website_default = (req, res) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
};

exports.website_open_short = async (req, res, next) => {
  const parsedNum = parseInt(req.params.num, 10);
  const website = await Website.findById(parsedNum, (err, data) => data)
    .catch((err) => next(err));
  if (website) {
    res.redirect(website.url);
  }
  res.send(`There is no website with shorturl: ${parsedNum}`);
};
