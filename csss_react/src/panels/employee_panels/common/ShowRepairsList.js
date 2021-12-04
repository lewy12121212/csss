import React, { useState, useEffect } from 'react';
import { useDidMount } from '../common/commonFunc'
import axios from 'axios';
import { NavLink } from 'react-router-dom';

import { dbAddress } from '../../../dbCon';
//import { Route, Switch } from 'react-router-dom';
//import { useLocation } from "react-router-dom";
//import ShowRepair from "./ShowRepair"
//<NavLink className="" exact to={`${location}/1`}>Zlecenie 1</NavLink>

function ShowRepairsList(props) {
  const didMount = useDidMount();
  const [repairsTable, setRepairsTable] = useState([])
  //const location = props.path.pathname;
  useEffect(() => {
    if(didMount) {
      console.log('mounted');
      axios.get(`https://${dbAddress}:4000/employee/common/allRepairsInner`).then(response => {
        setRepairsTable(response.data.data)
        console.log(response.data.data)

      });
    } else {
      console.log('state updated');
    }
  }, [setRepairsTable, repairsTable, didMount]);


  return (
    <div className="col-12">
      Lista zleceń
      <div className="table-responseive" >
        
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col" rowSpan="2">#</th>          
              <th scope="col" colSpan="3">Dane urządzenia</th>
              <th scope="col" colSpan="1" rowSpan="2">Dane klienta</th>
              <th scope="col" colSpan="2">Dane serwisanta</th>
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

              <td><NavLink className="btn btn-primary" to={`/Repairs/${data.Id}`} target="_blank" >Edytuj</NavLink></td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShowRepairsList;