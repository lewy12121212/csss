const commonFunc = require('./commonFunc')

module.exports = (app, db, employeeUtils) => {

  app.get('/employee/admin/getUsersTable', (req, res) => {

    const sqlQuery = "SELECT Id, Name, Surname, Login, Mail, Phone, Type FROM DB_employees";

    db.query(sqlQuery, (err, result) => {
      if (err) {
        return res.status(401).json({
          error: true,
          message: "Problem z pobraniem bazy użytkowników"
        }) 
      } else {
        return res.status(200).json({ 
          error: false,
          data: result
        }); 
      }
    })
  })

  app.post('/employee/admin/dataEmployeeValidation', (req,res) => {
    const name = req.body.EmployeeData.Name;
    const surname = req.body.EmployeeData.Surname;
    const password = req.body.EmployeeData.Password;
    const mail = req.body.EmployeeData.Mail;
    const type = req.body.EmployeeData.Type;
    

    if(name === "" || surname === "" || password === "" || mail === "" || type === ""){
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
    

    return res.status(200).json({ 
      error: false,
      mainInfo: "Dane są poprawne.",
      secondaryInfo: "Czy na pewno chcesz dodać pracownika?"
    }); 
  })

  app.post('/employee/admin/addEmployee', (req, res) => {
    const name = req.body.EmployeeData.Name;
    const surname = req.body.EmployeeData.Surname;
    const login = req.body.EmployeeData.Login;
    const pass = req.body.EmployeeData.Password;
    const mail = req.body.EmployeeData.Mail;
    const phone = req.body.EmployeeData.Phone;
    const type = req.body.EmployeeData.Type;

//TODO - check login if exists in DB!!!

    const sqlQuery = "INSERT INTO DB_employees (Name, Surname, Login, Pass, Mail, Phone, Type) VALUES (?,?,?,?,?,?,?)";

    db.query(sqlQuery, [name, surname, login, pass, mail, phone, type], (err, result) => {
      if(err)
      { 
        if(err.errno == 1062)
        {
          return res.status(400).json({
            error: true,
            mainInfo: "Problem z dodaniem danych!",
            secondaryInfo: "Pracownik o podanym loginie już istnieje."
          });
        }
        return res.status(406).json({
          error: true,
          mainInfo: "Błąd bazy danych. Spróbuj ponownie później."
        });
        
      }
      else return res.status(200).json({mainInfo:'Pomyślnie dodano pracownika', result: result})
    })
  })

  app.post('/employee/admin/resetPassword', (req,res) =>{
    const sqlQuery = "UPDATE DB_employees SET Pass = (?) WHERE Login = (?);"

    const password = req.body.EmployeeData.Password;
    const login = req.body.EmployeeData.Login;

    db.query(sqlQuery, [password, login], (err, result) => {
      if(err)
      { 
        return res.status(406).json({
          error: true,
          mainInfo: "Błąd bazy danych. Spróbuj ponownie później."
        });
        
      }
      else return res.status(200).json({mainInfo:'Pomyślnie zresetowano hasło.', secondaryInfo: `Obecne hasło to: ${password}`})
    })

  })


  app.post('/employee/admin/deleteAccount', (req,res) => {

    const sqlQuery = "DELETE FROM DB_employees WHERE Login = (?)";

    const login = req.body.EmployeeData.Login;

    db.query(sqlQuery, [login], (err, result) => {
      if(err)
      { 
        console.log(err)
        return res.status(406).json({
          error: true,
          mainInfo: "Błąd bazy danych. Spróbuj ponownie później."
        });
        
      }
      else return res.status(200).json({mainInfo:`Usunięto konto pracownika ${login}`})
    })

  })

  app.post('/employee/admin/reopenRepair', (req,res) => {

    const sqlQuery = "UPDATE DB_repairs SET Closed = 0 WHERE Id = (?);"

    const id = req.body.Id;

    db.query(sqlQuery, [id], (err, result) => {
      if(err)
      { 
        console.log(err)
        return res.status(406).json({
          error: true,
          mainInfo: "Błąd bazy danych. Spróbuj ponownie później."
        });
        
      }
      else return res.status(200).json({mainInfo:`Zlecenie przeniesione do naprawianych.`})
    })
  })


  app.post('/employee/admin/changeReceived', (req,res) => {

    const sqlQuery = "UPDATE DB_repairs SET IfReceived = 0 WHERE Id = (?);"

    const id = req.body.Id;

    db.query(sqlQuery, [id], (err, result) => {
      if(err)
      { 
        console.log(err)
        return res.status(406).json({
          error: true,
          mainInfo: "Błąd bazy danych. Spróbuj ponownie później."
        });
        
      }
      else return res.status(200).json({mainInfo:`Zlecenie przeniesione do oczekujących na odebranie.`})
    })
  })


  app.get('/employee/admin/allClosedRepair', (req,res) => {
    
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
    WHERE `DB_repairs`.`Closed` = 1 \
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


}