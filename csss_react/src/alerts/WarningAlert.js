import React from 'react';
import './alerts.scss';

function WarningAlert(props) {

  return (
    <div className="warningAlert fixed-top">
      <span className="closebtn" onClick={props.CloseAlert}>&times;</span>
      {props.Content.MainInfo}<br />
      <small>{props.Content.SecondaryInfo}</small>
      
    </div>
  );
}

export default WarningAlert;