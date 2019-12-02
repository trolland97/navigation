var db = require('./db');

module.exports = {
    login: login,
    logout: logout
}
// REWORK
function login(req, res) {
    if(!req.body.username || !req.body.password) {
        res.send(401, {
            message: "Username or password missing!"
        })
    } else {
        var uname = req.body.username;
        var pw = req.body.password;

        if(db.getObject('sessions', {username: uname})) {
            res.send(400, {
                message: "You are already logged in."
            });
        } else {
            try {
                var user = db.getObject('users', {username: uname});
                
                if(user.password == pw) {
                    db.createObject('sessions', {
                        "session_id": user._id,
                        "username": uname
                    })

                    res.json({
                        "sessionID": user._id
                    });
                } else {
                    res.send(401, {
                        message: "Wrong password."
                    })
                }
            } catch (err) {
                res.send(401, {
                    message: "User not found."
                });
            }
        }
    }
}

function logout(req, res) {
    let session_id = req.headers.x_session_id;
    if(db.getObject('sessions', {session_id: session_id})) {
        db.deleteObject('sessions', {session_id: session_id});

        res.json({
            "sessionID": session_id
        });
    } else {
        res.send(400, {
            message: "User is not logged in."
        })
    }
}