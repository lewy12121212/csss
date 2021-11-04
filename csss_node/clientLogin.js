module.exports = (app, db, clientUtils) => {

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
        const token = clientUtils.generateToken(userData);
        const userObj = clientUtils.getCleanUser(userData);
        return res.status(200).json({ user: userObj, token }); 
      }
    })
  });

  app.post('/resetPassword', (req,res) => {
    const email = req.body.email;

    sqlClientSelect(email).then((phone) =>{
      console.log(phone[0])
      
      if (phone[0]){
        let number = phone[0].Phone;
        
        let verifyCode = generateCode();
        let text = {to: number, message: verifyCode + " to Twój kod weryfikacyjny", from: "CSSS"}
        let sender = require('./smsSender')
  
        sender.sendSMS(text)
  
        return res.status(200).json({verifyCode: verifyCode})
      }
      else return res.status(401).json({
        error: true,
        message: "No user with this data."
      });
    });
    
    
  });

  function sqlClientSelect(email){
    const sqlQuery1 = "SELECT Phone FROM DB_clients WHERE Mail like (?)"

    return new Promise((resolve, reject) => db.query(sqlQuery1, [email], (err, result) => {
      if (err) 
        reject(err)
      else 
        resolve(result)
      })
    );
  }

  function generateCode(){
    return Math.floor(
      Math.random() * (999999 - 100000) + 100000
    )
  }

}