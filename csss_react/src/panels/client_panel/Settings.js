import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { dbAddress } from '../../dbCon'

import InfoAlert from '../../alerts/InfoAlert'
import DangerAlert from '../../alerts/DangerAlert'

import PasswordStrengthBar from 'react-password-strength-bar';

import '../employee_panels/common/common.scss';

function Settings(props) {
  const [userData, setUserData] = useState(JSON.parse(props.userData))
  const [userPass, setUserPass] = useState({OldPass: "", NewPass: "", NewRePass: ""})

  const tokenData = JSON.parse(props.userData);
  const [verifyCode, setVerifyCode] = useState(false);
  const [verifyCodePass, setVerifyCodePass] = useState(false);
  const [code, setCode] = useState(null);

  const [showDangerAlert, setShowDangerAlert] = useState(false)
  const [showInfoAlert, setShowInfoAlert] = useState(false)

  
  
  const [alertMsg, setAlertMsg] = useState({MainInfo: "", SecondaryInfo: ""})

  function handleUserDataChange(e){
    setUserData({...userData, [e.target.name]: e.target.value}) 
    setShowDangerAlert(false)
    setShowInfoAlert(false)

  }

  function handleUserPassChange(e){
    setUserPass({...userPass, [e.target.name]: e.target.value})
    setShowDangerAlert(false)
    setShowInfoAlert(false)

  }

  function closeAlert(){
    setShowDangerAlert(false)
    setShowInfoAlert(false)

    setAlertMsg({MainInfo: "", SecondaryInfo: ""})
  }

  //FOR DATA USER
  const handleUserDataValidation = () => {
    console.log("Walidacja danych...")
    closeAlert()
    axios.post(`https://${dbAddress}:4000/client/dataValidation`, {ClientData: userData, Mail: tokenData.Mail, Phone: tokenData.Phone}).then(response => {
      setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
      setShowInfoAlert(true)
      setVerifyCode(true)

    }).catch((error) => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }

  const handleCommitChanges = () => {
    console.log("Zmiana danych...")
    closeAlert()
    
    axios.post(`https://${dbAddress}:4000/client/changeData`, {ClientData: userData, VerifyCode:code, Mail: tokenData.Mail}).then(response => {
      setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
      setShowInfoAlert(true)
      setVerifyCode(false)
    }).catch((error) => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }

  function handleCodeChange(e){
    setCode(e.target.value);
    console.log(code)
  }

  //FOR USER PASS
  const handlePasswordValidation = () => {
    console.log("Walidacja danych...")
    closeAlert()
    axios.post(`https://${dbAddress}:4000/client/passwordValidation`, {ClientPass: userPass, Id: tokenData.Id, Mail: tokenData.Mail, Phone: tokenData.Phone}).then(response => {
      setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
      setShowInfoAlert(true)
      setVerifyCodePass(true);
    }).catch((error) => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }

  const handleCommitPassChanges = () => {
    console.log("Zmiana hasła...")
    closeAlert()
    axios.post(`https://${dbAddress}:4000/client/changePassword`, {ClientPass: userPass.NewPass, Mail: tokenData.Mail, Code: code}).then(response => {
      setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
      setShowInfoAlert(true)
      setUserPass({OldPass: "", NewPass: "", NewRePass: ""})
      setVerifyCodePass(false)
      
    }).catch((error) => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }

  return (
    <div className="col-12">
      {showDangerAlert && <DangerAlert Content={alertMsg} CloseAlert={closeAlert}/>}
      {showInfoAlert && <InfoAlert Content={alertMsg} CloseAlert={closeAlert}/>}

      <section>
      <div className="bookmarkBox container col-12 col-md-10 col-lg-8 col-xl-6">
        {/*For user settings*/}
        Ustawienia konta
        <form className="justify-content-center">
          {!verifyCode &&
          <div>
            <div className="row col-12 mx-auto">
              <div className="form-group col-12 col-md-6">
                <label htmlFor="FirstName">Imię</label>
                <input type="text" className="form-control" id="FirstName" name="FirstName" onChange={handleUserDataChange} defaultValue={userData.FirstName} />
              </div>
              <div className="form-group col-12 col-md-6">
                <label htmlFor="Surname">Nazwisko</label>
                <input type="text" className="form-control" id="Surname" name="Surname" onChange={handleUserDataChange} defaultValue={userData.Surname} />
              </div>
              {userData.IsCompany === 1 &&
                <div className="form-group">
                  <label htmlFor="Name">Nazwa Firmy</label>
                  <input type="text" className="form-control" id="Name" name="Name" onChange={handleUserDataChange} defaultValue={userData.Name} readOnly />
                </div>
              }
              <div className="form-group">
                <label htmlFor="Mail">Mail</label>
                <input type="email" className="form-control" id="Mail" name="Mail" onChange={handleUserDataChange} defaultValue={userData.Mail} />
              </div>
              <div className="form-group">
                <label htmlFor="Phone">Telefon</label>
                <input type="tel" className="form-control" id="Phone" name="Phone" onChange={handleUserDataChange} defaultValue={userData.Phone} />
              </div>
              <div className="form-group">
                <label htmlFor="Address">Adres</label>
                <input type="text" className="form-control" id="Address" name="Address" onChange={handleUserDataChange} defaultValue={userData.Address} />
              </div>
              <div className="form-group">
                <label htmlFor="City">Miasto</label>
                <input type="text" className="form-control" id="City" name="City" onChange={handleUserDataChange} defaultValue={userData.City} />
              </div>
              <div className="form-group">
                <label htmlFor="PostalCode">Kod pocztowy</label>
                <input type="text" className="form-control" id="PostalCode" name="PostalCode" onChange={handleUserDataChange} defaultValue={userData.PostalCode} />
              </div>
            </div>
            <input type="button" className="btn btn-success col-12" onClick={handleUserDataValidation} value="Zatwierdź zmiany" />
          </div>
          }
          {verifyCode &&
          <div>
            <div className="form-group">
              <label htmlFor="Code">Kod weryfikacyjny</label>
              <input type="text" className="form-control" id="Code" name="Code" onChange={handleCodeChange} />
            </div>
            <input type="button" className="btn btn-success col-12" onClick={handleCommitChanges} value="Wyślij" />
          </div>
          }
        </form>
      </div>
      <hr />
      {/*For pass change*/}
      <div className="bookmarkBox container col-12 col-md-10 col-lg-8 col-xl-6">
        Zmiana hasła
        <form className="justify-content-center">
          {!verifyCodePass &&
            <div>
              <div className="form-group">
                <label htmlFor="OldPass">Obecne hasło</label>
                <input type="password" className="form-control col-12" id="OldPass" name="OldPass" onChange={handleUserPassChange} value={userPass.OldPass}/>
              </div>
              <div className="form-group">
                <label htmlFor="NewPass">Nowe hasło</label>
                <input type="password" className="form-control col-12" id="NewPass" name="NewPass" onChange={handleUserPassChange} value={userPass.NewPass}/>
                <PasswordStrengthBar password={userPass.NewPass} scoreWords={["słabe", "średnie", "dobre", "bardzo dobre", "silne"]} shortScoreWord={["Zbyt krótkie"]} minLength={6}/>
              </div>
              <div className="form-group">
                <label htmlFor="NewRePass">Powtórz hasło</label>
                <input type="password" className="form-control col-12" id="NewRePass" name="NewRePass" onChange={handleUserPassChange} value={userPass.NewRePass}/>
                <PasswordStrengthBar password={userPass.NewRePass} scoreWords={["słabe", "średnie", "dobre", "bardzo dobre", "silne"]} shortScoreWord={["Zbyt krótkie"]} minLength={6}/>
              </div>
              <input type="button" className="btn btn-warning col-12" onClick={handlePasswordValidation} value="Zmień hasło" />
            </div>
          }
          

          {verifyCodePass &&
          <div>
            <div className="form-group">
              <label htmlFor="Code">Kod weryfikacyjny</label>
              <input type="text" className="form-control" id="Code" name="Code" onChange={handleCodeChange} />
            </div>
            <input type="button" className="btn btn-success col-12" onClick={handleCommitPassChanges} value="Wyślij" />
          </div>
          }

        </form>
      </div>
      <hr />
      </section>

      
    </div>
  );

}

export default Settings;