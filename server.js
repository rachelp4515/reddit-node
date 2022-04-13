const express = require("express")
const {engine} = require('express-handlebars')

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./controllers/posts')(app);

// Set db
require('./data/reddit-db');



module.exports = app;

app.listen(3000);