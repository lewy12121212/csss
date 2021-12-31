const commonFunc = require('./commonFunc')
const mail = require('../mailSender');
//import {sendMail} from '../mailSender'
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

  app.post('/repair/addRepairAction', (req,res) => {
    const d = new Date();
    const id = req.body.id;
    const status = req.body.status;
    const description = req.body.description;
    const descriptionToAdd = {"Date": d.toLocaleDateString(),"Time": d.toLocaleTimeString(), "Status": status, "Description": description, "ClientDecision": null}
    const clientMail = req.body.clientMail

    const sqlQuerySelect = "SELECT Description FROM DB_repairs WHERE Id like (?)"
    const sqlQueryUpdate = "UPDATE DB_repairs SET Description = (?) WHERE Id like (?)"
    const sqlQueryUpdateAndClose = "UPDATE DB_repairs SET Description = (?), Closed = 1 WHERE Id like (?)"

    let sqlQuery = "";

    if(status === "" || description === ""){
      return res.status(406).json({
        error: true,
        mainInfo: "Dane nie mogą być puste.",
        secondaryInfo: "Uzupełni dane oby dodać nowy status zlecenia."
      }) 
    }

    if (status === "Zamknięte"){
      sqlQuery = sqlQueryUpdateAndClose;
    }
    else{
      sqlQuery = sqlQueryUpdate;
    }

    db.query(sqlQuerySelect, [id], (err, result) => {
      
      if (err || result.length === 0 || result.length > 1) {
        console.log(err)
        return res.status(406).json({
          error: true,
          mainInfo: "Problem z edycją opisu.",
          secondaryInfo: "Spróbuj ponownie później."
        }) 
      } else {
        let jsonparse = JSON.parse(result[0].Description)
        //console.log(result.length + "result" + JSON.stringify(jsonparse.repair[0]))
        jsonparse.repair.push(descriptionToAdd)
        //console.log(result.length + "result" + JSON.stringify(jsonparse) + "ID:" + id)

        db.query(sqlQuery, [JSON.stringify(jsonparse), id], (err, result) => {
          if (err) {
            console.log(err)
            return res.status(406).json({
              error: true,
              mainInfo: "Problem z UPDATE.",
              secondaryInfo: "Spróbuj ponownie później."
            }) 
          } else {
            console.log("cooo", status)
            if(status === "Zamknięte")
            { 
              
              const number = req.body.number;

              console.log("wysyłka sms", number)
              let text = {to: number, message: "Zlecenie "+ id + " zostało naprawione. Prosimy o odbiór urządzenia.", from: "CSSS"}
              let sender = require('../smsSender')
        
              //sms sender
              //sender.sendSMS(text)
              //sms sender end
            }
            mail.sendMail(clientMail, "status", id, description, status)
            return res.status(200).json({ 
              error: false,
              mainInfo: "Pomyślnie dodano czynność serwisową",
              secondaryInfo: ""
            }); 
          }
        })
      }
    })
  })
}