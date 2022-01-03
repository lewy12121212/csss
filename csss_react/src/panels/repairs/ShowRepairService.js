import React, { useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import { useDidMount } from '../employee_panels/common/commonFunc';
import { dbAddress } from '../../dbCon';
import ReactToPrint from 'react-to-print';
import InfoAlert from '../../alerts/InfoAlert'
import WarningAlertSubmit from '../../alerts/WarningAlertSubmit'
import DangerAlert from '../../alerts/DangerAlert'

import StatusBox from './StatusBox'

import './repair.scss'

function ShowRepairService(props) {
  const didMount = useDidMount();
  const [repairInfo, setRepairInfo] = useState("");
  const [jsonDescription, setJsonDescription] = useState([]);
  let componentRef = "";

  const [newRepairStatus, setNewRepairStatus] = useState("");
  const [description, setDescription] = useState("")

  const [repairDescription, setRepairDescription] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");

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
      setDescription("")
      setRepairInfo(response.data.data[0])
      setRepairDescription(JSON.parse(response.data.data[0].Description).repair[0].Description)
      setCurrentStatus(JSON.parse(response.data.data[0].Description).repair.at(-1).Status)
      console.log(response.data.data[0])
/*=======
      setRepairInfo(response.data.data[0])
      console.log(response.data.data)
      console.log(JSON.parse(response.data.data[0].Description))
>>>>>>> Encrypt*/
      setJsonDescription(JSON.parse(response.data.data[0].Description).repair.reverse())
    }).catch((error) => {
      //setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      //setShowDangerAlert(true)
    });
  }, [setRepairInfo, setJsonDescription, props])

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
  }, [props, didMount, setRepairInfo, repairInfo, setJsonDescription, selectRepair])

  const handleChangePrivateDescription = () => {
    axios.post(`https://${dbAddress}:4000/repair/changePrivateDescription`, {description: repairInfo.PrivateDescription, id: repairInfo.Id}).then(response => {
      setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
      setShowInfoAlert(true)
    }).catch((error) => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }

  const handleAddRepairAction = () => {
    console.log("new status add action" + newRepairStatus)
    axios.post(`https://${dbAddress}:4000/repair/addRepairAction`, {id: repairInfo.Id, status: newRepairStatus, description: description, clientMail: repairInfo.ClientMail, number: repairInfo.ClientPhone}).then(response => {
/*=======
    axios.post(`https://${dbAddress}:4000/repair/addRepairAction`, {id: repairInfo.Id, status: newRepairStatus, description: description}).then(response => {
>>>>>>> Encrypt*/
      setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
      setShowInfoAlert(true)
      selectRepair()
    }).catch((error) => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }

  
  if(currentStatus !== "Zamknięte")
  {
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
          <div className="col-12 col-md-2 mt-2 mb-2">
            <img src={repairInfo.QrCode} width="100" height="100" alt="smutno" ref={(response) => (componentRef = response)}/><br />
            <ReactToPrint
              content={() => componentRef}
              trigger={() => <button className="btn btn-success mt-2">Drukuj QrCode</button>}
            />
          </div>
          <div className="col-6 col-md-5 mt-2 mb-2 ">
            <h5>Dane Klienta:</h5>
            <p>Nazwa: <i>{repairInfo.ClientName}</i></p>
            <p>Mail: <i>{repairInfo.ClientMail}</i></p>
            <p>Telefon: <i>{repairInfo.ClientPhone}</i></p>
          </div>
          <div className="col-6 col-md-5 mt-2 mb-2">
            <h5>Dane Urządzenia:</h5>
            <p>Nazwa: <i>{repairInfo.DeviceName}</i></p>
            <p>Model: <i>{repairInfo.DeviceModel}</i></p>
            <p>Numer seryjny: <i>{repairInfo.DeviceSN}</i></p>
          </div>
        </div>
        {!repairInfo.Close &&
        <div className="row text-center">
          <div className="container col-12 mt-2 text-center center-block">
            <hr />
            <h5>Opis naprawy</h5>
            <p>{repairDescription}</p>
          </div>
        </div>}
        {!repairInfo.Close &&
        <div className="row text-center">
          <div className="col-12 mt-2">
            <hr />
            <h5>Opis wewnętrzny</h5>
            <textarea className="col-10 repairTextarea" defaultValue={repairInfo.PrivateDescription} onChange={(e) => {
              //ALT METHOD
              //setPrivateDescription(e.target.value);
              //console.log(privateDescription)
              repairInfo.PrivateDescription = e.target.value;
              console.log(repairInfo.PrivateDescription)
            }}></textarea><br />
            <button className="btn btn-success" onClick={handleChangePrivateDescription}>Zaktualizuj opis</button>
          </div>
        </div>}
  
        {currentStatus !== "Oczekujące na decyzje" &&
        <div className="row text-center">
          <div className="container col-12 mt-2 text-center center-block">
            <hr />
            <h5>Dodaj czynność</h5>
            Opis:<br />
            <textarea className="col-10 repairTextarea" id="Desc" name="Desc" onChange={(e) => {
              setDescription(e.target.value);
              console.log(description)
            }}></textarea><br />
            <div className="col-10 col-md-8 col-lg-6 selectBox mx-auto">
              Status:
              <select className="form-select" id="Status" name="Status" onChange={(e) => {
                setNewRepairStatus(e.target.value)
                console.log("new status" + newRepairStatus)
              }}>
                <option value="" key="empty" default hidden>Wybierz status</option>
                <option value="Naprawiane" key="Naprawiane">Naprawiane</option>
                <option value="Oczekujące" key="Oczekujące">Oczekujące</option>
                <option value="Oczekujące na decyzje" key="Oczekujące_na_decyzje">Oczekujące na decyzje</option>
                <option value="Zamknięte" key="Zamknięte">Zamknięte</option>
              </select>
            </div>
            <button className="btn btn-success mt-2" onClick={handleAddRepairAction}>Dodaj czynność</button>
          </div>
        </div>}
  
  
        <div className="row text-center">
          <div className="col-12 mt-2">
            <hr />
            <h5>Historia czynności zlecenia</h5>
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
  else{
    return(
    <div className="mainRepairBox container col-11 col-md-10 mt-4 mb-4">
      <div className="row text-center">
        <h2>Zlecenie zostało zamknięte</h2>
      </div>
    </div>

    )}
}

export default ShowRepairService;