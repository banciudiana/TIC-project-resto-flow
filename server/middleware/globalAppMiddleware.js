const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

module.exports = (app) => {

    app.use(helmet());
  app.use(cors());
 
  
  app.use(morgan('dev'));
 
};