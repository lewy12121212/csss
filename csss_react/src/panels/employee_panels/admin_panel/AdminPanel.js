import React, { useState } from 'react';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';
import Offcanvas from "react-bootstrap/Offcanvas";

import Settings from './bookmarks/Settings'
import AddEmployee from './bookmarks/AddEmployee'
import ShowAccounts from './bookmarks/ShowAccounts'
import History from './bookmarks/History';
import { getUser, removeUserSession } from '../../../utils/Common';

import './AdminPanel.scss'
import '../../../index.scss';
import '../EmployeePanels.scss';
import closeImg from '../img/close_arrow.png'
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
      
      <div className="container col-12">
        <Offcanvas className="offcanvas col-5" show={show} onHide={handleClose}>
          <Offcanvas.Header className="offcanvas-header">
            <Offcanvas.Title>Menu</Offcanvas.Title>
            <img src={closeImg} width="20px" alt="CloseMenu" onClick={handleClose}></img>
          </Offcanvas.Header>
          <Offcanvas.Body className="offcanvas-body container col">
            <div className="offcanvas-info">
              <h5>Panel administratora</h5>
              <hr />
              Użytkownik: <h3>{user.Name}</h3>
              Typ konta: <h3>{user.Type}</h3>
              <hr />
            </div>
            <div>
              <NavLink className="navLink-box col-12" exact to="/EmployeeDashboard/Admin/Settings" onClick={handleClose}>Ustawienia konta</NavLink><br />
              <NavLink className="navLink-box col-12" to="/EmployeeDashboard/Admin/AddEmployee" onClick={handleClose}>Dodaj konto pracownika</NavLink><br />
              <NavLink className="navLink-box col-12" to="/EmployeeDashboard/Admin/ShowAccounts" onClick={handleClose}>Wyświetl konta pracowników</NavLink><br />
              <NavLink className="navLink-box col-12" to="/EmployeeDashboard/Admin/History" onClick={handleClose}>Historia zleceń</NavLink>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>

      <div className="container col-12" style={{padding: '0px'}}>
        <Switch>
          <Route exact path="/EmployeeDashboard/Admin/Settings" render={() => <Settings userData={JSON.stringify(user)} />} />
          <Route path="/EmployeeDashboard/Admin/AddEmployee" component={AddEmployee} />
          <Route path="/EmployeeDashboard/Admin/ShowAccounts" component={ShowAccounts} />
          <Route path="/EmployeeDashboard/Admin/History" component={History} />
          <Redirect to="/EmployeeDashboard/Admin/Settings" />
        </Switch>
      </div>
    </div>
  );
}

export default AdminPanel;