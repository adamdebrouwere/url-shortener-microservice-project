require('dotenv').config();
const express = require('express');
const cors = require('cors');
const res = require('express/lib/response');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urlDb = {};
let urlIdGenerator = 1;

app.post("/api/shorturl", function (req, res) {

  const ogURL = req.body.url;
  const shortURL = urlIdGenerator++;

  urlDb[shortURL] = ogURL;

  res.json({
    original_url: ogURL,
    short_url: shortURL
  });
});

app.get("")
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
