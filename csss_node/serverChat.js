
module.exports = (db, server, socketIo) => {

  const io = socketIo(server,{ 
    cors: {
      //TODO Uwaga tu je localhost!
      origin: 'https://localhost:3000'
    }
  })

  io.on('connection', socket => {
    //Simple server broadcast 
    //from tutorial
    //https://www.youtube.com/watch?v=CgV8omlWq2o
    socket.on('message', ({ name, message }) => {
      io.emit('message', { name, message })
    })
  })
  
  /*io.on("connection", (socket) => {
    //console.log("New client connected");
    if (interval) {
      clearInterval(interval);
    }

    getApiAndEmit(socket)
    //interval = setInterval(() => getApiAndEmit(socket), 500);
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      clearInterval(interval);
    });
  });*/

  //const getApiAndEmit = socket => {
  //  const response = new Date();
  //  // Emitting a new message. Will be consumed by the client
  //  socket.emit("FromAPI", response);
  //};
  //serwer for chat END
}
