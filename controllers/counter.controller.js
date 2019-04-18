const Counter = require('../models/counter.model');

exports.getNextSequence = async (name) => {
  const ret = await Counter.findOneAndUpdate({
    query: { _id: name },
    update: { $inc: { seq: 1 } },
    new: true,
  });
  return ret.seq;
};
