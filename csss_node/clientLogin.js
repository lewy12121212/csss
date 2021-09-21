module.exports = (app, db, utils, jwt) => {

  app.get('/client/LoginRouteTest', (req, res) => {
    res.status(200).json({
      success: true, 
      message: 'Client login route file works correctly'
    });
  })
  // validate the user credentials
  app.post('/client/signin', (req, res) => {
    const email = req.body.email;
    const repairId = req.body.repairId;

    if (!email || !repairId) { //if empty
      return res.status(400).json({
        error: true,
        message: "Username or Password required."
      });
    } 

    console.log("email: " + email + ", repairId: " + repairId + "\n");

    const sqlQuery = "SELECT * FROM DB_clients WHERE Mail like (?) AND RepairId like (?)"

    db.query(sqlQuery, [email, repairId], (err, result) => {
      if (err) return res.status(401).json({
        error: true,
        message: "Invalid database connection."
      })
      if(result.length > 1){
        return res.status(401).json({
          error: true,
          message: "Many users with the same login."
        });
      } else if(result.length == 0){
        return res.status(401).json({
          error: true,
          message: "No user with this data."
        });
      } else {
        let userData = result[0]
        const token = utils.generateToken(userData);
        const userObj = utils.getCleanUser(userData);
        return res.status(200).json({ user: userObj, token }); 
      }
    })
  });

  app.get('/client/verifyToken', (req, res) => {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token;
    if (!token) {
      return res.status(400).json({
        error: true,
        message: "Token is required."
      });
    }
    // check token that was passed by decoding token using secret
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(401).json({
        error: true,
        message: "Invalid token."
      });
  
      const sqlQuery = "SELECT * FROM DB_clients WHERE Id like (?)"
      db.query(sqlQuery, [user.Id], (err, result) => {
        if (err) return res.status(401).json({
          error: true,
          message: "Invalid database connection."
        });
        // return 401 status if the userId does not match.
        if (user.Id !== result[0].Id) {
          return res.status(401).json({
            error: true,
            message: "Invalid user."
          });
        }
        // get basic user details
        var userObj = utils.getCleanUser(result[0]);
        return res.json({ user: userObj, token });
      })
    });
  });
}