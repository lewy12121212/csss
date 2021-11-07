import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { getUser, removeUserSession } from '../../../utils/Common';

import Settings from '../common/Settings'

import Chat from '../chat/Chat'
import LeftMenu from './LeftMenu'
import ManageWarehouse from './bookmarks/ManageWarehouse'
import ManageClients from './bookmarks/ManageClients'
import GenerateFacture from './bookmarks/GenerateFacture'

import '../../../index.scss';

function ManagerPanel(props) {
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
          <Route exact path="/EmployeeDashboard/Manager/Settings" render={() => <Settings userData={JSON.stringify(user)} refreshUser={handleRefreshUser} />} />
          <Route path="/EmployeeDashboard/Manager/ManageWarehouse" render={() => <ManageWarehouse />} />
          <Route path="/EmployeeDashboard/Manager/ManageClients" render={() => <ManageClients />} />
          <Route path="/EmployeeDashboard/Manager/GenerateFacture" render={() => <GenerateFacture />} />
          <Route path="/EmployeeDashboard/Manager/Chat" render={() => <Chat />} />
          <Redirect to="/EmployeeDashboard/Manager/Settings" />
        </Switch>
      </div>
    </div>
  );
}

export default ManagerPanel;