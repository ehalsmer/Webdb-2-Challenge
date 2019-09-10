const express = require('express');
const cors = require('cors');

const carsRouter = require('../cars/cars-router');
const salesRouter = require('../sales/sales-router');

const server = express();

server.use(express.json());
server.use(cors());

server.use('/api/cars', carsRouter);
server.use('/api/sales', salesRouter);

module.exports = server;