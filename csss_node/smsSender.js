
var smsapi = require('smsapi');
const {SMSAPI} = smsapi;
const smsapi1 = new SMSAPI('biddTjxCIdUvyF2MvyK9Bj72ctgkHbNBGpW7AZvB');

function sendSMS(text){
  console.log(text)
  let {to, message} = text

  smsapi1.sms.sendSms(to= to, message= message, from = 'CSSS');
}

module.exports = {
  sendSMS
}
