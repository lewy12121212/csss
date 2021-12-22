const commonFunc = require('./commonFunc')
const sender = require('../smsSender')
const {createHash,} = require('crypto');

let verifyCodes = [];

module.exports = (app, db) => {

  app.post('/client/dataValidation', (req, res) => {
    const name = req.body.ClientData.FirstName;
    const surname = req.body.ClientData.Surname;
    const mail = req.body.ClientData.Mail;
    const phone = req.body.ClientData.Phone;
    const address = req.body.ClientData.Address;
    const city = req.body.ClientData.City;
    const postalcode = req.body.ClientData.PostalCode;


    if(name === "" || surname === "" || mail === "" || phone === "" || address === "" || city === "" || postalcode === ""){
      return res.status(400).json({
        error: true,
        mainInfo: "Dane nie mogą być puste!",
        secondaryInfo: "Uzupełnij wymagane dane."
      }) 
    } 

    //regex
    if(!commonFunc.validateNameSurname(name) || !commonFunc.validateNameSurname(surname)){
      return res.status(400).json({
        error: true,
        mainInfo: "Imię lub nazwisko zawiera nieprawidłową składnie!",
        secondaryInfo: "Sprawdź poprawność podanych informacji."
      })
    }

    if(!commonFunc.validateEmail(mail)){
      return res.status(400).json({
        error: true,
        mainInfo: "Adres mailowy zawiera nieprawidłową składnie!",
        secondaryInfo: "Sprawdź poprawność podanych informacji."
      }) 
    }
    
    if(!commonFunc.validatePhone(phone)){
      return res.status(400).json({
        error: true,
        mainInfo: "Numer telefonu zawiera nieprawidłową składnie!",
        secondaryInfo: "Sprawdź poprawność podanych informacji."
      }) 
    }

    if(!commonFunc.validatePostalCode(postalcode)){
      return res.status(400).json({
        error: true,
        mainInfo: "Kod pocztowy zawiera nieprawidłową składnie!",
        secondaryInfo: "Sprawdź poprawność podanych informacji."
      }) 
    }

    const verifyCode = generateCode();

    const oldMail = req.body.Mail;
    const number = req.body.Phone;
    let text = {to: number, message: verifyCode + " to Twój kod weryfikacyjny", from: "CSSS"}

    //sms sender
    //sender.sendSMS(text)
    //sms sender end
    verifyCodes.push({mail: oldMail, code: verifyCode, date: Date.now()})
    console.log(verifyCode)

    return res.status(200).json({ 
      error: false,
      mainInfo: "Dane są poprawne.",
      secondaryInfo: "Aby zmienić dane podaj kod wysłany na Twój numer telefonu."
    }); 
  })

  app.post('/client/changeData', (req,res) => {
    
    const code = req.body.VerifyCode;
    const mail = req.body.Mail;

    var result = verifyCodes.filter(it => it.mail === mail);
    //console.log(Date.now()-result[0].date <180000, result[0].code.toString() == code)
    if(result[0].code.toString() == code && Date.now()-result[0].date <180000)
    {
      //console.log(req.body.ClientData)
      const id = req.body.ClientData.Id;
      const name = req.body.ClientData.FirstName;
      const surname = req.body.ClientData.Surname;
      const mail = req.body.ClientData.Mail;
      const phone = req.body.ClientData.Phone;
      const address = req.body.ClientData.Address;
      const city = req.body.ClientData.City;
      const postalcode = req.body.ClientData.PostalCode;      
      
      const sqlQuery = "UPDATE DB_clients SET FirstName = (?), Surname = (?), Address = (?), City = (?), PostalCode = (?), Phone = (?), Mail = (?) WHERE Id LIKE (?)"

      db.query(sqlQuery, [name, surname, address, city, postalcode, phone, mail, id], (err, result) => {
        if (err) {
          console.log(err)
          return res.status(401).json({
            error: true,
            mainInfo: "Problem z aktualizacją danych!",
            secondaryInfo: "Podany adres mailowy znajduje się już w bazie."
          }) 
        } else {

          verifyCodes = verifyCodes.filter(it => it.mail !== mail);

          return res.status(200).json({ 
            error: false,
            mainInfo: "Dane poprawnie zmieniono!",
            secondaryInfo: ""
          }); 
        }
      })

    }
    else
    {
      return res.status(404).json({
        error: true,
        mainInfo: "Błąd.",
        secondaryInfo: "Błędny kod weryfikacyjny."
      }) 
    }

  })

  app.post('/client/passwordValidation', (req, res) => {
    const id = req.body.Id
    const oldPassword = req.body.ClientPass.OldPass
    const newPassword = req.body.ClientPass.NewPass
    const newRePassword = req.body.ClientPass.NewRePass
    const oldPasswordHash = commonFunc.makeHash(oldPassword)
    const sqlQuery = "SELECT * FROM DB_clients WHERE Password LIKE (?) AND Id LIKE (?)"

    if(oldPassword === "" || newPassword === "" || newRePassword === "")
    {
      return res.status(401).json({
        error: true,
        mainInfo: "Dane nie mogą być puste!",
        secondaryInfo: "Uzupełnij wymagane dane."
      })
    }
    db.query(sqlQuery, [oldPasswordHash, id], (err, result) => {
      if (err) {
        return res.status(401).json({
          error: true,
          mainInfo: "Obecne hasło nie jest poprawne!",
          secondaryInfo: "Uzupełnij dane poprawnie."
        })
      }
      else if(result.length == 0 || result.length > 1){
        return res.status(401).json({
          error: true,
          mainInfo: "Obecne hasło nie jest poprawne!",
          secondaryInfo: "Uzupełnij dane poprawnie, a w razie problemów skontaktuj się z administratorem."
        })
      } else if(newPassword !== newRePassword){
        return res.status(401).json({
          error: true,
          mainInfo: "Nowe hasła nie są takie same.",
          secondaryInfo: "Sprawdź poprawność podanych danych."
        })
      }else {

        const verifyCode = generateCode();

        const oldMail = req.body.Mail;
        const number = req.body.Phone;
        let text = {to: number, message: verifyCode + " to Twój kod weryfikacyjny", from: "CSSS"}
        
    
        //sms sender
        //sender.sendSMS(text)
        //sms sender end
        verifyCodes.push({mail: oldMail, code: verifyCode, date: Date.now()})
        console.log(verifyCode)

        return res.status(200).json({ 
          error: false,
          mainInfo: "Dane są poprawne.",
          secondaryInfo: "Aby zmienić dane podaj kod wysłany na Twój numer telefonu."
        }); 
      }
    })

  })

  app.post('/client/changePassword', (req,res) => {
    
    const mail = req.body.Mail;
    const password = req.body.ClientPass;
    const code = req.body.Code;

    const passwordHash = commonFunc.makeHash(password)
    console.log("veryfi data: " + mail + " : " + password);

    var result = verifyCodes.filter(it => it.mail === mail);
    //console.log(Date.now()-result[0].date <180000, result[0].code.toString() == code)
    if(result[0].code.toString() == code && Date.now()-result[0].date <180000)
    {
      const sqlQuery = "UPDATE DB_clients SET Password = (?) WHERE Mail = (?)";

      db.query(sqlQuery, [passwordHash, mail], (error, results)=>{

        if(error)
          return res.status(401).json({
            error: true,
            message: "Błąd bazy danych. Spróbuj ponownie później."
          });
        else return res.status(200).json(
          {mainInfo: "Dane poprawnie zmieniono!",
            secondaryInfo: ""})
      });
    }
    else
    {
      return res.status(404).json({
        error: true,
        mainInfo: "Błąd.",
        secondaryInfo: "Błędny kod weryfikacyjny lub upłynęła jego ważność."
      }) 
    }
  })

  app.post('/client/resetPassword', (req,res) => {
    const email = req.body.email;

    sqlClientSelect(email).then((phone) =>{
      console.log(phone[0])
      
      if (phone[0]){
        let number = phone[0].Phone;
        
        let verifyCode = generateCode();
        let text = {to: number, message: verifyCode + " to Twój kod weryfikacyjny", from: "CSSS"}
  
        //sms sender
        //sender.sendSMS(text)
        //sms sender end
        verifyCodes.push({mail: email, code: verifyCode, date: Date.now()})
        console.log(verifyCode)
        return res.status(200).json({verifyCode: verifyCode})
      }
      else return res.status(401).json({
        error: true,
        message: "Brak klienta o podanym adresie email."
      });
    });
    
  });

  app.post('/client/verifyCode', (req,res) => {
    const code = req.body.Code;
    const mail = req.body.Mail;

    var result = verifyCodes.filter(it => it.mail === mail);
    //console.log(Date.now()-result[0].date <180000, result[0].code.toString() == code)
    if(result[0].code.toString() == code && Date.now()-result[0].date <180000)
    {
      return res.status(200).json(
      {
        error: false,
        message: "Kod jest poprawny.",
      })
    }
    else
    {
      return res.status(404).json({
        error: true,
        message: "Błędny kod weryfikacyjny lub upłynęła jego ważność."
      })
    }
  })


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

  app.post('/client/getRepairsList', (req,res) => {

    const id = req.body.clientId;
    //console.log(req.body)
    const sqlQuery = "SELECT \
    `DB_repairs`.`Id`,\
    `DB_repairs`.`ServiceId`,\
    `DB_repairs`.`DeviceId`,\
    `DB_repairs`.`CreationDate` ,\
    `DB_repairs`.`Description`,\
    `DB_repairs`.`Closed`,\
    `DB_repairs`.`IfReceived`,\
    `DB_repairs`.`ReceivDate`,\
    `DB_devices`.`Name` AS DeviceName, \
    `DB_devices`.`Model` AS DeviceModel, \
    `DB_devices`.`SN` AS DeviceSN, \
    `DB_devices`.`Type` AS DeviceType, \
    `DB_employees`.`Id` AS EmployeeId, \
    `DB_employees`.`Name` AS EmployeeName, \
    `DB_employees`.`Surname` AS EmployeeSurname, \
    `DB_employees`.`Login` AS EmployeeLogin \
    FROM `DB_repairs` \
    LEFT OUTER JOIN `DB_devices` ON `DB_repairs`.`DeviceId` like `DB_devices`.`Id` \
    LEFT JOIN `DB_employees` ON `DB_repairs`.`ServiceId` like `DB_employees`.`Id`\
    WHERE `DB_repairs`.`ClientId`=(?) \
    ORDER BY `DB_repairs`.`CreationDate` ASC;";

    db.query(sqlQuery,  [id], (err, result) => {
      if (err) {
        console.log(err)
        return res.status(406).json({
          error: true,
          message: "Problem z pobraniem bazy napraw."
        }) 
      } else {
        //console.log(result)
        return res.status(200).json({ 
          error: false,
          data: result
        }); 
      }
    })
  })

  function generateCode(){
    return Math.floor(
      Math.random() * (999999 - 100000) + 100000
    )
  }

}