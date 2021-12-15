import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
//const ENDPOINT = ;

import './chat.scss'
import '../../../index.scss';

function Chat(props) {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient("https://localhost:4000");
    socket.on("FromAPI", data => {
      setResponse(data);
    });
  }, [setResponse, response]);

  return (
    <div className="bookmarkBox container col-12 col-md-10 col-lg-8">
      Witaj na czacie! - twoja wygoda jest dla nas najważniejsza.
      <time dateTime={response}>{response}</time>
    </div>
  );
}

export default Chat;