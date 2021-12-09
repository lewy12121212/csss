import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useDidMount } from '../../common/commonFunc'
import axios from 'axios';

import { PassGenerator } from '../../../../utils/PassGenerator'
import { dbAddress } from '../../../../dbCon'
import InfoAlert from '../../../../alerts/InfoAlert'
//import WarningAlertSubmit from '../../../../alerts/WarningAlertSubmit'
import DangerAlert from '../../../../alerts/DangerAlert'

import './bookmarks.scss';


function AddEmployee(props) {
  const didMount = useDidMount();
  const [employeeData, setemployeeData] = useState({Name: "", Surname: "", Login: "", Mail: "", Phone: "", Password: "", Type: ""})
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

  function handleEmployeeDataChange(e){
    setemployeeData({...employeeData, [e.target.name]: e.target.value}) 
    setShowDangerAlert(false)
    setShowInfoAlert(false)
    //setShowWarningAlertSubmitData(false)
    //setShowWarningAlertSubmitPass(false)
  }

  //const handleGeneratePass = () => {
  //  let genPass = PassGenerator()
  //  setemployeeData({...employeeData, Password: genPass})    
  //}
  const handleGeneratePass = useCallback(() => {
    let genPass = PassGenerator()
    setemployeeData({...employeeData, Password: genPass}) 
    //setClientPassword(genPass)
  }, [setemployeeData, employeeData])

  const handlemployeeDataValidation = () => {
    console.log("Walidacja danych...")
    closeAlert()
    axios.post(`https://${dbAddress}:4000/employee/admin/dataEmployeeValidation`, {EmployeeData: employeeData}).then(response => {
      closeAlert()
      axios.post(`https://${dbAddress}:4000/employee/admin/addEmployee`, {EmployeeData: employeeData}).then(response => {
        setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo}) //set message alert in parent
        setShowInfoAlert(true) //set info in parent
      }).catch((error) => {
        setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
        setShowDangerAlert(true)
      });
    }).catch((error) => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }

  useEffect(() => { //useEfFect zamiast on click
    if(didMount) {
      console.log('mounted');
      handleGeneratePass();
    } else {
      console.log('state updated');
    }
  }, [handleGeneratePass, didMount]);

  return (
    <div className="col-12 mt-4">
      {showDangerAlert && <DangerAlert Content={alertMsg} CloseAlert={closeAlert}/>}
      {showInfoAlert && <InfoAlert Content={alertMsg} CloseAlert={closeAlert}/>}

      
      <div className="bookmarkBox container col-10">
        {/*For adding client*/}
        Dodaj pracownika
          <div className="row col-12 mx-auto">
          <div className="form-group">
              <label htmlFor="Type">Typ</label>
              <br/>
              {/*TODO - get type list from MySQL DB - future*/}
              <select value={employeeData.Type} className="form-select" id="Type" name="Type" onChange={(e) => {
                handleEmployeeDataChange(e)
                //console.log(e.target.value + ": " + e.target.name) 'Admin','Service','Manager','Coordinator'
              }}>
                <option value="none" hidden>Wybierz funkcję pracownika...</option>
                <option value="Admin" >Administrator</option>
                <option value="Service" >Serwisant</option>
                <option value="Manager" >Menadżer</option>
                <option value="Coordinator" >Koordynator</option>
              </select>
            </div>
            <div className="form-group col-12 col-md-6">
              <label htmlFor="Name">Imię</label>
              <input type="text" className="form-control" id="Name" name="Name" onChange={handleEmployeeDataChange} value={employeeData.Name} />
            </div>
            <div className="form-group col-12 col-md-6">
              <label htmlFor="Surname">Nazwisko</label>
              <input type="text" className="form-control" id="Surname" name="Surname" onChange={handleEmployeeDataChange} value={employeeData.Surname} />
            </div>
            <div className="form-group">
              <label htmlFor="Login">Login</label>
              <input type="text" className="form-control" id="Login" name="Login" onChange={handleEmployeeDataChange} value={employeeData.Login} />
            </div>
            <div className="form-group">
              <label htmlFor="Password">Hasło: </label>
              {/*<input type="text" value={employeeData.Password} className="form-control" id="Password" name="Password" onChange={handleEmployeeDataChange}/>*/}
              <input type="text" className="form-control" id="Password" name="Password" onChange={handleEmployeeDataChange} value={employeeData.Password} />
              <button className="btn btn-warning mt-2" onClick={handleGeneratePass}>Generuj hasło</button>
            </div>
            <div className="form-group">
              <label htmlFor="Mail">Mail</label>
              <input type="email" className="form-control" id="Mail" name="Mail" onChange={handleEmployeeDataChange} value={employeeData.Mail} />
            </div>
            <div className="form-group">
              <label htmlFor="Phone">Telefon</label>
              <input type="tel" className="form-control" id="Phone" name="Phone" onChange={handleEmployeeDataChange} value={employeeData.Phone} />
            </div>
          </div>
          <input type="button" className="btn btn-success col-12" onClick={handlemployeeDataValidation} value="Dodaj pracownika" />
      </div>
    </div>
  );
}

export default AddEmployee;