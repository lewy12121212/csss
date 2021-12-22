//Opis komponentu - będzie zawierał części wspólne dla paneli użytkowników
import React, { useState, useEffect } from 'react';
import {getUser,removeUserSession } from '../../utils/Common';

import { Route, Switch, Redirect } from 'react-router-dom';

import RepairsList from './RepairsList';
import Settings from './Settings';
import AllRepairs from './AllRepairs'

import LeftMenu from './LeftMenu'
import UpperMenu from '../employee_panels/common/UpperMenu'

function ClientDashboard(props) {
  const user = getUser();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // handle click event of logout button
  const handleRefreshUser = () =>{
    alert('Dane zmieniono - nastąpi wylogowanie.')
    handleLogout();
  }

  const handleLogout = () => {
    removeUserSession();
    props.history.push('/');
  }

    useEffect(() => {
    const handleInvalidToken = e => {
      if (e.key === 'token' && e.oldValue && !e.newValue) {
        props.history.push('/');
      }
    }
    window.addEventListener('storage', handleInvalidToken)
    return function cleanup() {
      window.removeEventListener('storage', handleInvalidToken)
    }
  }, [props])

  return (
    <div className="col-12">
      <LeftMenu user={user} handleClose={handleClose} show={show}/>
      <UpperMenu handleShow={handleShow} handleLogout={handleLogout} /> 

      <div className="container col-12">
        <Switch>
          <Route exact path="/ClientDashboard/ActiveRepairs" render={() => <RepairsList userData={JSON.stringify(user)} />} />
          <Route exact path="/ClientDashboard/AllRepairs" render={() => <AllRepairs userData={JSON.stringify(user)} />} />
          <Route exact path="/ClientDashboard/Settings" render={() => <Settings userData={JSON.stringify(user)} refreshUser={handleRefreshUser} />} />

          <Redirect to="/ClientDashboard/ActiveRepairs" />
        </Switch>
      </div>    
    </div>
  );
}

export default ClientDashboard;