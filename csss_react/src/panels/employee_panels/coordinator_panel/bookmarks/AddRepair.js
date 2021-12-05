import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useDidMount } from '../../common/commonFunc'
import axios from 'axios';
import { dbAddress } from '../../../../dbCon';

import AddClient from './AddClient'
import AddDevice from './AddDevice'

import InfoAlert from '../../../../alerts/InfoAlert'
import DangerAlert from '../../../../alerts/DangerAlert'
//import '../AdminPanel.scss'
//import '../../../../index.scss';
//import '../../EmployeePanels.scss';
//import ShowRepairsList from "../../common/ShowRepairsList"
import './bookmarks.scss';

function AddRepair(props) {
  const didMount = useDidMount();
  //const [error, setError] = useState(null);
  const [clientsName, setClientsName] = useState([]); //Przerobione na useState
  const [deviceName, setDeviceName] = useState([]); //Przerobione na useState
  const [serviceName, setServiceName] = useState([]); //Przerobione na useState

  const [showDangerAlert, setShowDangerAlert] = useState(false)
  const [showInfoAlert, setShowInfoAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState({MainInfo: "", SecondaryInfo: ""})

  const [choosenClient, setChoosenClient] = useState("new"); //wyświetlanie formularza dodawania
  const [choosenDevice, setChoosenDevice] = useState("new");
  const [choosenService, setChoosenService] = useState("");

  const getClients = useCallback(() => {
    axios.get(`https://${dbAddress}:4000/repair/getListOfClients`).then(response => {
      setClientsName(response.data.data); //zamiast funkcji getClientsNames :D
      console.log(clientsName)
    }).catch(error => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }, [setClientsName, clientsName])

  const getDevices = (clientId) => {
    console.log('getDevices', clientId)
    axios.post(`https://${dbAddress}:4000/repair/getListOfDevice`, { id: clientId }).then(response => {
      setDeviceName(response.data.data);
      console.log(deviceName)
    }).catch(error => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }

  const getService = useCallback(() => {
    axios.get(`https://${dbAddress}:4000/repair/getService`).then(response => {
      setServiceName(response.data.data)
      console.log(serviceName)
    }).catch(error => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }, [setServiceName, serviceName])

  useEffect(() => { //useEfFect zamiast on click
    if(didMount) {
      console.log('mounted');
      getClients();
      getService();
    } else {
      console.log('state updated');
    }
  }, [setClientsName, clientsName, didMount, getClients, getService]);

  function setChoosenClientFunc(param){
    setChoosenClient(param)
  }

  function setChoosenDeviceFunc(param){
    setChoosenDevice(param)
  }

  function closeAlert(){
    setShowInfoAlert(false)
    setAlertMsg({MainInfo: "", SecondaryInfo: ""})
  }

  return (
    <div className="bookmarkBox container col-12 col-md-10 col-lg-8">
      {showDangerAlert && <DangerAlert Content={alertMsg} CloseAlert={closeAlert}/>}
      {showInfoAlert && <InfoAlert Content={alertMsg} CloseAlert={closeAlert}/>}

      Dodaj zlecenie
        {/*Wybór klienta*/}
        <div className="row col-12 mx-auto">
          <label htmlFor="Clients">Wybór klienta</label>
          <select value={choosenClient} className="form-select" id="Clients" onChange={(e) => {
            setChoosenClient(e.target.value)
            setChoosenDevice("new")
            getDevices(e.target.value)
            console.log("client:" + choosenClient)
          }}>
            <option value="new" key={0}>Dodaj nowego klienta...</option>
            {clientsName.map((data) => (
              <option value={data.Id} key={data.Id}>{data.Name}</option>
            ))}
          </select> 
        </div>
        {choosenClient === "new" && <AddClient clientData={clientsName} getClients={getClients} setChoosenClient={setChoosenClientFunc} setAlertMsg={setAlertMsg} setShowInfoAlert={setShowInfoAlert}/>}
        
        {/*Wybór urzadzenia klienta*/}
        {choosenClient !== "new" && 
          <div className="row col-12 mx-auto">
            <hr className="mt-4"/>
            <label htmlFor="Devices">Wybór urządzenia</label>
            <select value={choosenDevice} className="form-select" id="Devices" onChange={(e) => {
              setChoosenDevice(e.target.value)
              getService()
              console.log("device:" + choosenDevice)
            }}>
              <option value="new" key={0}>Dodaj nowe urządzenie...</option>
              {deviceName.map((data) => (
                <option value={data.Id} key={data.Id}>{data.Id} {data.Name} {data.Model} {data.SN}</option>
              ))}
            </select> 
            {choosenDevice === "new" && <AddDevice deviceData={choosenClient} getDevices={getDevices} setChoosenDevice={setChoosenDeviceFunc} setAlertMsg={setAlertMsg} setShowInfoAlert={setShowInfoAlert}/>}
          </div>
        }

        {/*Wybór serwisanta przypisanego do zlecenia*/}
        {choosenDevice !== "new" && 
          <div className="row col-12 mx-auto">
            <hr className="mt-4"/>
            <label htmlFor="Service">Wybór serwisanta</label>
            <select value={choosenService} id="Service" className="form-select" onChange={(e) => {
              setChoosenService(e.target.value)
              console.log("service:" + choosenService)
            }}>
              {serviceName.map((data) => (
                <option value={data.Id} key={data.Id}>{data.Id} {data.Name} {data.Surname} {data.Login}</option>
              ))}
            </select> 

            <button className="btn btn-success mt-2">Dodaj zlecenie</button>
          </div>   
        }
    </div>
  );
}

export default AddRepair;