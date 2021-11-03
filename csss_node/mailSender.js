module.exports = (app) =>{

  var nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
       auth: {
            user: 'csss.notification@gmail.com',
            pass: 'Csss.m@il',
         },
    secure: true,
    });

    app.post('/sendMail', (req,res) => {

      const {to, subject, text} = req.body;
      const mailData = {from: 'csss.notification@gmail.com',  // sender address
      to: to,   // list of receivers
      subject: subject,
      text: text,
      html: '<b>Hey there! </b> <br> This is our first message sent with Nodemailer<br/>'
      };


      transporter.sendMail(mailData, function (err, info) {
        if(err)
          console.log(err)
        else
          res.status(200).json({message: "Mail send", message_id: info.messageId})
     });

    })
    

  
}