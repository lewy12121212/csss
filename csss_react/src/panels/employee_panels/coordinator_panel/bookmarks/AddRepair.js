import React from 'react';
import { useState, useEffect } from 'react';
import { useDidMount } from '../../common/commonFunc'
import axios from 'axios';
import { dbAddress } from '../../../../dbCon';

import AddClient from './AddClient'
import AddDevice from './AddDevice'
//import '../AdminPanel.scss'
//import '../../../../index.scss';
//import '../../EmployeePanels.scss';
//import ShowRepairsList from "../../common/ShowRepairsList"
import './bookmarks.scss';

function AddRepair(props) {
  const didMount = useDidMount();
  const [error, setError] = useState(null);
  const [clientsName, setClientsName] = useState([]); //Przerobione na useState
  const [deviceName, setDeviceName] = useState([]); //Przerobione na useState
  const [serviceName, setServiceName] = useState([]); //Przerobione na useState

  const [choosenClient, setChoosenClient] = useState("new"); //wyświetlanie formularza dodawania
  const [choosenDevice, setChoosenDevice] = useState("new");
  const [choosenService, setChoosenService] = useState("");

  useEffect(() => { //useEfFect zamiast on click
    if(didMount) {
      console.log('mounted');
      axios.get(`https://${dbAddress}:4000/repair/getListOfClients`).then(response => {
        //console.log(response.data)
        setClientsName(response.data.data); //zamiast funkcji getClientsNames :D
        //getClientsNames(response.data.data)
        console.log(clientsName)
        //addSelectOptions("Clients",getClientsNames(response.data.data))
      }).catch(error => {
        if (error.response.status === 401) setError(error.response.data.message);
        else setError("Coś poszło nie tak...");
      });


    } else {
      console.log('state updated');
    }
  }, [setClientsName, clientsName, didMount]);

  const getDevices = (clientId) => {
    console.log('getDevices', clientId)
    axios.post(`https://${dbAddress}:4000/repair/getListOfDevice`, { id: clientId }).then(response => {
      //console.log(response.data)
      console.log('getDevices v2', clientId)
      setDeviceName(response.data.data); //zamiast funkcji getClientsNames :D
      //getClientsNames(response.data.data)
      console.log(response.data.data)
      //addSelectOptions("Clients",getClientsNames(response.data.data))
    }).catch(error => {
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Coś poszło nie tak...");
    });
  }

  /*
  axios.get(`https://${dbAddress}:4000/repair/getEmployees`).then(response => {
    
    setServiceName(response.data.data);
    
    console.log(serviceName)

  }).catch(error => {
    if (error.response.status === 401) setError(error.response.data.message);
    else setError("Coś poszło nie tak...");
  });
  */

//Dodać na dole
/*
  <label htmlFor="Servisants">Wybór serwisanta</label>
          <select id="Servisants" onChange={(e) => {
            setChoosenService(e.target.value)
            console.log("servisant:" + choosenService)
          }}>
            {serviceName.map((data) => (
              <option value={data.Id} key={data.Id}>{data.Name}</option>
            ))}
          </select> 
*/
  return (
    <div className="bookmarkBox container col-12 col-md-10 col-lg-8">
      Dodaj zlecenie
      <form className="justify-content-center">
        <div className="row col-12 mx-auto">
          <label htmlFor="Clients">Wybór klienta</label>
          <select id="Clients" onChange={(e) => {
            setChoosenClient(e.target.value)
            getDevices(e.target.value)
            console.log("client:" + choosenClient)
          }}>
            <option value="new" key={0}>Dodaj nowego klienta...</option>
            {clientsName.map((data) => (
              <option value={data.Id} key={data.Id}>{data.Name}</option>
            ))}
          </select> 
          {choosenClient === "new" && <AddClient clientData={clientsName}/>}

          <label htmlFor="Devices">Wybór urządzenia</label>
          <select id="Devices" onChange={(e) => {
            setChoosenDevice(e.target.value)
            console.log("device:" + choosenDevice)
          }}>
            <option value="new" key={0}>Dodaj nowego urządzenie...</option>
            {deviceName.map((data) => (
              <option value={data.Name} key={data.Id}>{data.Id} {data.Name} {data.Model} {data.SN}</option>
            ))}
          </select> 
          {choosenDevice === "new" && <AddDevice deviceData={choosenClient}/>}
            
            
          
  

          </div>
        </form>
      
    </div>
  );
}

export default AddRepair;