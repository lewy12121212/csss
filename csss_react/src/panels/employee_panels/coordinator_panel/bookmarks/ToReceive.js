import React, { useState, useEffect } from 'react';
import { useDidMount } from '../../common/commonFunc'
import axios from 'axios';

import { dbAddress } from '../../../../dbCon';

import InfoAlert from '../../../../alerts/InfoAlert'
import WarningAlertSubmit from '../../../../alerts/WarningAlertSubmit'
import DangerAlert from '../../../../alerts/DangerAlert'
//import { Route, Switch } from 'react-router-dom';
//import { useLocation } from "react-router-dom";
//import ShowRepair from "./ShowRepair"
//<NavLink className="" exact to={`${location}/1`}>Zlecenie 1</NavLink>

function ToReceive(props) {
  const didMount = useDidMount();
  const [repairsTable, setRepairsTable] = useState([])
  const [confirmReceive, setConfirmReceive] = useState(false);
  const [repairId, setRepairId] = useState(null);
  const [showDangerAlert, setShowDangerAlert] = useState(false)
  const [showInfoAlert, setShowInfoAlert] = useState(false)
  const [showWarningAlertSubmitData, setShowWarningAlertSubmitData] = useState(false)
  const [alertMsg, setAlertMsg] = useState({MainInfo: "", SecondaryInfo: ""})

  function closeAlert(){
    setShowDangerAlert(false)
    setShowInfoAlert(false)
    setShowWarningAlertSubmitData(false)
    setAlertMsg({MainInfo: "", SecondaryInfo: ""})
  }

  const handleCommitChanges = () => {
    console.log("Zmiana danych...")
    closeAlert()
    axios.post(`https://${dbAddress}:4000/employee/coord/ConfirmReceive`, {RepairId: repairId}).then(response => {
      setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
      setShowInfoAlert(true)
      axios.get(`https://${dbAddress}:4000/employee/coord/ToReceive`).then(response => {
        setRepairsTable(response.data.data)
      });
    }).catch((error) => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }


  //const location = props.path.pathname;
  useEffect(() => {
    if(didMount) {
      console.log('mounted');
      axios.get(`https://${dbAddress}:4000/employee/coord/ToReceive`).then(response => {
        setRepairsTable(response.data.data)

      });
    } else {
      console.log('state updated');
    }
  }, [setRepairsTable, repairsTable, didMount]);

  useEffect(() => {

    if(confirmReceive){
      setAlertMsg({MainInfo: "Uwaga.", SecondaryInfo: "Czy na pewno chcesz potwierdzić odbiór urządzenia?"});
      setShowWarningAlertSubmitData(true);
      setConfirmReceive(false);
    }

  },[confirmReceive])


  return (
    <div className="col-12">
      {showDangerAlert && <DangerAlert Content={alertMsg} CloseAlert={closeAlert}/>}
      {showInfoAlert && <InfoAlert Content={alertMsg} CloseAlert={closeAlert}/>}
      {showWarningAlertSubmitData && <WarningAlertSubmit Content={alertMsg} Func={handleCommitChanges} CloseAlert={closeAlert}/>}
      Lista zleceń do odbioru.
      <div className="table-responseive" >
        
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col" rowSpan="2">#</th>          
              <th scope="col" colSpan="3">Dane urządzenia</th>
              <th scope="col" colSpan="1" rowSpan="2">Dane klienta</th>
              <th scope="col" colSpan="2">Dane serwisanta</th>
              <th scope="col" rowSpan="2">Data zamknięcia</th>
              <th scope="col" rowSpan="2">Edytuj</th>
            </tr>
            <tr>
              <th scope="col">Data przyjęcia</th>             
              <th scope="col">Typ</th>
              <th scope="col">Model</th>

              <th scope="col">Login</th>
              <th scope="col">Imię</th>
            </tr>
          </thead>
          <tbody>
          {repairsTable.map((data) => 

            <tr key={data.Id}>   
              <td>{data.Id}</td>

              <td>{data.CreationDate.slice(0,10)}</td>
              <td>{data.DeviceType}</td>
              <td>{data.DeviceName + ' ' +data.DeviceModel}</td>

              <td>{data.ClientName}</td>


              <td>{data.EmployeeLogin}</td>
              <td>{data.EmployeeName}</td>
              <td>{JSON.parse(data.Description).repair.at(-1).Date}</td>

              <td><button className="btn btn-primary" onClick={()=>{setConfirmReceive(true); setRepairId(data.Id)}}>Potwierdź odbiór</button></td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ToReceive;