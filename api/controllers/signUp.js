var db = require('./db');

db.initCollection('users');

module.exports = {
    createUser: createUser
}

function createUser(req, res) {
    try {
        var uname = req.swagger.params.user.value.username;
        var pw = req.swagger.params.user.value.password;

        var new_user = {
            "username": uname,
            "password": pw
        }

        if(db.getObject('users', new_user) == null) {
            var _id = db.createObject('users', new_user);

            res.json({
                _id: _id._id
            });
        } else {
            res.send(400, {
                message: "User already exists!"
            })
        }
    } catch (err) {
        return res.send(400, {
            message: err.message
        })
    }
}
