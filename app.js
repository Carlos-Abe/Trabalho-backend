require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

//  Middlewares principais
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Rotas
const routes = require('./src/routes/index');
const usuarioRoutes = require('./src/routes/usuarioRoutes');

//middleware de rotas
app.use('/api', routes);
app.use('/api/usuarios', usuarioRoutes);

// Conexão com MongoDB
//const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DBNAME}`;

module.exports = app;
