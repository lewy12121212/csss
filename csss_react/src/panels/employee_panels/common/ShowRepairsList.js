import React from 'react';
import { NavLink } from 'react-router-dom';
//import { Route, Switch } from 'react-router-dom';
//import { useLocation } from "react-router-dom";
//import ShowRepair from "./ShowRepair"
//<NavLink className="" exact to={`${location}/1`}>Zlecenie 1</NavLink>

function ShowRepairsList(props) {
  //const location = props.path.pathname;

  return (
    <div className="">
      Lista zleceń
      <div>
        <NavLink className="" to="/Repairs/1" target="_blank" >Zlecenie 1</NavLink>
        <NavLink className="" to="/Repairs/2" target="_blank" >Zlecenie 2</NavLink>
      </div>
      {/*<Switch>
        <Route path="/Repairs/:id" render={routerProps => <ShowRepair id={routerProps.match.params.id} />} />
      </Switch>*/}
    </div>
  );
}

export default ShowRepairsList;