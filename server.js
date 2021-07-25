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

const shortUrl = new mongoose.Schema({
  original_url: String,
  short_url: Number
});

let ShortModel = new mongoose.model("ShortModel" ,shortUrl);

let lastIndex = 1;

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  let url = req.body.url;
  url = url.replace(/https?:\/\//, "").replace(/\/$/, "").split('/')[0];
  dns.lookup(url, err => {
    if(err) res.send({error: "Invalid url"});
    else {
      ShortModel.find({original_url: req.body.url}, (err, data) => {
        console.log(err);
        console.log(data);
        if(true){
          
          //res.json({original_url: req.body.url, short_url: lastIndex});
          res.json(data);
          const short = new ShortModel({original_url: req.body.url, short_url: lastIndex++});
          short.save((err, data) => {
            console.log(err);
          });
          
        }
        else res.json(data);
        
      })
      
    }
  });

});
/*
app.get('/api/shorturl/:number', (req, res) => {
  let number = req.params.number;
  console.log(urlArray[number - 1]);
  if(number < lastIndex) res.redirect(urlArray[number - 1]);
});
*/
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
