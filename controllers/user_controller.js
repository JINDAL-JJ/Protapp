const User = require('../models/user');
const fs = require('fs');
const path = require('path');
 
module.exports.profile = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        return res.render('user_profile', {
        title: "user profile",
        profile_user: user
        })
    })
}

module.exports.update = async function(req, res) {
    if (req.user.id == req.params.id){

        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err) {
                if (err) {console.log('multer error');}

                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file) {

                    if (user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    //saving path of uploaded file in db
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            })

        } catch(err) {
            req.flash('error', err);
            return res.redirect('back');
        }

    } else {
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }

}

module.exports.signIn = function(req, res) {
    return res.render('user_sign_in', {
        title: "Sign In"
    })
}

module.exports.signUp = function(req, res) {
    return res.render('user_sign_up', {
        title: "Sign Up"
    })
}

module.exports.create = function(req, res){
    // console.log(req.body)
    if (req.body.password != req.body.confirm_password){
        console.log('password mismatch')
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        // console.log('going in db')
        if(err){console.log('error in finding user in signing up'); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                return res.redirect('/users/sign-in'); 
            })
        }else{
            return res.redirect('back');
        }

    });
}


module.exports.createSession = function(req, res) {
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res) {
    req.logout();
    req.flash('success', 'You have Logged out!!');

    return res.redirect('/');
}