import React, { useState, useEffect } from 'react';
import { useDidMount } from '../employee_panels/common/commonFunc'
import axios from 'axios';
import { NavLink } from 'react-router-dom';

import { dbAddress } from '../../dbCon';
//import { Route, Switch } from 'react-router-dom';
//import { useLocation } from "react-router-dom";
//import ShowRepair from "./ShowRepair"
//<NavLink className="" exact to={`${location}/1`}>Zlecenie 1</NavLink>

function RepairsList(props) {
  const user = JSON.parse(props.userData);

  const didMount = useDidMount();
  const [repairsTable, setRepairsTable] = useState([])
  //const location = props.path.pathname;
  useEffect(() => {
    if(didMount) {
      console.log(user)
      axios.post(`https://${dbAddress}:4000/client/getRepairsList`, {clientId: user.Id}).then(response => {
        setRepairsTable(response.data.data)
        console.log(response.data.data)

      });
    } else {
      console.log('state updated');
    }
  }, [setRepairsTable, repairsTable, didMount, user]);


  return (
    <div className="col-12">
      Lista wszystkich zleceń
      <div className="table-responseive" >
        
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col" rowSpan="2">#</th>          
              <th scope="col" colSpan="3">Dane urządzenia</th>
              <th scope="col" colSpan="2">Dane serwisanta</th>
              <th scope="col" rowSpan="2">Status</th>
              <th scope="col" rowSpan="2">Data odbioru</th>
              <th scope="col" rowSpan="2">Szczegóły</th>
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

              <td>{data.EmployeeLogin}</td>
              <td>{data.EmployeeName}</td>
              {!data.IfReceived? 
                <td>{!data.Closed ? "Aktywne" : "Oczekuje na odbiór"}</td> : <td>Zamknięte</td>
              }
              <td>{data.IfReceived ? data.ReceivDate.slice(0,10) : "-"}</td>
              <td><NavLink className="btn btn-primary" to={`/Repairs/${data.Id}`} target="_blank" >Zobacz</NavLink></td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RepairsList;