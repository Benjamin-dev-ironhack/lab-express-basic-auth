const express = require('express');
const router = express.Router();
const UserModel = require('../models/User.model');
const bcrypt = require('bcryptjs');



/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

// get sign up page

router.get('/signup', (req, res, next) => {
    res.render('signup.hbs')
})

// get login page

router.get('/login', (req, res, next) => {
    res.render('login.hbs')
})

// get main page

router.get('/main', (req, res, next) => {
    res.render('main.hbs')
})

// get private page

router.get('/private', (req, res, next) => {
    res.render('private.hbs')
})

// Post requests

router.post("/signup", (req, res, next) => {

     const {username, password} = req.body
 
    if (!username.length || !password.length) {
        res.render('signup', {msg: 'Please enter all fields'})
        return;
    }
/*
     let re = /\S+@\S+\.\S+/;
     if (!re.test(email)) {
        res.render('auth/signup', {msg: 'Email not in valid format'})
        return;
     }
*/
     let salt = bcrypt.genSaltSync(10);
     let hash = bcrypt.hashSync(password, salt);
     UserModel.create({username, password: hash})
        .then(() => {
            res.redirect('/')
        })
        .catch((err) => {
            next(err)
        })
});

// Post request for login

router.post("/login", (req, res, next) => {
    const {username, password} = req.body

    UserModel.findOne({username: username})
        .then((result) => {
            if (result) {
                bcrypt.compare(password, result.password)
                    .then((isMatching) => {
                        if (isMatching) {
                            req.session.userData = result
                            req.session.areyoutired = false
                            res.redirect('/profile')
                        }
                        else {
                            res.render('login.hbs', {msg: 'Passwords dont match'})
                        }
                    })
            }
            else {
                res.render('login.hbs', {msg: 'Email does not exist'})
            }
        })
        .catch((err) => {
            next(err)
        })
   
});


// GET request to handle /profile

//Middleware to protect routes
const checkLoggedInUser = (req, res, next) => {
     if (req.session.userData) {
        next()
     }
     else {
         res.redirect('/login')
     }
     
}

router.get('/profile', checkLoggedInUser, (req, res, next) => {
    let username = req.session.userData.username
    res.render('profile.hbs', {username })
})


module.exports = router;
