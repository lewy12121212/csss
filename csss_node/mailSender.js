module.exports = (app) =>{

  var nodemailer = require('nodemailer');
  var hbs = require('nodemailer-express-handlebars');
  var options = {
    viewEngine : {
      extname: '.hbs', // handlebars extension
      layoutsDir: 'mail_templates', // location of handlebars templates
      partialsDir: 'mail_templates', // location of your subtemplates aka. header, footer etc
    },
    viewPath: 'mail_templates',
    extName: '.hbs'
  };

  const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
      user: 'csss.notification@gmail.com',
      pass: 'Csss.m@il',
    },
    secure: true,
  });

  transporter.use('compile', hbs(options));
    
  app.post('/sendMail', (req,res) => {
    console.log("hej")
    const to = req.body.Mail;
    const template = req.body.Template;
    console.log(to)
    const mailData = {
      from: 'csss.notification@gmail.com',  // sender address
      to: to,   // list of receivers
      subject: "Status naprawy Twojego urządzenia uległ zmianie.",
      template: template,
      context: {
        id: req.body.Id,
        status: req.body.Status
      }
    };
    
    transporter.sendMail(mailData, function (err, info) {
      if(err)
        console.log(err)
      else
        res.status(200).json({message: "Mail send", message_id: info.messageId})
    });
  })

}