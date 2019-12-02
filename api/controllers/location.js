const db = require('./db');

db.initCollection('locations');

module.exports = {
    setLocation: setLocation,
    deleteLocation: deleteLocation
}

function setLocation(req, res) {
    var location = req.query.location;
    var session_id = req.headers.x_session_id
    var objectToUpdate = db.getObject('locations', {session_id: req.headers.x_session_id});

    if(objectToUpdate) {
            
        objectToUpdate.current_location = location;
        db.updateObject('locations', {session_id: req.headers.x_session_id}, objectToUpdate);
        
        res.json({
            location: location
        });
    } else {
        var objectToCreate = {
            "session_id": session_id,
            "current_location": location
        }

        db.createObject('locations', objectToCreate);

        res.json({
            location: location
        });
    }    
}

function deleteLocation(req, res) {
    var session_id = req.headers.x_session_id;
    var objectToDelete = db.getObject('locations', {session_id: session_id});

    if(objectToDelete) {
        db.deleteObject('locations', {session_id: session_id});

        res.json({
            location: objectToDelete.current_location
        })
    } else {
        res.send(400, {
            message: "There isn't any location set to this session id."
        })
    }
}