import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { getUser, removeUserSession } from '../../../utils/Common';

import Settings from '../common/Settings'
import Chat from '../chat/Chat'
import AddOrder from './bookmarks/AddOrder'
import AddClient from './bookmarks/AddClient'
import Repairs from "../common/ShowRepairsList"

import LeftMenu from './LeftMenu'
import UpperMenu from '../common/UpperMenu'

import '../../../index.scss';

function CoordinatorPanel(props) {
  const user = getUser();
  const [show, setShow] = useState(false);

  const location = useLocation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
      <UpperMenu handleShow={handleShow} handleLogout={handleLogout} /> 
      <LeftMenu user={user} handleClose={handleClose} show={show}/>

      <div className="container col-12">
        <Switch>
          <Route exact path="/EmployeeDashboard/Coordinator/Settings" render={() => <Settings userData={JSON.stringify(user)} refreshUser={handleRefreshUser} />} />
          <Route path="/EmployeeDashboard/Coordinator/Repairs" render={() => <Repairs path={location} />} />
          <Route path="/EmployeeDashboard/Coordinator/AddOrder" render={() => <AddOrder />} />
          <Route path="/EmployeeDashboard/Coordinator/AddClient" render={() => <AddClient />} />
          <Route path="/EmployeeDashboard/Coordinator/Chat" render={() => <Chat />} />
          <Redirect to="/EmployeeDashboard/Coordinator/Settings" />
        </Switch>
      </div>
    </div>
  );
}

export default CoordinatorPanel;