import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { getUser, removeUserSession } from '../../../utils/Common';

import Settings from '../common/Settings'
import Chat from '../chat/Chat'
import ShowRepairsList from '../common/ShowRepairsList'
import AssignedRepairs from './bookmarks/AssignedRepairs'

import LeftMenu from './LeftMenu'
import UpperMenu from '../common/UpperMenu'

import '../../../index.scss';

function ServicePanel(props) {
  const user = getUser();
  const [show, setShow] = useState(false);

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
          <Route exact path="/EmployeeDashboard/Service/Settings" render={() => <Settings userData={JSON.stringify(user)} refreshUser={handleRefreshUser} />} />
          <Route path="/EmployeeDashboard/Service/Repairs" render={() => <ShowRepairsList />} />
          <Route path="/EmployeeDashboard/Service/AssignedRepairs" render={() => <AssignedRepairs />} />
          <Route path="/EmployeeDashboard/Service/Chat" render={() => <Chat />} />
          <Redirect to="/EmployeeDashboard/Service/Settings" />
        </Switch>
      </div>
    </div>
  );
}

export default ServicePanel;