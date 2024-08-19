require('dotenv').config();
const express = require('express');
const cors = require('cors');
const res = require('express/lib/response');
const app = express();
const bodyParser = require('body-parser');
const { URL } = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}));

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

app.post('/api/shorturl', function (req, res) {

  const ogURL = req.body.url;
  const shortURL = urlIdGenerator++;

  urlDb[shortURL] = ogURL;

  try {
    new URL(ogURL);
  } catch (error) {
    return res.json({ error: 'invalid url' });
  }

  res.json({
    original_url: ogURL,
    short_url: shortURL
  });
});

app.get('/api/shorturl/:short_url', getOgURL, function (req, res) {
  res.json({ error: res.locals.error })
}); 

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

function getOgURL(req, res, next) {
  const shortURL=parseInt(req.params.short_url);
  const ogURL=urlDb[shortURL];

  if(!ogURL) {
    res.locals.error = "no short URL found"
    return next();
  }

  res.redirect(ogURL)
}
