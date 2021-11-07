module.exports = (app, db, employeeUtils) => {
  
  app.get('/employee/admin/getUsersTable', (req, res) => {

    const sqlQuery = "SELECT * FROM DB_employees";

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

  app.post('/employee/admin/changeUserInfo', (req, res) => {
    const id = req.body.Id;
    const name = req.body.Name;
    const surname = req.body.Surname;
    const login = req.body.Login;
    const mail = req.body.Mail;
    const phone = req.body.Phone;

    const sqlQuery = "UPDATE DB_employees SET Name = (?), Surname = (?), Login = (?), Mail = (?), Phone = (?) WHERE Id like (?)";

    db.query(sqlQuery, [name, surname, login, mail, phone, id], (err, result) => {
      if (err) {
        return res.status(401).json({
          error: true,
          message: "Problem ze zmianą informacji o użytkowniku"
        }) 
      } else {
        return res.status(200).json({ 
          error: false,
          message: "Poprawnie zmieniono dane użytkownika"
        }); 
      }
    })
  })

  app.post('/employee/admin/changeUserPassword', (req, res) => {
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

  app.post('/employee/admin/addEmployee', (req, res) => {
    const name = req.body.Name;
    const surname = req.body.Surname;
    const login = req.body.Login;
    const pass = req.body.Pass;
    const mail = req.body.Mail;
    const phone = req.body.Phone;
    const type = req.body.Type;

//TODO - check login if exists in DB!!!

    const sqlQuery = "INSERT INTO DB_employees (Name, Surname, Login, Pass, Mail, Phone, Type) VALUES (?,?,?,?,?,?,?)";

    db.query(sqlQuery, [name, surname, login, pass, mail, phone, type], (err, result) => {
      if (err) {
        return res.status(401).json({
          error: true,
          message: "Problem z dodaniem nowego użytkownika. Sprawdź czy wszystkie dane są poprawne."
        }) 
      } else {
        return res.status(200).json({ 
          error: false,
          message: "Poprawnie dodano nowego użytkownika."
        }); 
      }
    })
  })

}