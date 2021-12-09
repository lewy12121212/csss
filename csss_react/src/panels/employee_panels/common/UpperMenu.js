import React from 'react';

import '../common/upperMenu.scss'

function UpperMenu(props) {

  return (
    <div className="flex-container sticky-top upperMenu">
      <div className="flexLeft container">
        <input type="button" className="btn btn-primary btn-upperMenu col-10 col-md-6 col-lg-4"  onClick={props.handleShow} value="Menu" />
      </div>
      <div className="flexRight container">
        <input type="button" className="btn btn-primary btn-upperMenu col-10 col-md-6 col-lg-4" onClick={props.handleLogout} value="Wyloguj" />
      </div>
    </div>
  );
}

export default UpperMenu;