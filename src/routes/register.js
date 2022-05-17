const express = require('express');
const reg = express.Router();
const axios = require('axios');

reg.get('/', (req, res) => {
    title = 'Register';
    let DateNow = Date.now();
    let DateNowYear = new Date(DateNow).getFullYear();
    let DateNowMonth = new Date(DateNow).getMonth() + 1;
    let DateNowDay = new Date(DateNow).getDate();
    let DateNowString = DateNowYear + '' + DateNowMonth + '' + DateNowDay;
    res.render('register', {title: title});
});

module.exports = reg;