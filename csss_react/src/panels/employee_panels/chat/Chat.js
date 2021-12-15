//import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"
import { getUser } from '../../../utils/Common';
import io from "socket.io-client"
//import "./App.css"

function Chat() {
  const user = getUser();
	const [ state, setState ] = useState({ message: "", name: user.Login })
	const [ chat, setChat ] = useState([])

	const socketRef = useRef()

  //TODO change struct of useEffect
	useEffect(
		() => {
			socketRef.current = io.connect("https://localhost:4000")
			socketRef.current.on("message", ({ name, message }) => {
				setChat([ ...chat, { name, message } ])
			})
			return () => socketRef.current.disconnect()
		},
		[ chat ]
	)

	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		const { name, message } = state
		socketRef.current.emit("message", { name, message })
		e.preventDefault()
		setState({ message: "", name })
	}

	const renderChat = () => {
    //TODO change style
    return chat.map(({ name, message }, index) => {
      if(name === user.Login){
        return <div className="col-12 d-flex justify-content-end m-0 p-0" key={index}>
          <p>
            <small>{name}</small>
            <h2>{message}</h2>
          </p>
			  </div>
      } else {
        return <div className="col-12 d-flex justify-content-start m-0 p-0" key={index}>
          <p>
            <small>{name}</small>
            <h2>{message}</h2>
          </p>
      </div>
      }
    })
    
		//return chat.map(({ name, message }, index) => (
	}

	return (
		<div className="container col-12">
			<div className="render-chat">
				<h1>Chat Log</h1>
				{renderChat()}
			</div>
      <form className="form-group" onSubmit={onMessageSubmit}>
				<h5 className="m-0 p-0">Wyślij wiadomość do wszystkich</h5>
				<div className="form-group">
					<input type="text"
            className="col-12 p-2"
						name="message"
						onChange={(e) => onTextChange(e)}
						value={state.message}
						id="outlined-multiline-static"
						variant="outlined"
						label="Message"
					/>
				</div>
				<button className="btn btn-success">Wyślij</button>
			</form>
		</div>
	)
}

export default Chat;