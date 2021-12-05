import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { dbAddress } from '../../../../dbCon'
import InfoAlert from '../../../../alerts/InfoAlert'
//import WarningAlertSubmit from '../../../../alerts/WarningAlertSubmit'
import DangerAlert from '../../../../alerts/DangerAlert'
//import '../AdminPanel.scss'
//import '../../../../index.scss';
//import '../../EmployeePanels.scss';
import './bookmarks.scss';

function AddDevice(props) {
  const [deviceData, setDeviceData] = useState({ClientId: props.deviceData, Name: "", Model: "", Type: "", Sn: ""})

  const [showDangerAlert, setShowDangerAlert] = useState(false)
  const [showInfoAlert, setShowInfoAlert] = useState(false)
  //const [showWarningAlertSubmitData, setShowWarningAlertSubmitData] = useState(false)
  //const [showWarningAlertSubmitPass, setShowWarningAlertSubmitPass] = useState(false)

  const [alertMsg, setAlertMsg] = useState({MainInfo: "", SecondaryInfo: ""})


  function closeAlert(){
    setShowDangerAlert(false)
    setShowInfoAlert(false)
    //setShowWarningAlertSubmitData(false)
    //setShowWarningAlertSubmitPass(false)
    setAlertMsg({MainInfo: "", SecondaryInfo: ""})
  }

  function handleDeviceDataChange(e){
    setDeviceData({...deviceData, [e.target.name]: e.target.value}) 
    setShowDangerAlert(false)
    setShowInfoAlert(false)
    //setShowWarningAlertSubmitData(false)
    //setShowWarningAlertSubmitPass(false)
  }
  
  const handleDeviceDataValidation = () => {
    closeAlert()
    axios.post(`https://${dbAddress}:4000/repair/deviceValidate`, {DeviceData: deviceData}).then(response => {
      closeAlert()
      axios.post(`https://${dbAddress}:4000/repair/addDevice`, {DeviceData: deviceData}).then(response => {
        props.setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
        props.setShowInfoAlert(true)
        props.getDevices(deviceData.ClientId)
        props.setChoosenDevice(response.data.result.insertId)
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
    <div className="col-12 mt-2">
      {showDangerAlert && <DangerAlert Content={alertMsg} CloseAlert={closeAlert}/>}
      {showInfoAlert && <InfoAlert Content={alertMsg} CloseAlert={closeAlert}/>}

      Dodaj urządzenie
      
      <div className="bookmarkBox container col-10">
        {/*For adding client*/}
        <form className="justify-content-center">
          <div className="row col-12 mx-auto">
            <div className="form-group">
              <label htmlFor="Type">Typ</label>
              <br/>
              {/*TODO - get type list from MySQL DB - future*/}
              <select value={deviceData.Type} className="form-select" id="Type" name="Type" onChange={(e) => {
                handleDeviceDataChange(e)
                //console.log(e.target.value + ": " + e.target.name)
              }}>
                <option value="none" hidden selected="selected">Wybierz typ urządzenia...</option>
                <option value="Laptop" key="Laptop">Laptop</option>
                <option value="Komputer" key="Komputer">Komputer</option>
                <option value="Tablet" key="Tablet">Tablet</option>
                <option value="Smartfon" key="Smartfon">Smartfon</option>
                <option value="Drukarka" key="Drukarka">Drukarka</option>
                <option value="Inne" key="Inne">Inne</option>
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

    </div>
  );
}

export default AddDevice;