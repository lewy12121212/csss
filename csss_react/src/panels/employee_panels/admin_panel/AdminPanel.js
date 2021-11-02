import React, { useState } from 'react';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';
import Offcanvas from "react-bootstrap/Offcanvas";

import Settings from './bookmarks/Settings'
import UsersSettings from './bookmarks/UsersSettings'
import History from './bookmarks/History';
import { getUser, removeUserSession } from '../../../utils/Common';

import './AdminPanel.scss'
import '../../../index.scss';
import '../EmployeePanels.scss';
import closeImg from '../img/close_arrow.png'

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
    <div className="" style={{ color: 'black', padding: '10px' }}>
      <div className="upperMenu container col-12">
        <div className="row">
          {/*<img src={menuImg} className="menuImg" onClick={handleShow} width="40px"></img>*/}
          <input type="button" className="btn btn-primary btn-upperMenu col-4 col-sm-2" value="Menu" onClick={handleShow} />
          <div className="col-4 col-sm-8"></div>
          <input type="button" className="btn btn-primary btn-upperMenu col-4 col-sm-2" onClick={handleLogout} value="Wyloguj" />
        </div>
      </div>
      <hr />
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
              <NavLink className="navLink-box col-12" to="/EmployeeDashboard/Admin/UsersSettings" onClick={handleClose}>Ustawienia kont użytkowników</NavLink><br />
              <NavLink className="navLink-box col-12" to="/EmployeeDashboard/Admin/History" onClick={handleClose}>Historia zleceń</NavLink>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

      </div>
        <Switch>
          <Route exact path="/EmployeeDashboard/Admin/Settings" component={Settings} />
          <Route path="/EmployeeDashboard/Admin/UsersSettings" component={UsersSettings} />
          <Route path="/EmployeeDashboard/Admin/History" component={History} />
          <Redirect to="/EmployeeDashboard/Admin/Settings" />
        </Switch>
    </div>
  );
}

export default AdminPanel;