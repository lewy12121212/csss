module.exports = (db, server, app, socketIo) => {

  const io = socketIo(server,{ 
    cors: {
      //TODO Uwaga tu je localhost!
      origin: 'https://192.168.1.62:3000',
      origin: 'https://localhost:3000'
    }
  })

  var clients = {}

  io.on('connection', socket => {
    //Simple server broadcast 
    //from tutorial
    //https://www.youtube.com/watch?v=CgV8omlWq2o


    socket.on('addUser', (name) => {
      clients[name] = {
        "socket": socket.id
      }
      console.log("klient" + JSON.stringify(clients))
      //io.to(socket.id).emit('message', { name, message })
      //console.log("DODANO KLIENTA:" + socket.id + ":" + name)
    })

    socket.on('message', ({ message, from, to }) => {
      console.log("MESSAGE: " + from + " : " + to + " : " + message)
      //io.emit('message', { from, to, message })

      //io.emit('message', { message, from, to })
      if(clients.hasOwnProperty(to)){ //check if user is online
        io.to(clients[from].socket).to(clients[to].socket).emit('message', { message, from, to })
      } else {
        message = "niedostępny"
        io.to(clients[from].socket).emit('message', { message, from, to })
      }

      //ADD DATA TO DB
      
      //axios add message to DB.
    })

    socket.on('disconnect', () => {
      //io.emit('message', { name, message })
      //clients.pop(socket.id)
      for(var name in clients) {
        if(clients[name].socket === socket.id) {
          delete clients[name];
          //break;
        }
      }
      console.log("dis - klient" + JSON.stringify(clients))
    })
  })

  app.get('/chat/getEmployeeList', (req, res) => {

    const sqlQuery = "SELECT Login FROM DB_employees";

    db.query(sqlQuery, (err, result) => {
      if (err) {
        return res.status(401).json({
          error: true,
          mainInfo: "Problem z pobraniem listy kontaków",
          secondaryInfo: "Spróbuj ponownie później"
        }) 
      } else {
        return res.status(200).json({ 
          error: false,
          result: result
        }); 
      }
    })
  })

  app.get('/chat/getChatHistory', (req, res) => {

    const sqlQuery = "SELECT * FROM DB_chat WHERE PrimaryUser like (?) OR PrimaryUser like (?) OR SecondaryUser like (?) OR SecondaryUser like (?)";
    
    db.query(sqlQuery, (err, result) => {
      if (err) {
        return res.status(401).json({
          error: true,
          mainInfo: "Problem z pobraniem listy kontaków",
          secondaryInfo: "Spróbuj ponownie później"
        }) 
      } else {
        return res.status(200).json({ 
          error: false,
          result: result
        }); 
      }
    })
  })

}