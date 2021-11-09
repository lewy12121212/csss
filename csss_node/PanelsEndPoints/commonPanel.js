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
    const id = req.body.Id;
    const newPassword = req.body.newPassword;
    const newRePassword = req.body.newRePassword;

    if(newPassword === "" || newRePassword === ""){
      return res.status(401).json({
        error: true,
        message: "Hasło nie może być puste!"
      }) 
    } else if(newPassword !== newRePassword){
      return res.status(401).json({
        error: true,
        message: "Hasła nie są takie same!"
      }) 
    } else {
      const password = newPassword;
      const sqlQuery = "UPDATE DB_employees SET Pass = (?) WHERE Id like (?)";

      db.query(sqlQuery, [password, id], (err, result) => {
        if (err) {
          return res.status(401).json({
            error: true,
            message: "Błąd zmiany hasła użytkownika."
          }) 
        } else {
          return res.status(200).json({ 
            error: false,
            message: "Poprawnie zmieniono hasło użytkownika."
          }); 
        }
      })
    }
  })

}