import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { dbAddress } from '../../../../dbCon';
//import '../AdminPanel.scss'
//import '../../../../index.scss';
//import '../../EmployeePanels.scss';
//import ShowRepairsList from "../../common/ShowRepairsList"
import './bookmarks.scss';

function AddOrder(props) {
  
  const [error, setError] = useState(null);
  const  clientsName = [];
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


  function getClientsNames(data){
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
  }

  const handleGetClients = () => {
    console.log("Pobieranie listy klientów...")
    axios.get(`https://${dbAddress}:4000/repair/getListOfClients`).then(response => {
        //console.log(response.data)
        getClientsNames(response.data.data)
        console.log("TUTA")
        console.log(clientsName)
        //addSelectOptions("Clients",getClientsNames(response.data.data))

      }).catch(error => {
        if (error.response.status === 401) setError(error.response.data.message);
        else setError("Coś poszło nie tak...");
      });
  }
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
            <select id="Clients" onClick={handleGetClients}>{
              clientsName.map((option) => (
              <option value={option.id}>{option.clientName}</option>
            ))}
            </select> 
            

            <label htmlFor="Devices">Wybór urządzenia</label>
            <select id="Devices">
              <option value="0">Laptop </option>
              <option value ="1" >Komputer</option>
              <option value ="2" >Telefon</option>
            </select>
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

export default AddOrder;