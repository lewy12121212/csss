const commonFunc = require('./commonFunc')

module.exports = (app, db, employeeUtils) => {

  app.post('/employee/common/userDataValidation', (req, res) => {
    const name = req.body.UserData.Name;
    const surname = req.body.UserData.Surname;
    const login = req.body.UserData.Login;
    const mail = req.body.UserData.Mail;
    const phone = req.body.UserData.Phone;

        //console.log(id + name + surname + mail + login + phone)
    if(name === "" || surname === "" || login === "" || mail === "" || phone === ""){
      return res.status(401).json({
        error: true,
        mainInfo: "Dane nie mogą być puste!",
        secondaryInfo: "Uzupełni wymagane dane."
      }) 
    } 

    //regex
    if(!commonFunc.validateNameSurname(name) || !commonFunc.validateNameSurname(surname)){
      return res.status(401).json({
        error: true,
        mainInfo: "Imię lub nazwisko zawiera nieprawidłową składnie!",
        secondaryInfo: "Sprawdź poprawność podanych informacji."
      })
    }

    if(!commonFunc.validateLogin(login)){
      return res.status(401).json({
        error: true,
        mainInfo: "Login zawiera nieprawidłową składnie!",
        secondaryInfo: "Sprawdź poprawność podanych informacji."
      })
    }

    if(!commonFunc.validateEmail(mail)){
      return res.status(401).json({
        error: true,
        mainInfo: "Adres mailowy zawiera nieprawidłową składnie!",
        secondaryInfo: "Sprawdź poprawność podanych informacji."
      }) 
    }
    
    if(!commonFunc.validatePhone(phone)){
      return res.status(401).json({
        error: true,
        mainInfo: "Numer telefonu zawiera nieprawidłową składnie!",
        secondaryInfo: "Sprawdź poprawność podanych informacji."
      }) 
    }

    return res.status(200).json({ 
      error: false,
      mainInfo: "Dane są poprawne.",
      secondaryInfo: "Czy na pewno chcesz zmienić dane użytkownika?"
    }); 
  })

  app.post('/employee/common/changeUserData', (req, res) => {
    const id = req.body.UserData.Id;
    const name = req.body.UserData.Name;
    const surname = req.body.UserData.Surname;
    const login = req.body.UserData.Login;
    const mail = req.body.UserData.Mail;
    const phone = req.body.UserData.Phone;

    const sqlQuery = "UPDATE DB_employees SET Name = (?), Surname = (?), Login = (?), Mail = (?), Phone = (?) WHERE Id like (?)";

    db.query(sqlQuery, [name, surname, login, mail, phone, id], (err, result) => {
      if (err) {
        return res.status(401).json({
          error: true,
          mainInfo: "Problem z aktualizacją danych!",
          secondaryInfo: "Podany login już istnieje."
        }) 
      } else {
        return res.status(200).json({ 
          error: false,
          mainInfo: "Dane poprawnie zmieniono!",
          secondaryInfo: "Aktualizacja będzie widoczna po przeładowaniu strony."
        }); 
      }
    })
  })

  app.post('/employee/common/passwordValidation', (req, res) => {
    const id = req.body.Id
    const oldPassword = req.body.UserPass.OldPass
    const newPassword = req.body.UserPass.NewPass
    const newRePassword = req.body.UserPass.NewRePass

    const sqlQuery = "SELECT * FROM DB_employees WHERE Pass LIKE (?) AND Id LIKE (?)"

    db.query(sqlQuery, [oldPassword, id], (err, result) => {
      if (err) {
        return res.status(401).json({
          error: true,
          mainInfo: "Obecne hasło nie jest poprawne!",
          secondaryInfo: "Uzupełni dane poprawnie."
        })
      }

      if(result.length == 0 || result.length > 1){
        return res.status(401).json({
          error: true,
          mainInfo: "Obecne hasło nie jest poprawne!",
          secondaryInfo: "Uzupełni dane poprawnie, a w razie problemów skontaktuj się z administratorem."
        })
      } else if(oldPassword === "" || newPassword === "" || newRePassword === ""){
        return res.status(401).json({
          error: true,
          mainInfo: "Hasła nie mogą być puste!",
          secondaryInfo: "Uzupełni wymagane dane."
        })
      } else if(newPassword !== newRePassword){
        return res.status(401).json({
          error: true,
          mainInfo: "Nowe hasła nie są takie same.",
          secondaryInfo: "Sprawdź poprawność podanych danych."
        })
      } else {
        return res.status(200).json({ 
          error: false,
          mainInfo: "Dane są poprawne.",
          secondaryInfo: "Czy na pewno chcesz zmienić hasło do systemu?"
        }); 
      }
    })

  })

  app.post('/employee/common/changePassword', (req, res) => {
    const id = req.body.Id
    const newPassword = req.body.UserPass.NewPass
    //const newRePassword = req.body.UserPass.NewRePass

    const password = newPassword;
    const sqlQueryPassChange = "UPDATE DB_employees SET Pass = (?) WHERE Id like (?)";
  
    db.query(sqlQueryPassChange, [password, id], (err, result) => {
      if (err) {
        return res.status(401).json({
          error: true,
          mainInfo: "Hasło nie zostało zmienione.",
          secondaryInfo: "Spróbuj ponownie później lub zgłoś problem administratorowi systemu."
        }) 
      }
      return res.status(200).json({ 
        error: false,
        mainInfo: "Poprawnie zmieniono hasło użytkownika.",
        secondaryInfo: "Przy kolejnym logowaniu użyj nowego hasła."
      }); 
    })

  })

  app.get('/employee/common/allRepairs', (req,res) => {
    
    const sqlQuery = "SELECT * FROM DB_repairs"

    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.log(err)
        return res.status(406).json({
          error: true,
          message: "Problem z pobraniem bazy napraw."
        }) 
      } else {
        return res.status(200).json({ 
          error: false,
          data: result
        }); 
      }
    })
  })

  //app.post('/employee/common/oneRepair', (req,res) => {
  //  
  //  const id = req.body.Id;
  //  const sqlQuery = "SELECT * FROM DB_repairs WHERE Id like (?)"
//
  //  console.log("id repair" + id)
//
  //  db.query(sqlQuery, [id], (err, result) => {
  //    if (err) {
  //      console.log(err)
  //      return res.status(406).json({
  //        error: true,
  //        message: "Problem z pobraniem bazy napraw."
  //      }) 
  //    } else {
  //      return res.status(200).json({ 
  //        error: false,
  //        data: result
  //      }); 
  //    }
  //  })
  //})

  app.get('/employee/common/allRepairsInner', (req,res) => {
    
    const sqlQuery = "SELECT \
    `DB_repairs`.*, \
    `DB_devices`.`Name` AS DeviceName, \
    `DB_devices`.`Model` AS DeviceModel, \
    `DB_devices`.`SN` AS DeviceSN, \
    `DB_devices`.`Type` AS DeviceType, \
    `DB_clients`.`Id` AS ClientId, \
    `DB_clients`.`Name` AS ClientName, \
    `DB_clients`.`Mail` AS ClientMail, \
    `DB_clients`.`Phone` AS ClientPhone, \
    `DB_employees`.`Id` AS EmployeeId, \
    `DB_employees`.`Name` AS EmployeeName, \
    `DB_employees`.`Surname` AS EmployeeSurname, \
    `DB_employees`.`Login` AS EmployeeLogin, \
    `DB_employees`.`Mail` AS EmployeeMail, \
    `DB_employees`.`Phone` AS EmployeePhone \
    FROM `DB_repairs` \
    INNER JOIN `DB_clients` ON `DB_repairs`.`ClientId` like `DB_clients`.`Id` \
    INNER JOIN `DB_devices` ON `DB_repairs`.`DeviceId` like `DB_devices`.`Id` \
    INNER JOIN `DB_employees` ON `DB_repairs`.`ServiceId` like `DB_employees`.`Id`\
    WHERE `DB_repairs`.`IfReceived` = FALSE AND Closed = 0 \
    ORDER BY `DB_repairs`.`CreationDate` ASC;";
    

    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.log(err)
        return res.status(406).json({
          error: true,
          message: "Problem z pobraniem bazy napraw."
        }) 
      } else {
        return res.status(200).json({ 
          error: false,
          data: result
        }); 
      }
    })

  })

  app.post('/employee/common/oneRepairInner', (req,res) => {

    const id = req.body.Id
    const sqlQuery = "SELECT \
    `DB_repairs`.*, \
    `DB_devices`.`Name` AS DeviceName, \
    `DB_devices`.`Model` AS DeviceModel, \
    `DB_devices`.`SN` AS DeviceSN, \
    `DB_devices`.`Type` AS DeviceType, \
    `DB_clients`.`Id` AS ClientId, \
    `DB_clients`.`Name` AS ClientName, \
    `DB_clients`.`Mail` AS ClientMail, \
    `DB_clients`.`Phone` AS ClientPhone, \
    `DB_employees`.`Id` AS EmployeeId, \
    `DB_employees`.`Name` AS EmployeeName, \
    `DB_employees`.`Surname` AS EmployeeSurname, \
    `DB_employees`.`Login` AS EmployeeLogin, \
    `DB_employees`.`Mail` AS EmployeeMail, \
    `DB_employees`.`Phone` AS EmployeePhone \
    FROM `DB_repairs` \
    INNER JOIN `DB_clients` ON `DB_repairs`.`ClientId` like `DB_clients`.`Id` \
    INNER JOIN `DB_devices` ON `DB_repairs`.`DeviceId` like `DB_devices`.`Id` \
    INNER JOIN `DB_employees` ON `DB_repairs`.`ServiceId` like `DB_employees`.`Id`\
    WHERE `DB_repairs`.`Id` like (?) \
    ORDER BY `DB_repairs`.`CreationDate` ASC;";
    
    console.log("ID: " + id)

    db.query(sqlQuery, [id], (err, result) => {
      if (err) {
        console.log(err)
        return res.status(406).json({
          error: true,
          message: "Problem z pobraniem bazy napraw."
        }) 
      } else {
        return res.status(200).json({ 
          error: false,
          data: result
        }); 
      }
    })

  })

}