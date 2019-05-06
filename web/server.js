// server.js
// where your node app starts

// init project
var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

app.use(express.static(__dirname + '/public')); 
app.set('views', __dirname + '/views');
app.set("view engine", 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, response) {
  const params = {
    redirect_uri: req.query.redirect_uri,
    state: req.query.state,
  };
  
  response.render('main', params);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/", function (req, response) {
  const { redirect_uri, state, userKey, email, password } = req.body;
  const params = {
    uri: 'https://api.clockify.me/api/auth/token/',
    method: 'POST',
    json: true,
    headers: {
      'x-api-key': userKey,
    },
    body: {
      email,
      password,
    },
  };
  
  request(params, (error, res, body) => {
    if (error || (body && body.error || body.code === 404)) {
      response.redirect(redirect_uri);
      return;
    }
    
    const redirectUrl = `${redirect_uri}#state=${state}&access_token=${userKey},${body.id}&token_type=Bearer`;
    response.redirect(redirectUrl);
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
