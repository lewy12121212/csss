// generate token using secret from process.env.JWT_SECRET
var jwt = require('jsonwebtoken');

// generate token and return it
function generateToken(user) {
    //1. Don't use password and other sensitive fields
    //2. Use the information that are useful in other parts
    if (!user) return null;

    var u = {
        Id: user.Id,
        Name: user.Name,
        Surname: user.Surname,
        Login: user.Login,
        Type: user.Type
    };

    return jwt.sign(u, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 // expires in 24 hours
    });
}

// return basic user details
function getCleanUser(user) {
    console.log("getCleanUser: ", user.Id)
    if (!user) return null;
    
    return {
        Id: user.Id,
        Name: user.Name,
        Surname: user.Surname,
        Login: user.Login,
        Type: user.Type
    };
}

function parseQueryResult(result){
    let data = Object.keys(result).forEach(function (key) {
        var row = result[key];
        console.log("Login: " + row.Login + " Pass: " + row.Pass)
        return row;
    });
    console.log("Data Login: " + data.Login + " Pass: " + data.Pass)
}

module.exports = {
    generateToken,
    getCleanUser,
    parseQueryResult,
}