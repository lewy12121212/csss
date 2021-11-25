const commonFunc = require('./commonFunc')

module.exports = (app, db) => {

  app.post('/repair/dataValidate', (req, res) => {
    const name = req.body.firstname;
    const surname = req.body.surname;
    const password = req.body.password;
    const mail = req.body.mail;
    const phone = req.body.phone;

        //console.log(id + name + surname + mail + login + phone)
    if(name === "" || surname === "" || password === "" || mail === "" || phone === ""){
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

  app.get('/repair/getListOfClients', (req,res) => {
    const sqlQuery = "SELECT Name, Mail, Phone, IsCompany FROM DB_clients";

    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.log(err)
        return res.status(406).json({
          error: true,
          message: "Problem z pobraniem bazy klientów"
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

    let name = req.body.name;
    const firstName = req.body.firstname;
    const surname = req.body.surname;
    const address = req.body.address;
    const city = req.body.city;
    const postalcode = req.body.postalcode;
    const mail = req.body.mail;
    const password = req.body.password;
    const phone = req.body.phone;
    const company = req.body.company
    if (name === "") name = firstName + ' ' + surname;
    console.log(typeof(company))
    db.query(sqlQuery, [name, firstName, surname, address, city, postalcode, mail, password, phone, company], (error, results)=>{
      
      if(error)
      { console.log(error)
        if(console.error.errno === 1036)
        {
          return res.status(400).json({
            error: true,
            message: "Klient o podanym mailu już istnieje."
          });
        }
        return res.status(406).json({
          error: true,
          message: "Błąd bazy danych. Spróbuj ponownie później."
        });
        
      }
      else return res.status(200).json({message:'Pomyślnie dodano klienta'})
    });

  })


  app.post('/repair/addRepair', (req,res) => {

    const sqlQuery = "INSERT into DB_repairs (ClientId, ServiceId, DeviceId, QrCode, Descrption) VALUES (?,?,?,?,?)"

    const clientid = req.body.clientid;
    const serviceid = req.body.serviceid;
    const deviceid = req.body.deviceid;
    const qrcode = req.body.qrcode;
    const description = req.body.description;

    db.query(sqlQuery, [clientid, serviceid, deviceid, qrcode, description], (error, results)=>{
      
      if(error)
      { console.log(error)

        return res.status(401).json({
          error: true,
          message: "Błąd bazy danych. Spróbuj ponownie później."
        });
        
      }
      else return res.status(200).json({message:'Pomyślnie dodano zlecenie.'})
    });

  })

  app.post('/repair/addDevice', (req,res) => {

    const sqlQuery = "INSERT into DB_devices (ClientId, Name, Model, SN, Type) VALUES (?,?,?,?,?)"

    const clientid = req.body.clientid;
    const name = req.body.name;
    const model = req.body.model;
    const sn = req.body.sn;
    const type = req.body.type;

    db.query(sqlQuery, [clientid, name, model, sn, type], (error, results)=>{
      
      if(error)
      { console.log(error)

        return res.status(401).json({
          error: true,
          message: "Błąd bazy danych. Spróbuj ponownie później."
        });
        
      }
      else return res.status(200).json({message:'Pomyślnie dodano klienta'})
    });
  })
}