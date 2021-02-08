const passport = require('passport');
const crypto = require('crypto');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');
const { findOne } = require('../models/user');

passport.use(new googleStrategy({
        clientID: "197437634777-kmodjivc9o167b5eva2vpee9uva5r13f.apps.googleusercontent.com",
        clientSecret: "qyTk_6jyDPr5CdSxcXKu6gcF",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    }, 

    function(accessToken, refreshToken,profile , done ) {
        // console.log(profile);
        User.findOne({email: profile.emails[0].value}).exec(function(err, user) {
            if (err) {console.log('error in google-strategy passport', err); return;}

            if (user) {
                return done(null, user);
            } else {
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user) {
                    if (err) {console.log('error in creating user', err); return;}

                    return done(null, user);
                })
            }
        })
    }
))