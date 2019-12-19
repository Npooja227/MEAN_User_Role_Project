var express = require('express');
var bodyParser = require('body-parser');

const cors = require('cors');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 
  }

console.log("In server.js");
app.use('/', cors(corsOptions), require('./routes/api-routes'));

const port = process.env.port || 8080;
app.listen(port, () => console.log(`Listening to port ${port}`) )