require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let urlArray = [];

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  let url = req.body.url
  console.log(url);
  console.log(dns.lookup(url));
  console.log(dns.lookup('ciao'));
});

app.get('/api/shorturl/:number', (req, res) => {

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
