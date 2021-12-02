import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

import { dbAddress } from '../../../dbCon';
//import { Route, Switch } from 'react-router-dom';
//import { useLocation } from "react-router-dom";
//import ShowRepair from "./ShowRepair"
//<NavLink className="" exact to={`${location}/1`}>Zlecenie 1</NavLink>
function useDidMount() {
  const didMountRef = useRef(true);
  
  useEffect(() => {
    didMountRef.current = false;
  }, []);
  return didMountRef.current;
};

function ShowRepairsList(props) {
  const didMount = useDidMount();
  const [repairsTable, setRepairsTable] = useState([])
  //const location = props.path.pathname;


  useEffect(() => {
    if(didMount) {
      console.log('mounted');
      axios.get(`https://${dbAddress}:4000/employee/common/allRepairs`).then(response => {
        setRepairsTable(response.data.data)
        console.log(response.data.data)
      }).catch(error => {
  //
      });
    } else {
      console.log('state updated');
    }
  }, [setRepairsTable, repairsTable, didMount]);


  return (
    <div className="">
      Lista zleceń
      <div>
        <NavLink className="" to="/Repairs/1" target="_blank" >Zlecenie 1</NavLink>
        <NavLink className="" to="/Repairs/2" target="_blank" >Zlecenie 2</NavLink>
      </div>
      {repairsTable.map((row) => 
        <div key={row.Id}>
          {row.Id}
        </div>
      )}
      {/*<Switch>
        <Route path="/Repairs/:id" render={routerProps => <ShowRepair id={routerProps.match.params.id} />} />
      </Switch>*/}
    </div>
  );
}

export default ShowRepairsList;