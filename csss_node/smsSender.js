module.exports = (app) => {

  var smsapi = require('smsapi');
  const {SMSAPI} = smsapi;
  const smsapi1 = new SMSAPI('biddTjxCIdUvyF2MvyK9Bj72ctgkHbNBGpW7AZvB');

  app.post('/sendSMS', (req,res) => {
    console.log("hello")
    
    smsapi1.sms.sendSms('+48664273466', 'My second message from CSSS!');

    res.status(200).json({message: "ok"});
  })

}