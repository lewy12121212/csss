module.exports = (app, db, employeeUtils) => {

  app.get('/employee/LoginRouteTest', (req, res) => {
    res.status(200).json({
      success: true, 
      message: 'Employee login route file works correctly'
    });
  })
  // validate the user credentials
  app.post('/employee/signin', (req, res) => {
    const user = req.body.username;
    const pwd = req.body.password;

    if (!user || !pwd) { //if empty
      return res.status(400).json({
        error: true,
        message: "Username or Password required."
      });
    }

    const sqlQuery = "SELECT * FROM DB_employees WHERE Login like (?) AND Pass like (?)"

    db.query(sqlQuery, [user, pwd], (err, result) => {
      if (err) return res.status(401).json({
        error: true,
        message: "Invalid database connection."
      });

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
        const token = employeeUtils.generateToken(userData);
        const userObj = employeeUtils.getCleanUser(userData);
        return res.status(200).json({ user: userObj, token }); 
      }
    })
  });
}