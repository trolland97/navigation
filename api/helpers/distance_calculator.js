function toRadians(num) {
    return num * Math.PI / 180;
}

module.exports = {
    calculator: calculator
}

function calculator(lon1, lon2, lat1, lat2) {
    var R = 6371e3;
    var φ1 = toRadians(lat1);
    var φ2 = toRadians(lat2);
    var Δφ = toRadians((lat2-lat1));
    var Δλ = toRadians((lon2-lon1));

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c / 1000;

    return d;
}