const distance_calculator = require('../helpers/distance_calculator');
const request = require('request');
const db = require('./db');

module.exports = {
    distance: distance
}


function distance(req, res) {
    var session_id = req.headers.x_session_id;
    var current_location = db.getObject('locations', {session_id: session_id});
    
    if(req.query.origin && req.query.destination) {
        var url_origin = encodeURI(`https://us1.locationiq.com/v1/search.php?key=pk.fbdd594fba29f3d918e79edc5f369e30&q&q=${req.query.origin}&format=json`);
        var url_destination = encodeURI(`https://us1.locationiq.com/v1/search.php?key=pk.fbdd594fba29f3d918e79edc5f369e30&q&q=${req.query.destination}&format=json`);
        
        locationRequest(url_origin, url_destination, res);
    } else if(!req.query.origin && req.query.destination) {
          var locationObject = db.getObject('locations', {session_id: session_id});

        if(locationObject) {
            var url_origin = encodeURI(`https://us1.locationiq.com/v1/search.php?key=pk.fbdd594fba29f3d918e79edc5f369e30&q&q=${locationObject.current_location}&format=json`);
            var url_destination = encodeURI(`https://us1.locationiq.com/v1/search.php?key=pk.fbdd594fba29f3d918e79edc5f369e30&q&q=${req.query.destination}&format=json`);
            
            locationRequest(url_origin, url_destination, res);
        } else {
              res.send(400, {
                  message: "Give origin or set current location."
              })
          }
    } else {
       res.send(400, {
           message: "Origin or detination missing."
       })
    }
}

function locationRequest(url_origin, url_destination, res) {
    request(url_origin, function(error1, response1, body1) {
        if(response1.statusCode == 200) {
            request(url_destination, function(error2, response2, body2) {
                if(response2.statusCode == 200) {
                    var d = distance_calculator.calculator(JSON.parse(response1.body)[0].lon, JSON.parse(response2.body)[0].lon, JSON.parse(response1.body)[0].lat, JSON.parse(response2.body)[0].lat);
                    res.json({
                        'distance': d + ' km'
                    })
                } else {
                    res.send(400, {
                        message: error2
                    })
                }
            });
        } else {
            res.send(400, {
                message: error1
            })
        }
    });
}