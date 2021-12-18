module.exports = (app, db) => {

  app.get('/client/getRepairsList', (req,res) => {

    const id = req.body.clientId;

    const sqlQuery = "SELECT \
    `DB_repairs`.`Id`,\
    `DB_repairs`.`ServiceId`,\
    `DB_repairs`.`DeviceId`,\
    `DB_repairs`.`CreationDate` ,\
    `DB_repairs`.`Description`,\
    `DB_devices`.`Name` AS DeviceName, \
    `DB_devices`.`Model` AS DeviceModel, \
    `DB_devices`.`SN` AS DeviceSN, \
    `DB_devices`.`Type` AS DeviceType, \
    `DB_employees`.`Id` AS EmployeeId, \
    `DB_employees`.`Name` AS EmployeeName, \
    `DB_employees`.`Surname` AS EmployeeSurname, \
    `DB_employees`.`Login` AS EmployeeLogin \
    FROM `DB_repairs` \
    LEFT OUTER JOIN `DB_devices` ON `DB_repairs`.`DeviceId` like `DB_devices`.`Id` \
    LEFT JOIN `DB_employees` ON `DB_repairs`.`ServiceId` like `DB_employees`.`Id`\
    WHERE `DB_repairs`.`ClientId`=(?) AND `DB_repairs`.`IfReceived` = FALSE AND `DB_repairs`.`Closed` = 0 \
    ORDER BY `DB_repairs`.`CreationDate` ASC;";

    db.query(sqlQuery,  [id], (err, result) => {
      if (err) {
        console.log(err)
        return res.status(406).json({
          error: true,
          message: "Problem z pobraniem bazy napraw."
        }) 
      } else {
        return res.status(200).json({ 
          error: false,
          data: result
        }); 
      }
    })
  })


}