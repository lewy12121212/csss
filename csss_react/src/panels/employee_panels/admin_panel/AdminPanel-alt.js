import React, { useState } from 'react';
import { Route, NavLink } from 'react-router-dom';
//import { OffCanvas, OffCanvasMenu, OffCanvasBody } from "react-offcanvas";
//import Offcanvas from "react-bootstrap/Offcanvas";
//import Button from "react-bootstrap/Button"
//import {Container, Navbar} from "react-bootstrap"

import Settings from './bookmarks/Settings'
import UsersSettings from './bookmarks/UsersSettings'
import History from './bookmarks/History';
import { getUser, removeUserSession } from '../../../utils/Common';

import LeftMenu from '../LeftMenu'
import handleShow from "../LeftMenu"

import './AdminPanel.scss'
import '../../../index.scss';
import '../EmployeePanels.scss';
//import closeImg from '../img/close_arrow.png'
//import menuImg from '../img/menu.png'

function AdminPanel(props) {
  const user = getUser();
  //const [show, setShow] = useState(false);

  const MenuNavLink = [
    { panelType: user.Type, bookmark: "Settings", description: "Ustawienia konta" },
    { panelType: user.Type, bookmark: "UsersSettings", description: "Ustawienia kont użytkowników" },
    { panelType: user.Type, bookmark: "History", description: "Historia zleceń" },
  ];

  //const handleClose = () => setShow(false);
  //const handleShow = () => setShow(true);

  const handleLogout = () => {
    removeUserSession();
    props.history.push('/');
  }

  return (
    <div className="" style={{ color: 'black', padding: '10px' }}>
      <div className="upperMenu container col-12">
        <div className="row">
          {/*<img src={menuImg} className="menuImg" onClick={handleShow} width="40px"></img>*/}
          <input type="button" className="btn btn-primary btn-upperMenu col-4 col-sm-2" value="Menu" onClick={LeftMenu.handleShow} />
          <div className="col-4 col-sm-8"></div>
          <input type="button" className="btn btn-primary btn-upperMenu col-4 col-sm-2" onClick={handleLogout} value="Wyloguj" />
        </div>
      </div>
      <hr />
      <div className="container col-12">
        <LeftMenu panelType="Administrator" userName={user.Name} userType={user.Type} MenuNavLink={MenuNavLink}  />
      </div>
      <div>
        <Route path="/EmployeeDashboard/Admin/Settings" component={Settings} />
        <Route path="/EmployeeDashboard/Admin/UsersSettings" component={UsersSettings} />
        <Route path="/EmployeeDashboard/Admin/History" component={History} />
      </div>
    </div>
  );
}

export default AdminPanel;