require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = requite('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  console.log(req.body);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
