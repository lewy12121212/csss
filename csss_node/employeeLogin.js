
module.exports = (app, db, employeeUtils) => {

  const cloud = require('./cloudinaryConfig')
  const detection = require('./faceDetection')


  app.get('/employee/loginRouteTest', (req, res) => {
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

  app.post('/employee/faceRegistration', async (req,res) => {
    const picture = req.body.image;
    const login = req.body.login;
    
    //getting employee's id from DB
    let id
    const sqlQuery1 = "SELECT Id FROM DB_employees WHERE Login like (?)"

    let results = await new Promise((resolve, reject) => db.query(sqlQuery1, [login], (err, result) => {
      if (err) reject(err)
      else {
        resolve(result)
        }
      })
    );

    id = results[0].Id;
   
    //inserting img to faceRecognition
    const sqlQuery2 = "INSERT INTO DB_employees_img (login_id, img) VALUES (?,?)"
    
    for(let i = 0; i<3; i++)
    {
      db.query(sqlQuery2, [id, picture[i]], (err, result) => {
        if (err) return res.status(401).json({
          error: true,
          message: "Invalid database connection."
        });
      });
    }

    const sqlQuery3 = "SELECT Id FROM DB_employees"
    let results_img = await new Promise((resolve, reject) => db.query(sqlQuery3, (err, result) => {
      if (err) reject(err)
      else {
        resolve(result)
        }
      })
    );
    
    //console.log(results_img)
    detection.modifyModel(results_img);
    return res.status(200).json({
      message: "Added face to db."
    });
    
});

  app.post('/employee/faceLogin', async (req,res) => {
    const picture = req.body.image;
    const face = await detection.detecting(picture)
    console.log(face.label === 'lukasz')
      if (face.label === 'lukasz'){
        console.log(face.label === 'lukasz')
        res.status(200).end(face.label); 
      } 
      else res.status(401).json({
        error: true,
        message: "No user with this data."
      }).end();

  });

}