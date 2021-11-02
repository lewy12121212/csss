module.exports = (app, db, employeeUtils) => {
  
  app.get('/employee/panels/getUsersTable', (req, res) => {

    const sqlQuery = "SELECT * FROM DB_employees";

    db.query(sqlQuery, (err, result) => {
      if (err) {
        return res.status(401).json({
          error: true,
          message: "Invalid database or table connection."
        }) 
      } else {
        //result.map((Id, Name, Surname, Login, Type) => {
        //  console.log(Id + ": " + Name + " " + Surname + " " + Login + " " + Type);
        //})
        return res.status(200).json({ 
          error: false,
          data: result
        }); 
      }
    })
  })
  
}