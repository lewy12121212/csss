import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { getUser, removeUserSession } from '../../../utils/Common';
//import Offcanvas from "react-bootstrap/Offcanvas";

import Settings from '../common/Settings'
import AddEmployee from './bookmarks/AddEmployee'
import ShowAccounts from './bookmarks/ShowAccounts'
import History from './bookmarks/History';
import Chat from '../chat/Chat'

import LeftMenu from './LeftMenu';

import './adminPanel.scss'
import '../../../index.scss';
//import closeImg from '../img/close_arrow.png'
//import menuImg from '../img/menu_dotted.png'
//import logoutImg from '../img/logout1.png'

function AdminPanel(props) {
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
    <div className="col-12" style={{ color: 'black' }}>

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
          <Route exact path="/EmployeeDashboard/Admin/Settings" render={() => <Settings userData={JSON.stringify(user)} refreshUser={handleRefreshUser} />} />
          <Route path="/EmployeeDashboard/Admin/AddEmployee" render={() => <AddEmployee />} />
          <Route path="/EmployeeDashboard/Admin/ShowAccounts" render={() => <ShowAccounts />} />
          <Route path="/EmployeeDashboard/Admin/History" render={() => <History />} />
          <Route path="/EmployeeDashboard/Admin/Chat" render={() => <Chat />} />
          <Redirect to="/EmployeeDashboard/Admin/Settings" />
        </Switch>
      </div>
    </div>
  );
}

export default AdminPanel;