require('dotenv').config();

const express = require("express")
const {engine} = require('express-handlebars')

const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./controllers/posts')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);

// Set db
require('./data/reddit-db');



module.exports = app;

app.listen(3000);