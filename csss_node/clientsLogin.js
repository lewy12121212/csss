module.exports = (app, db, utils) => {

  app.get('/clientsLoginRouteTest', (req, res) => {
    res.status(200).json({
      success: true, 
      message: 'Clients login route file works correctly'
    });
  })
  // validate the user credentials
  app.post('/clients/signin', (req, res) => {
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
}