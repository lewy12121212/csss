module.exports = (db, server, app, socketIo) => {
  
  const io = socketIo(server,{ 
    cors: {
      //TODO Uwaga tu je localhost!
      origin: 'https://192.168.1.62:3000',
      origin: 'https://localhost:3000'
    }
  })

  var clients = {}
  var chatHistory = {}

  io.on('connection', socket => {
    
    socket.on('addUser', (name) => {
      clients[name] = {
        "socket": socket.id
      }
      console.log("klient" + JSON.stringify(clients))
    })

    //TIME !!!
    socket.on('getHistory', (from, to, callback) => {
      var chatIndexFrom = from.toString() + to.toString()
      var chatIndexTo = to.toString() + from.toString()

      callback({
        chatFromTo: chatHistory[chatIndexFrom],
        chatToFrom: chatHistory[chatIndexTo]
      })
    })

    socket.on('message', ({ message, from, to }) => {
      console.log("MESSAGE: " + from + " : " + to + " : " + message)

      const date = new Date();
      const time = date.getTime()

      var chatIndex = from.toString() + to.toString()
      //jeśli nie ma w historii, zainicjuj tablice
      if(!chatHistory.hasOwnProperty(chatIndex)) {
        chatHistory[chatIndex] = []
      }

      //dodaj to tablicy wysłaną wiadomość
      chatHistory[chatIndex].push({
        "message": message,
        "time": time,
        "from": from,
        "to": to
      })
      
      if(clients.hasOwnProperty(to) && clients.hasOwnProperty(from)){
        io.to(clients[from].socket).to(clients[to].socket).emit('message', { message, time, from, to })
      } else if(clients.hasOwnProperty(from)) {
        io.to(clients[from].socket).emit('message', { message, time, from, to })
      }
    })

    socket.on('disconnect', () => {
      for(var name in clients) {
        if(clients[name].socket === socket.id) {
          delete clients[name];
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
}


/*
module.exports = (db, server, app, socketIo) => {

  function getUsersForInitConversation(){
    const sqlQuery = "SELECT Login FROM DB_employees";
    return db.query(sqlQuery, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        //console.log("init conf" + JSON.stringify(result))
        return result
      }
    })
    //console.log(a._results)
    //return "aaa"
  }

  const initList = (UsersList) => {
    let table = []
    UsersList._results[0].map((data) => {
      table.push(data.Login)
      //console.log(data.Login)
    })
    return table
  }

  async function userTable(){
    const getUsersList = await getUsersForInitConversation()
    let info = await initList(getUsersList)
    return info
  }

  const io = socketIo(server,{ 
    cors: {
      //TODO Uwaga tu je localhost!
      origin: 'https://192.168.1.62:3000',
      origin: 'https://localhost:3000'
    }
  })

  var clients = {}
  var chatHistory = {}
  const getUsersList = userTable()
  //const initConfList = initList(getUsersList)


  io.on('connection', socket => {
    //Simple server broadcast 
    //from tutorial
    //https://www.youtube.com/watch?v=CgV8omlWq2o
    //const conf = getUsersForInitConversation()
    
    console.log(getUsersList)

    socket.on('addUser', (name) => {
      clients[name] = {
        "socket": socket.id
      }
      console.log("klient" + JSON.stringify(clients))
      //io.to(socket.id).emit('message', { name, message })
      //console.log("DODANO KLIENTA:" + socket.id + ":" + name)
    })

    socket.on('getHistory', (from, to, callback) => {
      var chatIndexFrom = from.toString() + to.toString()
      var chatIndexTo = to.toString() + from.toString()
      
      //if(!chatHistory.has(chatIndex)){
      //  chatHistory[chatIndex] = []
      //}

      //var singleChat = chatHistory[chatIndex]
      //io.to(clients[from].socket).emit('getHistory', { singleChat })
      callback({
        chatFromTo: chatHistory[chatIndexFrom],
        chatToFrom: chatHistory[chatIndexTo]
      })
      //io.to(socket.id).emit('message', { name, message })
      //console.log("DODANO KLIENTA:" + socket.id + ":" + name)
    })

    socket.on('message', ({ message, from, to }) => {
      console.log("MESSAGE: " + from + " : " + to + " : " + message)

      var chatIndex = from.toString() + to.toString()

      //jeśli nie ma w historii, zainicjuj tablice
      if(!chatHistory.hasOwnProperty(chatIndex)) {
        chatHistory[chatIndex] = []
      }

      //dodaj to tablicy wysłaną wiadomość
      chatHistory[chatIndex].push({
        "message": message,
        "from": from,
        "to": to
      })

      console.log("chatHistory" + JSON.stringify(chatHistory))
      //io.emit('message', { from, to, message })

      //io.emit('message', { message, from, to })

      //jeśli oboje klientów jest dostępnych - wyślij do obu
      if(clients.hasOwnProperty(to) && clients.hasOwnProperty(from)){ //check if user is online
        io.to(clients[from].socket).to(clients[to].socket).emit('message', { message, from, to })
      //jeśli drugi klient nie jest obecny - wyemituj tylko do nadawcy
      } else if(clients.hasOwnProperty(from)) {
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

}*/
