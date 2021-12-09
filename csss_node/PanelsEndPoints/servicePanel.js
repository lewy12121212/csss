const commonFunc = require('./commonFunc')

module.exports = (app, db) => {

  app.post('/repair/changePrivateDescription', (req,res) => {
    const desc = req.body.description;
    const id = req.body.id;
    const sqlQuery = "UPDATE DB_repairs SET PrivateDescription = (?) WHERE Id like (?);"

    //console.log("ID" + id)

    db.query(sqlQuery, [desc, id], (err, result) => {
      if (err) {
        console.log(err)
        return res.status(406).json({
          error: true,
          mainInfo: "Problem z edycją opisu.",
          secondaryInfo: "Spróbuj ponownie później."
        }) 
      } else {
        return res.status(200).json({ 
          error: false,
          mainInfo: "Opis pomyślnie zmieniono",
          secondaryInfo: ""
        }); 
      }
    })
  })
}