//const cloud = require('./cloudinaryConfig')
//const detection = require('./faceDetection')
//const faceapi = require('@vladmandic/face-api');
const canvas = require("canvas");
const path = require('path');
const commonFunc = require('./PanelsEndPoints/commonFunc')

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

    
    const pwdHash = commonFunc.makeHash(pwd);

    if (!user || !pwd) { //if empty
      return res.status(400).json({
        error: true,
        message: "Username or Password required."
      });
    }

    const sqlQuery = "SELECT * FROM DB_employees WHERE Login like (?) AND Pass like (?)"

    db.query(sqlQuery, [user, pwdHash], (err, result) => {
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

  function checkUserFace(table_of_img){
    console.log("check user face table length: " + table_of_img.length )
    
    let i = 0;

    return new Promise (async (resolve, reject) => {
      var detections;
      console.log("A tu może?")

      await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, 'models'))
      await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, 'models'))
      await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, 'models'))

      for(let j=0; j<table_of_img.length; j++){
        console.log("for")

        const img = await canvas.loadImage(table_of_img[i])

        detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

        if(!detections) i++;

      }
      if(i >= 2) reject(false)
      else resolve(true)
    })
  }

  function sqlInsertImg(id, picture){
    const sqlQuery2 = "INSERT INTO DB_employees_img (LoginId, Img) VALUES (?,?)"
    return new Promise ((resolve, reject) => {
      for(let i = 0; i<3; i++)
      {
        db.query(sqlQuery2, [id, picture[i]], (err, result) => {
          if (err) reject(err)
          console.log('aa ', result)
        });
      }
      resolve(true)
    })
  }

  function sqlDeleteImg(id){
    const sqlQuery = "DELEtE FROM DB_employees_img WHERE LoginId=(?)"

    db.query(sqlQuery, [id], (err, result) => {
      if (err) {
        console.log(err)
      } 
    })
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

        //deleting old img from db
        sqlDeleteImg(id)

        checkUserFace(picture)
          .then((res) => {
          
            sqlInsertImg(id, picture)
            .then((res) => {
              console.log("sqlInsertImg - resolve")
    
              return resSql.status(200).json({
                error: false,
                message: "Twarz poprawnie dodano do bazy."
              });
    
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
              message: "Na zdjęciach nie wykryto twarzy."
            });
          })
      })
      .catch((err) => {
        return resSql.status(401).json({
          error: true,
          message: "Invalid user data."
        });
      });
});

  app.post('/employee/modifyFaceModel', (req, resSql) => {          

    detection.modifyModel()
      .then((res) => {
        return resSql.status(200).json({
          error: false,
          message: "Succeful modify model."
        });
      })
      .catch((err) => {
        return resSql.status(401).json({
          error: true,
          message: "Update model error."
        });
      })

  })

  app.post('/employee/faceLogin', async (req,res) => {
    const picture = req.body.image;
    const face = await detection.detecting(picture)
    
    console.log(face + " label: " + face.label)
      if (face.label !== "unknown" && face.label !== undefined) {
        // w celu zalogowania użytkownika
        // 1. wykonać zapytanie sql do bazy danych użytkowników (where id like face.label)
        // 2. result z bazy przekazać do generate token
        // 3. token zwrócić analogicznie do logowania przy pomocy hasła
        //return res.status(200).json({
        //  error: false,
        //  user: face.label,
        //  message: "Face recognition succeed"
        //});

        const sqlQuery = "SELECT * FROM DB_employees WHERE Id like (?)"

        db.query(sqlQuery, [face.label], (err, result) => {
          if (err) return res.status(401).json({
            error: true,
            message: "Problem z połączeniem z bazą."
          });
    
          if(result.length > 1 || result.length === 0){
            return res.status(401).json({
              error: true,
              message: "Wielu użytkowników o tych samych danych."
            });
          } else {
            let userData = result[0]
            const token = employeeUtils.generateToken(userData);
            const userObj = employeeUtils.getCleanUser(userData);
            return res.status(200).json({ user: userObj, token: token }); 
          }
        })
      } 
      else res.status(401).json({
        error: true,
        message: "Błąd rozpoznawania twarzy"
      });
  });

}