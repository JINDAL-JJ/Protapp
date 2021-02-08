const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function(req, res) {
    // console.log(req.body);
    try {
        let user = await User.findOne({email: req.body.email});

        if(!user || user.password != req.body.password) {
            return res.json(422, {
                message: "invalid username or password"
            })
        } else {
            return res.json(200, {
                message: "Sign in successful, here is your token, keep it safe",
                data: {
                    token: jwt.sign(user.toJSON(), 'jindal', {expiresIn: '100000'})
                }
            })
        }
    } catch(err) {
        console.log("******", err);
        return res.json(500, {
            message: "Internal server error",
        })
    }
}