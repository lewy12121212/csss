import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { dbAddress } from '../../../../dbCon'
import InfoAlert from '../../../../alerts/InfoAlert'
import WarningAlertSubmit from '../../../../alerts/WarningAlertSubmit'
import DangerAlert from '../../../../alerts/DangerAlert'
//import '../AdminPanel.scss'
//import '../../../../index.scss';
//import '../../EmployeePanels.scss';
import './bookmarks.scss';

function AddDevice(props) {
  const [deviceData, setDeviceData] = useState({ClientId: props.deviceData, Name: "", Model: "", Type: "", Sn: ""})

  const [showDangerAlert, setShowDangerAlert] = useState(false)
  const [showInfoAlert, setShowInfoAlert] = useState(false)
  const [showWarningAlertSubmitData, setShowWarningAlertSubmitData] = useState(false)
  const [showWarningAlertSubmitPass, setShowWarningAlertSubmitPass] = useState(false)

  const [alertMsg, setAlertMsg] = useState({MainInfo: "", SecondaryInfo: ""})


  function closeAlert(){
    setShowDangerAlert(false)
    setShowInfoAlert(false)
    setShowWarningAlertSubmitData(false)
    setShowWarningAlertSubmitPass(false)
    setAlertMsg({MainInfo: "", SecondaryInfo: ""})
  }

  function handleDeviceDataChange(e){
    setDeviceData({...deviceData, [e.target.name]: e.target.value}) 
    setShowDangerAlert(false)
    setShowInfoAlert(false)
    setShowWarningAlertSubmitData(false)
    setShowWarningAlertSubmitPass(false)
  }
  
  const handleDeviceDataValidation = () => {
    closeAlert()
    axios.post(`https://${dbAddress}:4000/repair/deviceValidate`, {DeviceData: deviceData}).then(response => {
      
      closeAlert()
      axios.post(`https://${dbAddress}:4000/repair/addDevice`, {DeviceData: deviceData}).then(response => {
        setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
          setShowInfoAlert(true)
        }).catch((error) => {
          setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
          setShowDangerAlert(true)
        });
    }).catch((error) => {
        
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }
  return (
    <div className="col-12 m-2">
      Dodaj urządzenie
      {showDangerAlert && <DangerAlert Content={alertMsg} CloseAlert={closeAlert}/>}
      {showInfoAlert && <InfoAlert Content={alertMsg} CloseAlert={closeAlert}/>}

        <section>
          <div className="bookmarkBox container col-12 col-md-10 col-lg-8 col-xl-6">
            {/*For adding client*/}
            <form className="justify-content-center">
              <div className="row col-12 mx-auto">
                <div className="form-group">
                  <label htmlFor="Type">Typ</label>
                  <br/>
                  <select id="Type">
                    <option value="" selected disabled hidden>Wybierz typ urządzenia...</option>
                    <option>Laptop</option>
                    <option>Komputer</option>
                    <option>Tablet</option>
                    <option>Smartfon</option>
                    <option>Drukarka</option>
                    <option>Inne</option>
                  </select>
          
                </div>
                <div className="form-group col-12 col-md-6">
                  <label htmlFor="Name">Nazwa urządzenia</label>
                  <input type="text" className="form-control" id="Name" name="Name" onChange={handleDeviceDataChange} value={deviceData.Name} />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label htmlFor="Model">Model urządzenia</label>
                  <input type="text" className="form-control" id="Model" name="Model" onChange={handleDeviceDataChange} value={deviceData.Model} />
                </div>
                <div className="form-group">
                  <label htmlFor="Sn">Numer seryjny</label>
                  <input type="text" className="form-control" id="Sn" name="Sn" onChange={handleDeviceDataChange} value={deviceData.Sn} />
                </div>
               
              </div>
              <input type="button" className="btn btn-success col-12" onClick={handleDeviceDataValidation} value="Dodaj urządzenie" />
            </form>
          </div>
        </section>

    </div>
  );
}

export default AddDevice;