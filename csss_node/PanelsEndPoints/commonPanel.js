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
          secondaryInfo: "Sprawdź poprawność wprowadzonych danych."
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

}