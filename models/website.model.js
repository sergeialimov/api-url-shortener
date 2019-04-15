const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WebsiteSchema = new mongoose.Schema({
  // _id: Number,
  url: { type: String, required: true, max: 100 },
});

// Export the model
module.exports = mongoose.model('Website', WebsiteSchema);