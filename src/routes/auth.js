const express = require('express');
const User = require('../model/User_Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')

const auth = express();
// auth.use(express.json());
auth.use(bodyParser.json());
auth.use(bodyParser.urlencoded({ extended: true }));

auth.post('/login', async (req, res) => {

    const { email, password } = req.body;
    if(!email || !password) {
        return res.json({
            message: 'Please provide email and password',
            status: false
        });
    }

    const findUser = await User.findOne({ email });

    if(findUser && (await bcrypt.compare(password, findUser.password))) {
        const token = jwt.sign({
            id: findUser._id,
            email
        }, process.env.TOKEN_KEY, {
            expiresIn: '2h'
        });

        findUser.token = token;

        return res.json({
            message: 'Login successful',
            status: true,
            findUser
        });
    }

    return res.json({
        message: 'Invalid email or password',
        status: false
    });

});

auth.get('/register', async (req, res) => {
    if(!req.body.email || !req.body.password || !req.body.last_name || !req.body.first_name) {
        return res.json({
            message: 'Please provide email and password'
        });
    }
    const { first_name, last_name, email, password } = req.body;
    const user = new User({
        first_name,
        last_name,
        email,
        password
    });

    if(!first_name || !last_name || !email || !password) {
        return res.json({
            message: 'Please fill all the fields'
        });
    }

    const checkoldUser = await User.findOne({ email });
    if(checkoldUser) {
        return res.json({
            message: 'User already exists'
        });
    }

    // encrypt password
    encryptpw = await bcrypt.hash(password, 10);

    // create user in database 
    const users = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(),
        password: encryptpw
    })

    const token = jwt.sign(
        {userId: users._id, email: users.email},
        process.env.TOKEN_KEY,
        {expiresIn: '2h'}
    );

    users.token = token;
    
    res.json(users);
});

module.exports = auth;