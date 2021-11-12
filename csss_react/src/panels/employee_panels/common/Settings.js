import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { dbAddress } from '../../../dbCon'

import InfoAlert from '../../../alerts/InfoAlert'
import WarningAlert from '../../../alerts/WarningAlert'
import DangerAlert from '../../../alerts/DangerAlert'

import './common.scss';

function Settings(props) {
  const [userData, setUserData] = useState(JSON.parse(props.userData))
  const [showDangerAlert, setShowDangerAlert] = useState(false)
  const [showInfoAlert, setShowInfoAlert] = useState(false)
  const [showWarningAlert, setShowWarningAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState({MainInfo: "", SecondaryInfo: ""})

  function handleUserDataChange(e){
    setUserData({...userData, [e.target.name]: e.target.value}) 
    setShowDangerAlert(false)
  }

  function closeAlert(){
    setShowDangerAlert(false)
    setShowInfoAlert(false)
    setShowWarningAlert(false)
    setAlertMsg({MainInfo: "", SecondaryInfo: ""})
  }

  const handleCommitChanges = () => {
    console.log("Zmiana danych....")
    closeAlert()
    axios.post(`http://${dbAddress}:4000/employee/common/changeInfo`, { UserData: userData}).then(response => {
      setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
      setShowInfoAlert(true)
    }).catch((error) => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }

  return (
    <div className="bookmarkBox container col-12 col-md-10 col-lg-8">
      Ustawienia konta
      <form className="justify-content-center">
        <div className="row col-12 mx-auto">
          <div className="form-group col-12 col-md-6">
            <label htmlFor="Name">Imię</label>
            <input type="text" className="form-control" id="Name" name="Name" onChange={handleUserDataChange} defaultValue={userData.Name} />
          </div>
          <div className="form-group col-12 col-md-6">
            <label htmlFor="Surname">Nazwisko</label>
            <input type="text" className="form-control" id="Surname" name="Surname" onChange={handleUserDataChange} defaultValue={userData.Surname} />
          </div>
          <div className="form-group">
            <label htmlFor="Login">Login</label>
            <input type="text" className="form-control" id="Login" name="Login" onChange={handleUserDataChange} defaultValue={userData.Login} />
          </div>
          <div className="form-group">
            <label htmlFor="Mail">Mail</label>
            <input type="email" className="form-control" id="Mail" name="Mail" onChange={handleUserDataChange} defaultValue={userData.Mail} />
          </div>
          <div className="form-group">
            <label htmlFor="Phone">Telefon</label>
            <input type="tel" className="form-control" id="Phone" name="Phone" onChange={handleUserDataChange} defaultValue={userData.Phone} />
          </div>
        </div>
        <input type="button" className="btn btn-success col-12" onClick={handleCommitChanges} value="Zatwierdź zmiany" />
      </form>
      {showDangerAlert && <DangerAlert Content={alertMsg} CloseAlert={closeAlert}/>}
      {showInfoAlert && <InfoAlert Content={alertMsg} CloseAlert={closeAlert}/>}
    </div>
  );
}

export default Settings;