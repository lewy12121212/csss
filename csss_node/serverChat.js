
module.exports = (db, server, socketIo) => {

  const io = socketIo(server,{ 
    cors: {
      //TODO Uwaga tu je localhost!
      origin: 'https://localhost:3000'
    }
  })
  let interval;
  
  io.on("connection", (socket) => {
    console.log("New client connected");
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      clearInterval(interval);
    });
  });
  
  const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
  };
  //serwer for chat END
}
