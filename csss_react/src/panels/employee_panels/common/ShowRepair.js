import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useDidMount } from '../common/commonFunc';
import { dbAddress } from '../../../dbCon';
import ReactToPrint from 'react-to-print';

import './repair.scss'

function ShowRepair(props) {
  const didMount = useDidMount();
  const [repairInfo, setRepairInfo] = useState("");
  let componentRef = ""

  useEffect(() => {

    if(didMount) {
      console.log('mounted');
      axios.post(`https://${dbAddress}:4000/employee/common/oneRepairInner`, {Id: props.match.params.id}).then(response => {
        setRepairInfo(response.data.data[0])
        console.log(response.data.data)
        //setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
        //setShowInfoAlert(true)
      }).catch((error) => {
        //setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
        //setShowDangerAlert(true)
      });
    } else {
      console.log('state updated');
    }

    const handleInvalidToken = e => {
      if (e.key === 'token' && e.oldValue && !e.newValue) {
        props.history.push('/');
      }
    }
    window.addEventListener('storage', handleInvalidToken)
    return function cleanup() {
      window.removeEventListener('storage', handleInvalidToken)
    }
  }, [props, didMount, setRepairInfo, repairInfo])

  return (
    <div className="mainRepairBox container col-11 col-md-10 mt-4 mb-4">
      <div className="row text-center">
        <div className="col-12 mt-2">
          <h4>Zlecenie numer: {props.match.params.id}</h4>
          <hr />
        </div>
      </div>
      <div className="row text-center">
        <div className="col-12 col-md-2 mt-2 mb-2">
          <img src={repairInfo.QrCode} width="100" height="100" alt="smutno" ref={(response) => (componentRef = response)}/><br />
          <ReactToPrint
            content={() => componentRef}
            trigger={() => <button className="btn btn-success mt-2">Drukuj QrCode</button>}
          />
        </div>
        <div className="col-6 col-md-5 mt-2 mb-2 ">
          <h5>Dane Klienta:</h5>
          <p>Nazwa: <h6><i>{repairInfo.ClientName}</i></h6></p>
          <p>Mail: <h6><i>{repairInfo.ClientMail}</i></h6></p>
          <p>Telefon: <h6><i>{repairInfo.ClientPhone}</i></h6></p>
        </div>
        <div className="col-6 col-md-5 mt-2 mb-2">
          <h5>Dane Urz??dzenia:</h5>
          <p>Nazwa: <h6><i>{repairInfo.DeviceName}</i></h6></p>
          <p>Model: <h6><i>{repairInfo.DeviceModel}</i></h6></p>
          <p>Numer seryjny: <h6><i>{repairInfo.DeviceSN}</i></h6></p>
        </div>
      </div>
      <div className="row text-center">
        <div className="col-12 mt-2">
          <hr />
          <h5>Opis wewn??trzny</h5>
          <textarea className="col-10 repairTextarea">{repairInfo.PrivateDescription}</textarea><br />
          <button className="btn btn-success">Zaktualizuj opis</button>
        </div>
      </div>
      <div className="row text-center">
        <div className="container col-12 mt-2 ">
          <hr />
          <h5>Dodaj czynno????</h5>
          Opis:<br />
          <textarea className="col-10 repairTextarea" id="Desc" name="Desc">{repairInfo.PrivateDescription}</textarea><br />
          <div className="col-12 selectBox">
            <select className="form-select" id="Status" name="Status">
              <option value="Naprawiane" key="Naprawiane">Naprawiane</option>
              <option value="Oczekuj??ce" key="Oczekuj??ce">Oczekuj??ce</option>
              <option value="Oczekuj??ce_na_decyzje" key="Oczekuj??ce_na_decyzje">Oczekuj??ce na decyzje</option>
              <option value="Zamkni??te" key="Zamkni??te">Zamkni??te</option>
            </select>
          </div>
          <button className="btn btn-success mt-2">Dodaj czynno????</button>
        </div>
      </div>
      <div className="row text-center">
        <div className="col-12 mt-2">
          <hr />
          HISTORIA DZIA??A??
          <hr />
        </div>
      </div>


      {/*JSON.stringify(repairInfo)*/}
    </div>
  );
}

export default ShowRepair;