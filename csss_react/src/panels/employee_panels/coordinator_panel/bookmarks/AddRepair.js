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
  function addSelectOptions(selectId, table){
    var select = document.getElementById(selectId);
    for(var i = 0; i < table.length; i++)
    {
        var option = document.createElement("OPTION"),
            txt = document.createTextNode(table[i]);
        option.appendChild(txt);
        option.setAttribute("value",table[i]);
        select.insertBefore(option,select.lastChild);
    }
  }
  */

  /*function getClientsNames(data){
   //poprawić update clientsName = []; żeby zapisywało, 
  
    const id = 0
    const cood = "Dodaj nowego klienta"
    const newData = {
        "id": id,
        "clientName": cood
    };
    clientsName.push(newData);

    for (var i = 0; i < data.length; i++) {
      const id = i
      const cood = data[i].Name
      const newData = {
        "id": id+1,
        "clientName": cood
      };
      clientsName.push(newData);
    }
  console.log(clientsName)
  return  clientsName;
  }*/

  //const handleGetClients = () => {
  //  console.log("Pobieranie listy klientów...")
  //}
  //<select onClick={(handleGetClients) => { 
  //              //https://stackoverflow.com/questions/31413053/how-to-use-an-array-as-option-for-react-select-component/45361667
  //
  //              /*useEffect zrobić  https://github.com/lewy12121212/PZ-2021-wypozyczalnia/commit/ea2fd1bb538b167775d68d955a94e22d2b4e8f01*/}}>
  //              <option selected>...Wybierz użytkownika</option>
  //              {names.map((val) => {
  //                  return (
  //                      <option value={val.Id}>{val.Id}. {val.Name} </option>
  //                  )
  //              })}
  //  </select>


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
          {choosenDevice === "new" && <AddDevice deviceData={deviceName}/>}
            
            
            <label htmlFor="Servisants">Wybór serwisanta</label>
            <select id="Servisants">
              <option value ="1" >Serwisant A</option>
              <option value ="2" >Serwisant B</option>
            </select>
          </div>
        </form>
      
    </div>
  );
}

export default AddRepair;