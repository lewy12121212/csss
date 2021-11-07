module.exports = (app, db, employeeUtils) => {
  
  app.get('/employee/admin/getUsersTable', (req, res) => {

    const sqlQuery = "SELECT * FROM DB_employees";

    db.query(sqlQuery, (err, result) => {
      if (err) {
        return res.status(401).json({
          error: true,
          message: "Invalid database or table connection."
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
    //Name: name, Surname: surname, Login: login, Mail: mail, Phone: phone
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
          message: "Error change user info."
        }) 
      } else {
        return res.status(200).json({ 
          error: false,
          data: "Successfull change user info."
        }); 
      }
    })
  })

  app.post('/employee/admin/addEmployee', (req, res) => {
    //Name: name, Surname: surname, Login: login, Mail: mail, Phone: phone
    const name = req.body.Name;
    const surname = req.body.Surname;
    const login = req.body.Login;
    const pass = req.body.Pass;
    const mail = req.body.Mail;
    const phone = req.body.Phone;
    const type = req.body.Type;

    const sqlQuery = "INSERT INTO DB_employees (Name, Surname, Login, Pass, Mail, Phone, Type) VALUES (?,?,?,?,?,?,?)";

    db.query(sqlQuery, [name, surname, login, pass, mail, phone, type], (err, result) => {
      if (err) {
        return res.status(401).json({
          error: true,
          message: "Error add user."
        }) 
      } else {
        return res.status(200).json({ 
          error: false,
          data: "Succefull add user."
        }); 
      }
    })
  })
  
}