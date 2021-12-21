import React from 'react';
import { NavLink, } from 'react-router-dom';
import Offcanvas from "react-bootstrap/Offcanvas";
import closeImg from '../employee_panels/img/close_arrow.png'

import '../employee_panels/common/leftMenu.scss'

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
            <h5>Panel klienta</h5>
            <hr />
            Użytkownik: <h3>{props.user.Mail}</h3>
            <hr />
          </div>
          <div>
            <NavLink className="navLink-box col-12" to="/ClientDashboard/ActiveRepairs" onClick={props.handleClose}>Lista zleceń aktywnych</NavLink>
            <NavLink className="navLink-box col-12" to="/ClientDashboard/AllRepairs" onClick={props.handleClose}>Lista wszystkich zleceń</NavLink>
            <NavLink className="navLink-box col-12" to="/ClientDashboard/Settings" onClick={props.handleClose}>Ustawienia konta</NavLink>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default LeftMenu;