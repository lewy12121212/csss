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