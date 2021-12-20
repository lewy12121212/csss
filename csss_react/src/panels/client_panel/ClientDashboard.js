//Opis komponentu - będzie zawierał części wspólne dla paneli użytkowników
import React, { useState, useEffect } from 'react';
import {getUser,removeUserSession } from '../../utils/Common';

import { Route, Switch, Redirect } from 'react-router-dom';
import { useLocation } from "react-router-dom";

import RepairsList from './RepairsList';

import LeftMenu from './LeftMenu'
import UpperMenu from '../employee_panels/common/UpperMenu'

function ClientDashboard(props) {
  const user = getUser();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    props.history.push('/');
  }

  return (
    <div className="col-12">
      <LeftMenu user={user} handleClose={handleClose} show={show}/>
      <UpperMenu handleShow={handleShow} handleLogout={handleLogout} /> 
      Witaj w panelu Klienta<br /><br />

      <div className="container col-12">
        <Switch>
          <Route exact path="/ClientDashboard/ActiveRepairs" render={() => <RepairsList userData={JSON.stringify(user)} />} />

          <Redirect to="/ClientDashboard/ActiveRepairs" />
        </Switch>
      </div>    
    </div>
  );
}

export default ClientDashboard;