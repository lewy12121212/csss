module.exports = (app) => {

  app.get('/qr', (req, res) => {
    //Add adding to database

    return res.status(200).json({
      error: false,
      message: "Status 200"
     
    });
 
  })
}
