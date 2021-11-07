import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { getUser, removeUserSession } from '../../../utils/Common';

import Settings from '../common/Settings'

import Chat from '../chat/Chat'
import LeftMenu from './LeftMenu'
import AllOrders from './bookmarks/AllOrders'
import AssignedOrders from './bookmarks/AssignedOrders'

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

  return (
    <div className="col-12">
      <div className="flex-container sticky-top upperMenu">
        <div className="flexLeft container">
          <input type="button" className="btn btn-primary btn-upperMenu col-10 col-md-6 col-lg-4"  onClick={handleShow} value="Menu" />
        </div>
        <div className="flexRight container">
          <input type="button" className="btn btn-primary btn-upperMenu col-10 col-md-6 col-lg-4" onClick={handleLogout} value="Wyloguj" />
        </div>
      </div>
      
      <LeftMenu user={user} handleClose={handleClose} show={show}/>

      <div className="container col-12">
        <Switch>
          <Route exact path="/EmployeeDashboard/Service/Settings" render={() => <Settings userData={JSON.stringify(user)} refreshUser={handleRefreshUser} />} />
          <Route path="/EmployeeDashboard/Service/AllOrders" render={() => <AllOrders />} />
          <Route path="/EmployeeDashboard/Service/AssignedOrders" render={() => <AssignedOrders />} />
          <Route path="/EmployeeDashboard/Service/Chat" render={() => <Chat />} />
          <Redirect to="/EmployeeDashboard/Service/Settings" />
        </Switch>
      </div>
    </div>
  );
}

export default ServicePanel;