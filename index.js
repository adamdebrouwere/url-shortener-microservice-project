require('dotenv').config();
const express = require('express');
const cors = require('cors');
const res = require('express/lib/response');
const app = express();
const bodyParser = require('body-parser');
const { URL } = require('url');
const dns = require('dns')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

function isValidUrl(inputUrl) {
  
  try {
    new URL(inputUrl);
    return true;
  } catch (error) {
    return res.json({ error: 'invalid url' });
  }
}

let urlDb = {};
let urlIdGenerator = 1;
const regexUrlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;

app.post('/api/shorturl', function (req, res) {
  const ogURL = req.body.url;
  
  if (!ogURL || !isValidUrl(ogURL)) {
    return res.json({ error: 'invalid url' });
  }


  const hostname = new URL(ogURL).hostname;
  dns.lookup(hostname, function (err) {
    if (err) {
        return res.json({ error: 'invalid url'})
    }
  
    const shortURL = urlIdGenerator++;
    urlDb[shortURL] = ogURL;
    
  res.json({
      original_url: ogURL,
      short_url: shortURL
    });
  });
});

app.get('/api/shorturl/:short_url', function (req, res) {
  const shortURL = parseInt(req.params.short_url);
  const ogURL = urlDb[shortURL];
  
  res.redirect(ogURL)
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

