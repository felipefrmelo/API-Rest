const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser')
const app = express();
const morgan = require('morgan');
const logger = require('../service/logger.js');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(morgan("common", {
    stream: {
      write: function(mensagem){
          logger.info(mensagem);
      }
    }
  }));


consign({cwd: 'src'})
    .include('controllers')
    .then('persistencia')
    .then('service')
    .into(app);

module.exports = app;