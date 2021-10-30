const cloud = require('./cloudinaryConfig')
const detection = require('./faceDetection')

module.exports = (app, db, employeeUtils) => {

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

  function sqlUserSelect(login){
    const sqlQuery1 = "SELECT Id FROM DB_employees WHERE Login like (?)"

    return new Promise((resolve, reject) => db.query(sqlQuery1, [login], (err, result) => {
      if (err) reject(err)
      else resolve(result)
      })
    );
  }

  function sqlInsertImg(id, picture){
    const sqlQuery2 = "INSERT INTO DB_employees_img (login_id, img) VALUES (?,?)"
    
    return new Promise ((resolve, reject) => {
      for(let i = 0; i<3; i++)
      {
        db.query(sqlQuery2, [id, picture[i]], (err, result) => {
          if (err) reject(err)
        });
      }
      resolve(true)
    })
  }

  function sqlModifyModel(){
    const sqlQuery3 = "SELECT Id FROM DB_employees"

    return new Promise((resolve, reject) => db.query(sqlQuery3, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
    );
      //detection.modifyModel(results_img);
      //resolve(results_img)
  }

  app.post('/employee/faceRegistration', (req, resSql) => {
    const picture = req.body.image;
    const login = req.body.login;
    
    //getting employee's id from DB
    let id
    
    sqlUserSelect(login)
      .then((res) => {

        id = res[0].Id;
        console.log("sqlUserSelect - resolve")

        sqlInsertImg(id, picture)
          .then((res) => {
            console.log("sqlInsertImg - resolve")

            sqlModifyModel()
              .then((res) => {
                //console.log("sqlModifyModel - resolve" + res)
                
                //detection.modifyModel()
                detection.modifyModel(res)
                  .then((res) => {
                    return resSql.status(200).json({
                      error: false,
                      message: "Added face to db."
                    });
                  })
                  .catch((err) => {
                    return resSql.status(401).json({
                      error: true,
                      message: "detection.modifyModel - crashed",
                    });
                  })
              })
              .catch((err) => {
                return resSql.status(401).json({
                  error: true,
                  message: "Select users to model - error."
                });
              })

          })
          .catch((err) => {
            return resSql.status(401).json({
              error: true,
              message: "Insert img error."
            });
          })

      })
      .catch((err) => {
        return resSql.status(401).json({
          error: true,
          message: "Invalid user data."
        });
      });




    
    //console.log(results_img)
    

    
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