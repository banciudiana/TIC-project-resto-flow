const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

module.exports = (app) => {
  app.use(cors({
    origin: 'https://tic-project-resto-flow-client.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

  app.use(helmet({
    contentSecurityPolicy: false, 
  }));
  
  app.use(morgan('dev'));
 
};