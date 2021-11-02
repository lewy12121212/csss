import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
//import { OffCanvas, OffCanvasMenu, OffCanvasBody } from "react-offcanvas";
import Offcanvas from "react-bootstrap/Offcanvas";
//import {Container, Navbar} from "react-bootstrap"

import './LeftMenu.scss'
//import '../../index.scss';
import './EmployeePanels.scss';
import closeImg from './img/close_arrow.png'

function LeftMenu(props) {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Offcanvas className="offcanvas col-5" show={show} onHide={handleClose}>
      <Offcanvas.Header className="offcanvas-header">
        <Offcanvas.Title>Menu</Offcanvas.Title>
        <img src={closeImg} width="20px" onClick={handleClose}></img>
      </Offcanvas.Header>
      <Offcanvas.Body className="offcanvas-body container col">
        <div className="offcanvas-info">
          <h5>{props.panelType}</h5>
          <hr />
          Użytkownik: <h3>{props.userName}</h3>
          Typ konta: <h3>{props.userType}</h3>
          <hr />
        </div>
        {props.MenuNavLink.map((panelType, bookmark, description) =>
            <NavLink className="navLink-box col-12" exact to={"/EmployeeDashboard/" + panelType + "/" + bookmark} onClick={handleClose}>{description}</NavLink>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default LeftMenu;