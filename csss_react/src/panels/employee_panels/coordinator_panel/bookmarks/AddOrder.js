import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { dbAddress } from '../../../../dbCon';
//import '../AdminPanel.scss'
//import '../../../../index.scss';
//import '../../EmployeePanels.scss';
import './bookmarks.scss';

function AddOrder(props) {
  /*
  const [clientName, setUserData] = useState(JSON.parse(props.userData))

  const [alertMsg, setAlertMsg] = useState({MainInfo: "", SecondaryInfo: ""})
  const [showDangerAlert, setShowDangerAlert] = useState(false)
  const [showInfoAlert, setShowInfoAlert] = useState(false)
  const [showWarningAlertSubmitData, setShowWarningAlertSubmitData] = useState(false)
  const [showWarningAlertSubmitPass, setShowWarningAlertSubmitPass] = useState(false)

  function closeAlert(){
    setShowDangerAlert(false)
    setShowInfoAlert(false)
    setShowWarningAlertSubmitData(false)
    setShowWarningAlertSubmitPass(false)
    setAlertMsg({MainInfo: "", SecondaryInfo: ""})
  }

  const handleGetClientList = () => {
    console.log("Pobieranie listy klientów...")
    closeAlert()
    //"SELECT Name, Mail, Phone, IsCompany FROM DB_clients";
    //UserPass: userPass, Id: userData.Id
    axios.get('/repair/getListOfClients', {Name: clientName}).then(response => {
      setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
      setShowInfoAlert(true)
      console.log("Klient:")
      console.log(clientName)
      
    }).catch((error) => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }
*/
const [error, setError] = useState(null);

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
  var names = [];
  for (var i = 0; i < data.length; i++) {
    names.push(data[i].Name);
}
//console.log(names)
return names;
}

const handleGetClients = () => {
  console.log("Pobieranie listy klientów...")
  axios.get(`https://${dbAddress}:4000/repair/getListOfClients`).then(response => {
      console.log(response.data)
      //getClientsNames(response.data.data)
      addSelectOptions("Clients",getClientsNames(response.data.data))

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
            <select id="Clients" onClick={handleGetClients}>
              <option value="0">Dodaj nowego klienta </option>
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