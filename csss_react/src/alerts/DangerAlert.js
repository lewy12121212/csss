import React from 'react';
import './alerts.scss';

function DangerAlert(props) {

  return (
    <div className="dangerAlert fixed-top">
      <span className="closebtn" onClick={props.CloseAlert}>&times;</span>
      {props.Content.MainInfo}<br />
      <small>{props.Content.SecondaryInfo}</small>
      
    </div>
  );
}

export default DangerAlert;