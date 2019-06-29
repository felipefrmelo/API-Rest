const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


consign({cwd: 'src'})
    .include('controllers')
    .then('persistencia')
    .then('service')
    .into(app);

module.exports = app;