require('dotenv').config();
require('./src/database/connect').connect();
const express = require('express');
const engine = require('ejs-mate');
const morgan = require('morgan');
const auth = require('./src/middleware/auth');

const app = express();
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.static('public'));
app.use(morgan('dev'));

app.use('/browse', require('./src/routes/browse'));
app.use('/auth', require('./src/routes/auth'));
app.use('/register', require('./src/routes/register'));
app.use('/studen', require('./src/routes/studen'));
app.use('/', require('./src/routes/index'));

// PDPA
app.get('/pdpa', (req, res) => {
    res.sendFile(__dirname + '/public/pdpa.html');
})

app.get('*', (req, res) => {
    res.render('Warning/404');
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});