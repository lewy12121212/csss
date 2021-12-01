import React from 'react';
import { NavLink, } from 'react-router-dom';
import Offcanvas from "react-bootstrap/Offcanvas";
import closeImg from '../img/close_arrow.png'

import '../common/leftMenu.scss'

function LeftMenu(props) {

  return (
    <div className="container col-12">
      <Offcanvas className="offcanvas col-5" show={props.show} onHide={props.handleClose}>
        <Offcanvas.Header className="offcanvas-header">
          <Offcanvas.Title>Menu</Offcanvas.Title>
          <img src={closeImg} width="20px" alt="CloseMenu" onClick={props.handleClose}></img>
        </Offcanvas.Header>
        <Offcanvas.Body className="offcanvas-body container col">
          <div className="offcanvas-info">
            <h5>Panel serwisanta</h5>
            <hr />
            Użytkownik: <h3>{props.user.Login}</h3>
            Typ konta: <h3>{props.user.Type}</h3>
            <hr />
          </div>
          <div>
            <NavLink className="navLink-box col-12" exact to="/EmployeeDashboard/Service/Settings" onClick={props.handleClose}>Ustawienia konta</NavLink>
            <NavLink className="navLink-box col-12" to="/EmployeeDashboard/Service/Repairs" onClick={props.handleClose}>Lista zleceń</NavLink>
            <NavLink className="navLink-box col-12" to="/EmployeeDashboard/Service/AssignedOrders" onClick={props.handleClose}>Przypisane zlecenia</NavLink>
            <NavLink className="navLink-box col-12" to="/EmployeeDashboard/Service/Chat" onClick={props.handleClose}>Czat</NavLink>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default LeftMenu;