const commonFunc = require('./commonFunc')

module.exports = (app, db) => {

  app.post('/repair/clientValidate', (req, res) => {
    const name = req.body.ClientData.FirstName;
    const surname = req.body.ClientData.Surname;
    const password = req.body.ClientData.Password;
    const mail = req.body.ClientData.Mail;
    const phone = req.body.ClientData.Phone;
    const address = req.body.ClientData.Address;
    const city = req.body.ClientData.City;
    const postalcode = req.body.ClientData.PostalCode;

    if(name === "" || surname === "" || password === "" || mail === "" || phone === "" || address === "" || city === "" || postalcode === ""){
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

    return res.status(200).json({ 
      error: false,
      mainInfo: "Dane są poprawne.",
      secondaryInfo: "Czy na pewno chcesz dodać klienta?"
    }); 
  })

  app.post('/repair/deviceValidate', (req, res) => {
  
    const name = req.body.DeviceData.Name;
    const model = req.body.DeviceData.Model;
    const sn = req.body.DeviceData.Sn;
    const type = req.body.DeviceData.Type;

    if(name === "" || model === "" || sn === "" || type === ""){
      return res.status(400).json({
        error: true,
        mainInfo: "Dane nie mogą być puste!",
        secondaryInfo: "Uzupełnij wymagane dane."
      }) 
    }
    else{
      return res.status(200).json({ 
        error: false,
        mainInfo: "Dane są poprawne.",
        secondaryInfo: "Czy na pewno chcesz dodać klienta?"
      }); 
    }
  })

  app.get('/repair/getListOfClients', (req,res) => {
    const sqlQuery = "SELECT Id, Name, FirstName, Surname, Mail, Phone, IsCompany FROM DB_clients";

    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.log(err)
        return res.status(406).json({
          error: true,
          message: "Problem z pobraniem bazy klientów."
        }) 
      } else {
        return res.status(200).json({ 
          error: false,
          data: result
        }); 
      }
    })
  })

  app.post('/repair/getListOfDevice', (req,res) => {
    const id = req.body.id;
    const sqlQuery = "SELECT * FROM DB_devices WHERE ClientId like (?)"

    db.query(sqlQuery, [id], (err, result) => {
      if (err) {
        console.log(err)
        return res.status(406).json({
          error: true,
          mainInfo: "Problem z pobraniem bazy urządzeń.",
          secondaryInfo: "Spróbuj ponownie później"
        }) 
      } else {
        return res.status(200).json({ 
          error: false,
          data: result
        }); 
      }
    })
  })

  app.get('/repair/getService', (req,res) => {

    const sqlQuery = "SELECT Id, Name, Surname, Login FROM DB_employees WHERE Type LIKE 'Service'";

    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.log(err)
        return res.status(406).json({
          error: true,
          message: "Problem z pobraniem bazy pracowników."
        }) 
      } else {
        return res.status(200).json({ 
          error: false,
          data: result
        }); 
      }
    })
  })

  app.post('/repair/addNewClient', (req,res) => {
    const sqlQuery = "INSERT into DB_clients (Name, FirstName, Surname, Address, City, PostalCode, Mail, Password, Phone, IsCompany) VALUES (?,?,?,?,?,?,?,?,?,?)"

    let name = req.body.ClientData.Name;

    const firstname = req.body.ClientData.FirstName;
    const surname = req.body.ClientData.Surname;
    const password = req.body.ClientData.Password;
    const mail = req.body.ClientData.Mail;
    const phone = req.body.ClientData.Phone;
    const address = req.body.ClientData.Address;
    const city = req.body.ClientData.City;
    const postalcode = req.body.ClientData.PostalCode;
    let company = 1;

    const passHash = commonFunc.makeHash(password);

    if (name === "") {
      name = firstname + ' ' + surname;
      company = 0;
    }
    console.log(name)
    db.query(sqlQuery, [name, firstname, surname, address, city, postalcode, mail, passHash, phone, company], (error, results)=>{
      
      if(error)
      { console.log("ERROR: " + error)
        if(error.errno == 1062)
        {
          return res.status(400).json({
            error: true,
            mainInfo: "Problem z dodaniem danych!",
            secondaryInfo: "Klient o podanym mailu już istnieje."
          });
        }
        return res.status(406).json({
          error: true,
          mainInfo: "Błąd bazy danych.",
          secondaryInfo: " Spróbuj ponownie później."
        });
        
      }
      else return res.status(200).json({error: false, mainInfo:'Sukces.', secondaryInfo: 'Pomyślnie dodano klienta', result: results})
    });

  })


  app.post('/repair/addRepair', (req,res) => {
    const d = new Date();

    const sqlQuery = "INSERT into DB_repairs (ClientId, ServiceId, DeviceId, Description) VALUES (?,?,?,?)"

    const clientid = req.body.clientId;
    const serviceid = req.body.serviceId;
    const deviceid = req.body.deviceId;
    const description = {
      "repair":[
        {"Date": d.toLocaleDateString(),"Time": d.toLocaleTimeString(), "Status": "Przyjęte", "Description": req.body.description, "ClientDecision": null}
      ]
    }

    console.log("opis zlecenia" + JSON.stringify(description));
    //console.log("cli: " + clientid + "serv: " + serviceid + "device: " + deviceid + "description: " + description);

    db.query(sqlQuery, [clientid, serviceid, deviceid, JSON.stringify(description)], (error, results)=>{
      
      if(error)
      { console.log(error)

        return res.status(404).json({
          error: true,
          mainInfo: "Błąd bazy danych.",
          secondaryInfo: "Spróbuj ponownie później."
        });
        
      }
      else return res.status(200).json({message:"Pomyślnie dodano zlecenie.", result: results})
    });

  })

  app.post('/repair/addQRcode', (req,res) => {

    const sqlQuery = "UPDATE DB_repairs SET QrCode = (?) WHERE Id like (?);"
    const qr = req.body.qrcode;
    const id = req.body.id;

    //console.log(qr + "id" + id)

    db.query(sqlQuery, [qr, id], (error, results)=>{
      
      if(error)
      { console.log(error)

        return res.status(404).json({
          error: true,
          mainInfo: "Błąd bazy danych.",
          secondaryInfo: "Spróbuj ponownie później."
        });
        
      }
      else return res.status(200).json({message:'Pomyślnie dodano kod QR.', result: results})
    });

  })

  app.post('/repair/addDevice', (req,res) => {

    const sqlQuery = "INSERT into DB_devices (ClientId, Name, Model, SN, Type) VALUES (?,?,?,?,?)"

    const clientid = req.body.DeviceData.ClientId;
    const name = req.body.DeviceData.Name;
    const model = req.body.DeviceData.Model;
    const sn = req.body.DeviceData.Sn;
    const type = req.body.DeviceData.Type;

    db.query(sqlQuery, [clientid, name, model, sn, type], (error, results)=>{
      
      if(error)
      { console.log(error)

        return res.status(404).json({
          error: true,
          mainInfo: "Błąd połączenia z bazą",
          secondaryInfo: "Spróbuj ponownie później."
        });
        
      }
      else return res.status(200).json({mainInfo:'Pomyślnie dodano urządzenie.', result: results})
    });
  })

  app.get('/employee/coord/ToReceive', (req,res) => {
    
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
    WHERE `DB_repairs`.`IfReceived` = FALSE AND Closed = 1";
    

    db.query(sqlQuery, (err, result) => {
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


  app.post('/employee/coord/ConfirmReceive', (req,res) => {

    const id = req.body.RepairId;

    const sqlQuery = "UPDATE DB_repairs SET IfReceived = 1, ReceivDate = CURRENT_TIMESTAMP() WHERE Id = (?)"

    db.query(sqlQuery, [id], (err, result) => {
      if (err) {
        console.log(err)
        return res.status(406).json({
          error: true,
          mainInfo: "Problem bazy napraw.",
          secondaryInfo: ""
        }) 
      } else {
        //console.log(result)
        return res.status(200).json({ 
          error: false,
          mainInfo: "Zmieniono status naprawy.",
          secondaryInfo: ""
        }); 
      }
    })

  })
}