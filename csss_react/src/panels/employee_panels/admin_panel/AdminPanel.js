import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { getUser, removeUserSession } from '../../../utils/Common';
//import Offcanvas from "react-bootstrap/Offcanvas";

import Settings from '../common/Settings'
import AddEmployee from './bookmarks/AddEmployee'
import ShowAccounts from './bookmarks/ShowAccounts'
import History from './bookmarks/History';
import Chat from '../chat/Chat'

import LeftMenu from './LeftMenu';
import UpperMenu from '../common/UpperMenu'

//import infoAlert from '../../../alerts/InfoAlert'

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
      <LeftMenu user={user} handleClose={handleClose} show={show} />

      <div className="col-12">
        <Switch>
          <Route exact path="/EmployeeDashboard/Admin/Settings" render={() => <Settings userData={JSON.stringify(user)} />} />
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