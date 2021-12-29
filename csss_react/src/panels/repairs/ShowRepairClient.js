import React, { useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import { useDidMount } from '../employee_panels/common/commonFunc';
import { dbAddress } from '../../dbCon';
import InfoAlert from '../../alerts/InfoAlert'
import WarningAlertSubmit from '../../alerts/WarningAlertSubmit'
import DangerAlert from '../../alerts/DangerAlert'

import StatusBox from './StatusBox'

import {getUser} from '../../utils/Common'

import './repair.scss'

function ShowRepairClient(props) {
  const didMount = useDidMount();
  const client = getUser()
  const [repairInfo, setRepairInfo] = useState("");
  const [jsonDescription, setJsonDescription] = useState([]);
  const [repairDescription, setRepairDescription] = useState("");
  const [makeDecision, setMakeDecision] = useState(false);
  const [madeDecision, setMadeDecision] = useState(false);
  const [decision, setDecision] = useState(null);
  const [verifyCode, setVerifyCode] = useState(null);
  const [code, setCode] = useState(null);

  const [showDangerAlert, setShowDangerAlert] = useState(false)
  const [showWarningAlert, setShowWarningAlert] = useState(false)
  const [showInfoAlert, setShowInfoAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState({MainInfo: "", SecondaryInfo: ""})
  //const [privateDescription, setPrivateDescription] = useState("")

  function closeAlert(){
    setShowDangerAlert(false)
    setShowWarningAlert(false)
    setShowInfoAlert(false)
    setAlertMsg({MainInfo: "", SecondaryInfo: ""})
  }

  const selectRepair = useCallback(() => {
    axios.post(`https://${dbAddress}:4000/employee/common/oneRepairInner`, {Id: props.linkId}).then(response => {
      setRepairInfo(response.data.data[0])
      console.log(response.data.data[0])
      setRepairDescription(JSON.parse(response.data.data[0].Description).repair[0].Description)
      setJsonDescription(JSON.parse(response.data.data[0].Description).repair.reverse())
      console.log(JSON.parse(response.data.data[0].Description).repair.at(-1).Status)
      if(JSON.parse(response.data.data[0].Description).repair.at(-1).Status === "Oczekujące na decyzje"){
        setMakeDecision(true)
      }
    }).catch((error) => {
      //setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      //setShowDangerAlert(true)
    });
  }, [setRepairDescription, setRepairInfo, setJsonDescription, props])

  useEffect(() => {

    if(didMount) {
      console.log('mounted');
      selectRepair()
    } else {
      console.log('state updated');
    }


    const handleInvalidToken = e => {
      if (e.key === 'token' && e.oldValue && !e.newValue) {
        props.history.push('/');
      }
    }
    window.addEventListener('storage', handleInvalidToken)
    return function cleanup() {
      window.removeEventListener('storage', handleInvalidToken)
    }
  }, [props, didMount, selectRepair])

  useEffect(()=>{
    if(madeDecision)
    {
      axios.post(`https://${dbAddress}:4000/client/getCode`, {Mail:client.Mail}).then(response => {
        setVerifyCode(true)
        setMakeDecision(false)
        setAlertMsg({MainInfo: "Aby podjąć decyzję podaj kod wysłany na Twój numer telefonu.", SecondaryInfo: ""})
        setShowInfoAlert(true)
      })
      setMadeDecision(false);
    }
    
  },[client,madeDecision])

  function handleCodeChange(e){
    setCode(e.target.value);
    console.log(code)
  }

  const handleCommitChanges = () => {
    console.log("Zmiana danych...")
    closeAlert()
    
    axios.post(`https://${dbAddress}:4000/client/makeDecision`, {Id: props.linkId, Code:code, Decision: decision, Mail: client.Mail}).then(response => {
      setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
      setShowInfoAlert(true)
      setVerifyCode(false)
    }).catch((error) => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }

  return (
    <div className="mainRepairBox container col-11 col-md-10 mt-4 mb-4">
      {showDangerAlert && <DangerAlert Content={alertMsg} CloseAlert={closeAlert}/>}
      {showWarningAlert && <WarningAlertSubmit Content={alertMsg} CloseAlert={closeAlert}/>}
      {showInfoAlert && <InfoAlert Content={alertMsg} CloseAlert={closeAlert}/>}

      <div className="flexRight container">
        <input type="button" className="btn btn-primary btn-upperMenu col-10 col-md-6 col-lg-4" onClick={props.handleLogout} value="Wyloguj" />
      </div>
      <div className="row text-center">
        <div className="col-12 mt-2">
          <h4>Zlecenie numer: {props.linkId}</h4>
          <hr />
        </div>
      </div>
      <div className="row text-center">
        <div className="col-6 col-md-5 mt-2 mb-2">
          <h5>Dane Urządzenia:</h5>
          <p>Nazwa: <i>{repairInfo.DeviceName}</i></p>
          <p>Model: <i>{repairInfo.DeviceModel}</i></p>
          <p>Numer seryjny: <i>{repairInfo.DeviceSN}</i></p>
        </div>
        <div className="col-6 col-md-5 mt-2 mb-2">
          {/*Wyrównać to do lewej, bo nie umiem :(*/}
          <h5>Opis naprawy:</h5>
          <p className="text-justify">{repairDescription}</p>
        </div>
      </div>
      <div className="row text-center">
        <div className="col-12 mt-2">
          <hr />
          <h5>Historia czynności zlecenia</h5>
          {makeDecision &&
            <div>
              <label>Czy zgadzasz się na naprawę?</label>
              <br></br>
              <button type="button" className="btn btn-success" onClick={() => {setDecision(true); setMadeDecision(true)}}>TAK</button>
              <button type="button" className="btn btn-danger" onClick={() => {setDecision(false); setMadeDecision(true)}}>NIE</button>
            </div>
          }
          
          {verifyCode &&
            <div>
              <div className="form-group">
                <label htmlFor="Code">Kod weryfikacyjny</label>
                <input type="text" className="form-control" id="Code" name="Code" onChange={handleCodeChange} />
              </div>
              <input type="button" className="btn btn-success col-12" onClick={handleCommitChanges} value="Wyślij" />
            </div>
          }
          
          {/*jsonDescription.repair[0]*/}
          {jsonDescription.map((data) => (
            <div key={`${data.Time}${data.Data}`}>
              <StatusBox data={data} />
            </div>
          ))}
          <hr />
        </div>
      </div>
      
    </div>
  );
}

export default ShowRepairClient;