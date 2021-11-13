import React from 'react';
import './alerts.scss';

function WarningAlert(props) {

  return (
    <div className="warningAlert fixed-top">
      <span className="closebtn" onClick={props.CloseAlert}>&times;</span>
      {props.Content.MainInfo}<br />
      <small>{props.Content.SecondaryInfo}</small>
      <input type="button" className="btn btn-warning col-12" onClick={props.Func} value="Akceptuj" />
      <input type="button" className="btn btn-warning col-12" onClick={props.Func} value="Anuluj" />
    </div>
  );
}

export default WarningAlert;