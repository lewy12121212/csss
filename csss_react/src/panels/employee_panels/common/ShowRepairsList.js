import React from 'react';
//import { NavLink } from 'react-router-dom';
//import { Route, Switch } from 'react-router-dom';
//import { useLocation } from "react-router-dom";
//import ShowRepair from "./ShowRepair"

function ShowRepairsList(props) {
  //const location = props.path.pathname;

  return (
    <div className="">
      Lista zleceń
      {/*<div>
        <NavLink className="" exact to={`${location}/1`}>Zlecenie 1</NavLink>
        <NavLink className="" to={`${location}/2`}>Zlecenie 2</NavLink>
      </div>
      <Switch>
        <Route path={`${location}/:id`} render={routerProps => <ShowRepair id={routerProps.match.params.id} />} />
      </Switch>*/}
    </div>
  );
}

export default ShowRepairsList;