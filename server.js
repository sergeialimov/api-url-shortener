const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;
const uri = 'mongodb+srv://8912652:good0101_@cluster0-bie1i.mongodb.net/urls?retryWrites=true';
const website = require('./routes/website.route');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use('/', website)

app.listen(port, () => {
  console.log('Node.js listening at :3000...');
});

mongoose.connect(uri, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true,
})
.then(() => {
    console.log('Database connection successful')
  })
  .catch((err) => {
    console.error('Database connection error', err)
});
app.use('/public', express.static(`${process.cwd()}/public`));
