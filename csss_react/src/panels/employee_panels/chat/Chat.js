//import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"
import { getUser } from '../../../utils/Common'
import { useDidMount } from '../common/commonFunc'
import { dbAddress } from '../../../dbCon';

import axios from 'axios';
import io from "socket.io-client"
//import "./App.css"

function Chat() {
  const user = getUser();
	const didMount = useDidMount();
	const [ state, setState ] = useState({ message: "", name: user.Login })
	const [ chat, setChat ] = useState([])
	const [ employeeList, setEmployeeList ] = useState([])

	const socketRef = useRef()

  //TODO change struct of useEffect
	useEffect(() => {
		if(didMount) {
			axios.get(`https://${dbAddress}:4000/chat/getEmployeeList`).then(response => {
				setEmployeeList(response.data.result)
				console.log(response.data.result)
			}).catch(error => {
				//setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
				//setShowDangerAlert(true)
			});
		}

		socketRef.current = io.connect(`https://${dbAddress}:4000`)
		socketRef.current.on("message", ({ name, message }) => {
			setChat([ ...chat, { name, message } ])
		})
		return () => socketRef.current.disconnect()
		
	}, [ chat, setEmployeeList, didMount ])

	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		const { name, message } = state
		socketRef.current.emit("message", { name, message })
		e.preventDefault()
		setState({ message: "", name })
	}

	const choosePearson = (e) => {
		console.log("pearson choose is: " + e.target.value)
	}

	const renderChat = () => {
    //TODO change style
    return chat.map(({ name, message }, index) => {
      if(name === user.Login){
        return <div className="col-12 row d-flex justify-content-end m-0 p-0" key={index}>
					<div className="col-12 d-flex justify-content-end"><small className="text-muted">{name}</small></div>
          <div className="chat-message-box col-8 m-1 p-2 text-white rounded bg-primary d-flex justify-content-end text-break">{message}</div>
				</div>
      } else {
        return <div className="col-12 row ml-2 d-flex justify-content-start m-0 p-0" key={index}>
					<div className="col-12 d-flex justify-content-start"><small className="text-muted">{name}</small></div>
          <div className="chat-message-box col-8 m-1 text-white rounded bg-success d-flex justify-content-start text-break">{message}</div>
      	</div>
      }
    })
    
		//return chat.map(({ name, message }, index) => (
	}

	return (
		<div className="row">
			<div className="col-2 bg-success d-flex justify-content-start p-3">
				<div className="col-12">
					Grupy:
					<button className="btn btn-primary col-12" key="all" value="all" onClick={choosePearson}>Wszyscy</button>
					Użytkownicy:
					{employeeList.map((data) => {
						return <button className="btn btn-primary mt-1 col-12" value={data.Login} onClick={choosePearson} key={data.Login}>{data.Login}</button>
					})}
				</div>
			</div>
			<div className="render-chat col-10">
				<h1 className="mx-auto">Czat</h1>
				{renderChat()}
			</div>
      
			<form className="form-group fixed-bottom col-12 bg-dark" onSubmit={onMessageSubmit}>
				<div className="form-group">
					<input type="text"
            className="col-10 p-1"
						name="message"
						onChange={(e) => onTextChange(e)}
						value={state.message}
						id="outlined-multiline-static"
						variant="outlined"
						label="Message"
					/>
					<button className="btn btn-success col-2">Wyślij</button>
				</div>
			</form>
		</div>
	)
}

export default Chat;