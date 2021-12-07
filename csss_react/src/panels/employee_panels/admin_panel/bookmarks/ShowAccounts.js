import React, { useState, useEffect } from 'react';
import { useDidMount } from '../../common/commonFunc'
import axios from 'axios';
import { PassGenerator } from '../../../../utils/PassGenerator'
import { dbAddress } from '../../../../dbCon';

import InfoAlert from '../../../../alerts/InfoAlert'
import WarningAlertSubmit from '../../../../alerts/WarningAlertSubmit'
import DangerAlert from '../../../../alerts/DangerAlert'

//import { useState, useEffect } from 'react';
//import { dbAddress } from '../../../../dbCon';
//import axios from 'axios';
//import 'bootstrap/dist/css/bootstrap.min.css';

import './bookmarks.scss';

function ShowAccount(props) {

  const didMount = useDidMount();
  const [employeesTable, setEmployeesTable] = useState([])
  const [employeeData, setEmployeeData] = useState({Login: "", Password: ""})
  const [showDangerAlert, setShowDangerAlert] = useState(false)
  const [showInfoAlert, setShowInfoAlert] = useState(false)
  const [showWarningAlertSubmitData, setShowWarningAlertSubmitData] = useState(false)
  const [showWarningAlertSubmitDel, setShowWarningAlertSubmitDel] = useState(false)
  const [alertMsg, setAlertMsg] = useState({MainInfo: "", SecondaryInfo: ""})


  function closeAlert(){
    setShowDangerAlert(false)
    setShowInfoAlert(false)
    setShowWarningAlertSubmitData(false)
    setShowWarningAlertSubmitDel(false)
    setAlertMsg({MainInfo: "", SecondaryInfo: ""})
  }


  //const location = props.path.pathname;
  useEffect(() => {
    if(didMount) {
      console.log('mounted');
      axios.get(`https://${dbAddress}:4000/employee/admin/getUsersTable`).then(response => {
        setEmployeesTable(response.data.data)
        console.log(response.data.data)

      });
    } else {
      console.log('state updated');
    }
  }, [setEmployeesTable, employeesTable, didMount]);

  const handleResetPass = (login) => {

    closeAlert()

    let genPass = PassGenerator();
    setEmployeeData({Login: login, Password: genPass});

    setAlertMsg({MainInfo: "Reset hasła.", SecondaryInfo: `Czy na pewno zresetować hasło użytkownikowi ${login}.`})
    setShowWarningAlertSubmitData(true)
    
    //setClientPassword(genPass)
  }


  const handleDelAccount = (login) => {

    closeAlert()

    setEmployeeData({Login: login});

    setAlertMsg({MainInfo: "Usunięcie konta.", SecondaryInfo: `Czy na pewno usunąć konto pracownika ${login}.`})
    setShowWarningAlertSubmitDel(true)
    
    //setClientPassword(genPass)
  }


  const handleCommitChanges = () => {
    
    closeAlert()

    axios.post(`https://${dbAddress}:4000/employee/admin/resetPassword`, {EmployeeData: employeeData}).then(response => {
      setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
      setShowInfoAlert(true)
    }).catch((error) => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }


  const handleDelete = () => {

    closeAlert()

    axios.post(`https://${dbAddress}:4000/employee/admin/deleteAccount`, {EmployeeData: employeeData}).then(response => {
      setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
      setShowInfoAlert(true)
    }).catch((error) => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });

  }

  return (
    <div className="bookmarkBox container col-12 col-md-10 col-lg-8">

      {showDangerAlert && <DangerAlert Content={alertMsg} CloseAlert={closeAlert}/>}
      {showInfoAlert && <InfoAlert Content={alertMsg} CloseAlert={closeAlert}/>}
      {/*reset hasła*/}
      {showWarningAlertSubmitData && <WarningAlertSubmit Content={alertMsg} Func={handleCommitChanges} CloseAlert={closeAlert}/>}
      {/*usunięcie konta*/}
      {showWarningAlertSubmitDel && <WarningAlertSubmit Content={alertMsg} Func={handleDelete} CloseAlert={closeAlert}/>}

      Informacje o użytkownikach

      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Stanowisko</th>
            <th scope="col">Login</th>
            <th scope="col">Imię</th>
            <th scope="col">Nazwisko</th>
            <th scope="col">Numer telefonu</th>
            <th scope="col">Adres email</th>
          </tr>
        </thead>
        <tbody>
          {employeesTable.map((data) => 
            <tr key={data.Id}>
              <td>{data.Type}</td>
              <td>{data.Login}</td>
              <td>{data.Name}</td>
              <td>{data.Surname}</td>
              <td>{data.Phone}</td>
              <td>{data.Mail}</td>

              <td><button className="btn btn-warning mt-2"  onClick={() => handleResetPass(data.Login)}>Resetuj hasło</button></td>
              <td><button className="btn btn-danger mt-2"  onClick={() => handleDelAccount(data.Login)}>Usuń konto</button></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ShowAccount;