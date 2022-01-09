import React, {useState, useEffect} from 'react';

import './repair.scss'

function StatusBox(props) {
  const [boxStatusClass, setBoxStatusClass] = useState("green")

  useEffect(() => {
    if(props.data.Status === "Przyjęte"){
    setBoxStatusClass("green")
    } else if(props.data.Status === "Naprawiane"){
      setBoxStatusClass("blue")
    } else if(props.data.Status === "Oczekujące"){
      setBoxStatusClass("yellow")
    } else if(props.data.Status === "Oczekujące na decyzję") {
      setBoxStatusClass("red")
    } else if(props.data.Status === "Zamknięte"){
      setBoxStatusClass("green")
    } else if(props.data.Status === "Decyzja"){
      setBoxStatusClass("pink")
    }
  }, [setBoxStatusClass, props.data])

  return (
    <div className="container col-12 row status-bo m-3">
      <div className="col-2">
        <div className="status-box" style={{background: boxStatusClass}}></div>
      </div>

      <div className="col-2">Status: {props.data.Status}</div>
      {
        props.data.Status!=="Decyzja" &&
        <div className="col-5">Opis: {props.data.Description}</div>
      }
      {
        props.data.Status==="Decyzja" &&
        <div className="col-5">Decyzja: {props.data.ClientDecision ? "Zgoda":"Odmowa"}</div>
      }
      <div className="col-3">Data: {props.data.Date} : {props.data.Time}</div>
    </div>
  );
}

export default StatusBox;