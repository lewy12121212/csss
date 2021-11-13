import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { dbAddress } from '../../../dbCon'

import InfoAlert from '../../../alerts/InfoAlert'
//import WarningAlertSubmit from '../../../alerts/WarningAlertSubmit'
import DangerAlert from '../../../alerts/DangerAlert'

import './common.scss';

function Settings(props) {
  const [userData, setUserData] = useState(JSON.parse(props.userData))
  const [userPass, setUserPass] = useState({NewPass: "", NewRePass: ""})

  const [showDangerAlert, setShowDangerAlert] = useState(false)
  const [showInfoAlert, setShowInfoAlert] = useState(false)
  //const [showWarningAlertSubmitData, setShowWarningAlertSubmitData] = useState(false)
  //const [showWarningAlertSubmitPass, setShowWarningAlertSubmitPass] = useState(false)

  const [alertMsg, setAlertMsg] = useState({MainInfo: "", SecondaryInfo: ""})

  function handleUserDataChange(e){
    setUserData({...userData, [e.target.name]: e.target.value}) 
    setShowDangerAlert(false)
    setShowInfoAlert(false)
    //setShowWarningAlertSubmitData(false)
    //setShowWarningAlertSubmitPass(false)
  }

  function handleUserPassChange(e){
    setUserPass({...userPass, [e.target.name]: e.target.value})
    setShowDangerAlert(false)
    setShowInfoAlert(false)
    //setShowWarningAlertSubmitData(false)
    //setShowWarningAlertSubmitPass(false)
  }

  function closeAlert(){
    setShowDangerAlert(false)
    setShowInfoAlert(false)
    //setShowWarningAlertSubmitData(false)
    //setShowWarningAlertSubmitPass(false)
    setAlertMsg({MainInfo: "", SecondaryInfo: ""})
  }

  //const handleCommitChangesWarning = () => {
  //  setShowWarningAlertSubmitData(true)
  //  setAlertMsg({MainInfo: "Dane użytkownika zostaną zmienione.", SecondaryInfo: "Czy na pewno chcesz wprowadzić zmiany?"})
  //}
  //
  //const handleCommitPassChangesWarning = () => {
  //  setShowWarningAlertSubmitPass(true)
  //  setAlertMsg({MainInfo: "Hasło użytkownika zostanie zmienione.", SecondaryInfo: "Czy na pewno chcesz wprowadzić zmiany?"})
  //}

  const handleCommitChanges = () => {
    console.log("Zmiana danych...")
    closeAlert()
    axios.post(`http://${dbAddress}:4000/employee/common/changeInfo`, {UserData: userData}).then(response => {
      setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
      setShowInfoAlert(true)
    }).catch((error) => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }

  const handleCommitPassChanges = () => {
    console.log("Zmiana hasła...")
    closeAlert()
    axios.post(`http://${dbAddress}:4000/employee/common/changePassword`, {UserPass: userPass, Id: userData.Id}).then(response => {
      setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
      setShowInfoAlert(true)
      setUserPass({NewPass: "", NewRePass: ""})
      
    }).catch((error) => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }

  return (
    <div className="col-12">
      <div className="bookmarkBox container col-12 col-md-10 col-lg-8 col-xl-6">
        {showDangerAlert && <DangerAlert Content={alertMsg} CloseAlert={closeAlert}/>}
        {showInfoAlert && <InfoAlert Content={alertMsg} CloseAlert={closeAlert}/>}
        {/*showWarningAlertSubmitData && <WarningAlertSubmit Content={alert} Func={handleCommitChanges} CloseAlert={closeAlert}/>*/}
        {/*showWarningAlertSubmitPass && <WarningAlertSubmit Content={alert} Func={handleCommitPassChanges} CloseAlert={closeAlert}/>*/}

        {/*For user settings*/}
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
      </div>
      <hr />
      {/*For pass change*/}
      <div className="bookmarkBox container col-12 col-md-10 col-lg-8 col-xl-6">
        Zmiana hasła
        <form className="justify-content-center">
          <div className="form-group">
            <label htmlFor="NewPass">Nowe hasło</label>
            <input type="password" className="form-control col-12" id="NewPass" name="NewPass" onChange={handleUserPassChange} value={userPass.NewPass}/>
          </div>
          <div className="form-group">
            <label htmlFor="NewRePass">Powtórz hasło</label>
            <input type="password" className="form-control col-12" id="NewRePass" name="NewRePass" onChange={handleUserPassChange} value={userPass.NewRePass}/>
          </div>
          <input type="button" className="btn btn-warning col-12" onClick={handleCommitPassChanges} value="Zmień hasło" />
        </form>
      </div>
      <hr />
      {/*For face registration*/}
      <div className="bookmarkBox container col-12 col-md-10 col-lg-8 col-xl-6">
        Rejestracja twarzy
        <input type="button" className="btn btn-danger col-12" value="Zarejestruj twarz" />
      </div>
    </div>
  );
}

export default Settings;