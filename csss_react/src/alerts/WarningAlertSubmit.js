import React from 'react';
import './alerts.scss';

function WarningAlert(props) {

  return (
    <div className="warningAlert fixed-top">
      {props.Content.MainInfo}<br />
      <small>{props.Content.SecondaryInfo}</small><br />
      <input type="button" className="btn btn-success col-12 col-md-4 col-lg-2 btnSubmitWarning" onClick={props.Func} value="Akceptuj" />
      <input type="button" className="btn btn-success col-12 col-md-4 col-lg-2 btnSubmitWarning" onClick={props.CloseAlert} value="Anuluj" />
    </div>
  );
}

export default WarningAlert;