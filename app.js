require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

// Middlewares principais
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//  Rotas
const routes = require('./src/routes/index');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const authRoutes = require('./src/routes/authRoutes');
const tarefaRoutes = require('./src/routes/tarefaRoutes');

//middleware de rotas
app.use('/api', routes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);	
//app.use('/api/tarefas', tarefaRoutes);

module.exports = app;
