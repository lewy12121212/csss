import React, {useState, useEffect} from 'react';

import './repair.scss'

function StatusBox(props) {
  const [boxStatusClass, setBoxStatusClass] = useState("green")

  useEffect(() => {
    console.log(props.data)
    if(props.data.Status === "Przyjęte"){
      setBoxStatusClass("green")
      } else if(props.data.Status === "Naprawiane"){
        setBoxStatusClass("blue")
      } else if(props.data.Status === "Oczekujące"){
        setBoxStatusClass("yellow")
      } else if(props.data.Status === "Oczekujące na decyzje") {
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

      <div className="col-5">Status: {props.data.Status}</div>
      <div className="col-5">
        Data: {props.data.Date} : {props.data.Time}
      </div>
    </div>
  );
}

export default StatusBox;