import React, { useState, useEffect } from 'react';
import { useDidMount } from '../employee_panels/common/commonFunc'
import axios from 'axios';

import { dbAddress } from '../../dbCon';

import Device from './Device';
//import { Route, Switch } from 'react-router-dom';
//import { useLocation } from "react-router-dom";
//import ShowRepair from "./ShowRepair"
//<NavLink className="" exact to={`${location}/1`}>Zlecenie 1</NavLink>

function AllDevices(props) {
  const user = JSON.parse(props.userData);

  const didMount = useDidMount();
  const [repairsTable, setRepairsTable] = useState([])
  const [renderDevice, setRenderDevice] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  //const location = props.path.pathname;

  function changeRender(val){
    setRenderDevice(val)
  } 

  useEffect(() => {
    if(didMount) {
      console.log(user)
      axios.post(`https://${dbAddress}:4000/client/getDevices`, {ClientId: user.Id}).then(response => {
        setRepairsTable(response.data.data)
        console.log(response.data.data)

      });
    } else {
      console.log('state updated');
    }
  }, [setRepairsTable, repairsTable, didMount, user]);


  return (
    <div className="col-12">
      {!renderDevice &&
       <div className="table-responseive" >

       <table className="table">
         <thead className="thead-dark">
           <tr>
             <th scope="col">#</th>             
             <th scope="col">Marka</th>
             <th scope="col">Model</th>
             <th scope="col">Numer seryjny</th>
             <th scope="col">Typ</th>
           </tr>
         </thead>
         <tbody>
         {repairsTable.map((data, index) => 

           <tr key={data.Id}>   
             <td>{index+1}</td>
             <td>{data.Name}</td>
             <td>{data.Model}</td>
             <td>{data.SN}</td>
             <td>{data.Type}</td>
             <td><input type="button" className="btn btn-primary" onClick={() => {setRenderDevice(true); setDeviceId(data.Id)}} value="Zobacz historię" /></td>
           </tr>
         )}
         </tbody>
       </table>
      </div>
      }
      {renderDevice &&
        <Device Id={deviceId} changeRender={changeRender} />
      }     
    </div>
  );
}

export default AllDevices;