const commonFunc = require('./PanelsEndPoints/commonFunc');

module.exports = (app, db, clientUtils) => {

  app.get('/client/loginRouteTest', (req, res) => {
    res.status(200).json({
      success: true, 
      message: 'Client login route file works correctly'
    });
  })
  // validate the user credentials
  app.post('/client/signin', (req, res) => {
    const email = req.body.email;
    const pwd = req.body.pass;

    const pwdHash = commonFunc.makeHash(pwd);

    if (!email || !pwd) { //if empty
      return res.status(400).json({
        error: true,
        message: "Username or Password required."
      });
    } 

    //console.log("email: " + email + ", pass " + pwd + "\n");

    const sqlQuery = "SELECT * FROM DB_clients WHERE Mail like (?) AND Password like (?)"

    db.query(sqlQuery, [email, pwdHash], (err, result) => {
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
        //console.log(userData)
        const token = clientUtils.generateToken(userData);
        const userObj = clientUtils.getCleanUser(userData);
        //console.log('token', typeof(userObj.IsCompany))
        return res.status(200).json({ user: userObj, token }); 
      }
    })
  });

  app.post('/client/ResetPassword', (req,res) => {
    const email = req.body.email;

    sqlClientSelect(email).then((phone) =>{
      console.log(phone[0])
      
      if (phone[0]){
        let number = phone[0].Phone;
        
        let verifyCode = generateCode();
        let text = {to: number, message: verifyCode + " to Twój kod weryfikacyjny", from: "CSSS"}
        let sender = require('./smsSender')
  
        //sms sender
        //sender.sendSMS(text)
        //sms sender end
        
        console.log(verifyCode)
        return res.status(200).json({verifyCode: verifyCode})
      }
      else return res.status(401).json({
        error: true,
        message: "Brak klienta o podanym adresie email."
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