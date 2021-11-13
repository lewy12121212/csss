const commonFunc = require('./commonFunc')

module.exports = (app, db, employeeUtils) => {

  app.post('/employee/common/changeInfo', (req, res) => {
    const id = req.body.UserData.Id;
    const name = req.body.UserData.Name;
    const surname = req.body.UserData.Surname;
    const login = req.body.UserData.Login;
    const mail = req.body.UserData.Mail;
    const phone = req.body.UserData.Phone;

    //console.log(id + name + surname + mail + login + phone)
    if(id === "" || name === "" || surname === "" || login === "" || mail === "" || phone === ""){
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

  app.post('/employee/common/changePassword', (req, res) => {
    const id = req.body.Id
    const newPassword = req.body.UserPass.NewPass
    const newRePassword = req.body.UserPass.NewRePass

    //console.log(newPassword + newRePassword)

    if(newPassword === "" || newRePassword === ""){
      return res.status(401).json({
        error: true,
        mainInfo: "Hasła nie mogą być puste!",
        secondaryInfo: "Uzupełni wymagane dane."
      })
    }

    if(newPassword === newRePassword) {
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

    } else {
      return res.status(401).json({
        error: true,
        mainInfo: "Nowe hasła nie są takie same.",
        secondaryInfo: "Sprawdź poprawność podanych danych."
      })
    }
  })

}