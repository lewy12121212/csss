//import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"
import { getUser } from '../../../utils/Common'
import { useDidMount } from '../common/commonFunc'
import { dbAddress } from '../../../dbCon';
import { animateScroll } from "react-scroll";

import axios from 'axios';
import io from "socket.io-client"

import './chat.scss'
//import "./App.css"

function Chat() {
  const user = getUser();
	const didMount = useDidMount();
	const [ state, setState ] = useState({ message: "", from: user.Login , to: ""})
	const [ chat, setChat ] = useState([])
	const [ employeeList, setEmployeeList ] = useState([])

	const socketRef = useRef()

	const scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: "chatBox"
    });

		animateScroll.scrollMore(2000, {
      containerId: "chatBox"
    });
	}
	
	useEffect(() => {
		//TODO set default conversation
		if(didMount) {
			axios.get(`https://${dbAddress}:4000/chat/getEmployeeList`).then(response => {
				setEmployeeList(response.data.result)
				console.log(response.data.result)
			}).catch(error => {
				//TODO set alert message
				//setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
				//setShowDangerAlert(true)
			});
		}

		socketRef.current = io.connect(`https://${dbAddress}:4000`)
		socketRef.current.emit("addUser", state.from)
		socketRef.current.on("message", ({ message, from ,to }) => {
			setChat([ ...chat, { message, from, to } ])
		})
		return () => socketRef.current.disconnect()
		
	}, [ chat, setEmployeeList, didMount, state ])

	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		scrollToBottom()
		const { message, from, to } = state
		console.log("message " + message)
		if(message !== ""){
			socketRef.current.emit("message", { message, from, to })
			e.preventDefault()
			setState({ message: "", from, to })
		}

	}

	const choosePearson = (e) => {
		console.log("pearson choose is: " + e.target.value)
		setState({ ...state, "to": e.target.value })
		//TODO get history of message
	}

	const renderChat = () => {
    //TODO change style
		//messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
		scrollToBottom()
    return chat.map(({ message, from, to }, index) => {
      if(from === user.Login){
        return <div className="col-12 row d-flex justify-content-end m-0 p-0" key={index}>
					<div className="col-12 d-flex justify-content-end"><small className="text-muted">{from}</small></div>
          <div className="chat-message-box col-8 m-1 p-1 text-white rounded bg-primary d-flex justify-content-end text-break">{message}</div>
				</div>
      } else {
        return <div className="col-12 row ml-2 d-flex justify-content-start m-0 p-0" key={index}>
					<div className="col-12 d-flex justify-content-start"><small className="text-muted">{from}</small></div>
          <div className="chat-message-box col-8 m-1 p-1 text-white rounded bg-success d-flex justify-content-start text-break">{message}</div>
				</div>
      }
    })
		//return chat.map(({ name, message }, index) => (
	}

	return (
		<div className="d-flex flex-wrap col-12 vh-100 margin-fix">
			{/*Kontakty*/}
			<div className="col-2 bg-white d-flex justify-content-start p-3 contacts">
				
				<div className="col-12">
					Uzytkownik: {user.Login} <br />
					Wybrany: {state.to} <br />
					Grupy:
					<button className="btn btn-primary col-12" key="all" value="all" onClick={choosePearson}>Wszyscy</button>
					Użytkownicy:
					{employeeList.map((data) => {
						if(data.Login !== user.Login){
							return <button className="btn btn-primary mt-1 col-12" value={data.Login} onClick={choosePearson} key={data.Login}>{data.Login}</button>
						} else {
							return null
						}
					})}
				</div>
			</div>

			{/*Chat*/}
			<div className="render-chat col-10">

				<div className="chat-box col-12 h-100" id="chatBox">
					{renderChat()}
				</div>
				<div className="d-flex fixed-bottom flex-wrap col-12">
					<div className="col-2"></div>
					<div className="col-10 bg-white chat">
						<div className="form-group col-12 p-2">
							<div className="input-group">
								<input type="text"
									name="message"
									onChange={(e) => onTextChange(e)}
									value={state.message}
									id="outlined-multiline-static"
									variant="outlined"
									label="Message"
									className="form-control" 
									placeholder="Napisz wiadomość"
								/>
								<button className="btn btn-success" onClick={onMessageSubmit}>Wyślij</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Chat;