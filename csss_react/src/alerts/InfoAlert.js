import React from 'react';
import './alerts.scss';

function InfoAlert(props) {

  return (
    <div className="infoAlert fixed-top">
      <span className="closebtn" onClick={props.CloseAlert}>&times;</span>
      {props.Content.MainInfo}<br />
      <small>{props.Content.SecondaryInfo}</small>
      
    </div>
  );
}

export default InfoAlert;