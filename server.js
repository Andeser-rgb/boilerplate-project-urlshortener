require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const mongoose = require('mongoose');



// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number
});

let UrlModel = new mongoose.model("UrlModel" , urlSchema);

let lastIndex = 1;

UrlModel.find({}, (err, data) => {
  lastIndex = data.length + 1;
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  let url = req.body.url
      .replace(/https?:\/\//, "")
      .replace(/\/$/, "")
      .split('/')[0];

  dns.lookup(url, err => {
    if(err) res.send({error: "Invalid url"});
    else UrlModel.find({original_url: req.body.url}, (err, data) => {
        if(data.length === 0){
          const urlObject = {original_url: req.body.url, short_url: lastIndex++};
          res.json(urlObject);
          const urlDoc = new UrlModel(urlObject);
          urlDoc.save((err, data) => {console.log(err);});
        }
        else res.json({
          original_url: data[0].original_url,
          short_url: data[0].short_url
        });
    });
  });
});
app.get('/api/shorturl/:number', (req, res) => {
  let number = req.params.number;
  UrlModel.find({short_url: number}, (err, data) => {
    if(data.length <= 0) console.log(err);
    else res.redirect(data[0].original_url);
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
