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


function AddClient(props) {
  const [clientData, setClientData] = useState({FirstName: "", Surname: "", Name: "", Mail: "", Phone: "", Password: "", Address: "", City: "", PostalCode: ""})

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

  function handleClientDataChange(e){
    setClientData({...clientData, [e.target.name]: e.target.value}) 
    setShowDangerAlert(false)
    setShowInfoAlert(false)
    setShowWarningAlertSubmitData(false)
    setShowWarningAlertSubmitPass(false)
  }
  //FOR ADD CLIENT

  const handleClientDataValidation = () => {
    console.log("Walidacja danych...")
    closeAlert()
    axios.post(`https://${dbAddress}:4000/repair/clientValidate`, {ClientData: clientData}).then(response => {
      
      closeAlert()
      axios.post(`https://${dbAddress}:4000/repair/addNewClient`, {ClientData: clientData}).then(response => {
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
    <div className="col-12">

      {showDangerAlert && <DangerAlert Content={alertMsg} CloseAlert={closeAlert}/>}
      {showInfoAlert && <InfoAlert Content={alertMsg} CloseAlert={closeAlert}/>}


      Dodaj klienta
        <section>
          <div className="bookmarkBox container col-12 col-md-10 col-lg-8 col-xl-6">
            {/*For adding client*/}
            <form className="justify-content-center">
              <div className="row col-12 mx-auto">
                <div className="form-group col-12 col-md-6">
                  <label htmlFor="Name">Imię</label>
                  <input type="text" className="form-control" id="FirstName" name="FirstName" onChange={handleClientDataChange} value={clientData.FirstName} />
                </div>
                <div className="form-group col-12 col-md-6">
                  <label htmlFor="Surname">Nazwisko</label>
                  <input type="text" className="form-control" id="Surname" name="Surname" onChange={handleClientDataChange} value={clientData.Surname} />
                </div>
                <div className="form-group">
                  <label htmlFor="Name">Nazwa firmy</label>
                  <input type="text" className="form-control" id="Name" name="Name" onChange={handleClientDataChange} value={clientData.Name} />
                </div>
                <div className="form-group">
                  <label htmlFor="Mail">Mail</label>
                  <input type="email" className="form-control" id="Mail" name="Mail" onChange={handleClientDataChange} value={clientData.Mail} />
                </div>
                <div className="form-group">
                  <label htmlFor="Phone">Telefon</label>
                  <input type="tel" className="form-control" id="Phone" name="Phone" onChange={handleClientDataChange} value={clientData.Phone} />
                </div>
                <div className="form-group">
                  <label htmlFor="Password">Hasło</label>
                  <input type="text" className="form-control" id="Password" name="Password" onChange={handleClientDataChange} value={clientData.Password} />
                </div>
                <div className="form-group">
                  <label htmlFor="Address">Adres</label>
                  <input type="text" className="form-control" id="Address" name="Address" onChange={handleClientDataChange} value={clientData.Address} />
                </div>
                <div className="form-group">
                  <label htmlFor="Addrress">Miasto</label>
                  <input type="text" className="form-control" id="City" name="City" onChange={handleClientDataChange} value={clientData.City} />
                </div>
                <div className="form-group">
                  <label htmlFor="Addrress">Kod pocztowy</label>
                  <input type="text" className="form-control" id="PostalCode" name="PostalCode" onChange={handleClientDataChange} value={clientData.PostalCode} />
                </div>
              </div>
              <input type="button" className="btn btn-success col-12" onClick={handleClientDataValidation} value="Dodaj klienta" />
            </form>
          </div>
        </section>

    </div>
  );
}

export default AddClient;