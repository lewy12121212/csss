import React, { useState, useEffect } from 'react';
import { useDidMount } from '../../common/commonFunc'
import axios from 'axios';
import { dbAddress } from '../../../../dbCon';

import InfoAlert from '../../../../alerts/InfoAlert'
import WarningAlertSubmit from '../../../../alerts/WarningAlertSubmit'
import DangerAlert from '../../../../alerts/DangerAlert'

//import '../AdminPanel.scss'
//import '../../../../index.scss';
//import '../../EmployeePanels.scss';
import './bookmarks.scss';

function History(props) {

  const didMount = useDidMount();
  const [repairsTable, setRepairsTable] = useState([])
  const [id, setId] = useState(null)
  const [showDangerAlert, setShowDangerAlert] = useState(false)
  const [showInfoAlert, setShowInfoAlert] = useState(false)
  const [showWarningAlertSubmitData, setShowWarningAlertSubmitData] = useState(false)
  const [showWarningAlertSubmitReceived, setShowWarningAlertSubmitReceived] = useState(false)

  const [alertMsg, setAlertMsg] = useState({MainInfo: "", SecondaryInfo: ""})

  //const location = props.path.pathname;
  useEffect(() => {
    if(didMount) {
      console.log('mounted');
      axios.get(`https://${dbAddress}:4000/employee/admin/allClosedRepair`).then(response => {
        setRepairsTable(response.data.data)
        console.log(response.data.data)

      });
    } else {
      console.log('state updated');
    }
  }, [setRepairsTable, repairsTable, didMount]);

  function closeAlert(){
    setShowDangerAlert(false)
    setShowInfoAlert(false)
    setShowWarningAlertSubmitData(false)
    setShowWarningAlertSubmitReceived(false)
    setAlertMsg({MainInfo: "", SecondaryInfo: ""})
  }

  const handleReopenRepair = (ID) => {
    closeAlert()

    setId(ID);
    
    setAlertMsg({MainInfo: "Otworzenie zlecenia.", SecondaryInfo: `Czy na pewno ponownie otworzyć zlecenie ${ID}?`})
    setShowWarningAlertSubmitData(true)
  }

  const handleCommitChanges = () => {

    closeAlert()

    axios.post(`https://${dbAddress}:4000/employee/admin/reopenRepair`, {Id: id}).then(response => {
      setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
      setShowInfoAlert(true)

      axios.get(`https://${dbAddress}:4000/employee/admin/allClosedRepair`).then(response => {
        setRepairsTable(response.data.data)

      });
    }).catch((error) => {
      setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      setShowDangerAlert(true)
    });
  }


  const handleChangeReceived = (ID) => {
    closeAlert()

    setId(ID);
    
    setAlertMsg({MainInfo: "Przeniesienie zlecenia.", SecondaryInfo: `Czy na pewno przenieść zlecenie ${ID} do oczekujących?`})
    setShowWarningAlertSubmitReceived(true)
  }

  const handleCommitReceived = () => {
    closeAlert()

    axios.post(`https://${dbAddress}:4000/employee/admin/changeReceived`, {Id: id}).then(response => {
      setAlertMsg({MainInfo: response.data.mainInfo, SecondaryInfo: response.data.secondaryInfo})
      setShowInfoAlert(true)

      axios.get(`https://${dbAddress}:4000/employee/admin/allClosedRepair`).then(response => {
        setRepairsTable(response.data.data)

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
      {/*ponowne otworzenie*/}
      {showWarningAlertSubmitData && <WarningAlertSubmit Content={alertMsg} Func={handleCommitChanges} CloseAlert={closeAlert}/>}
      {/*przeniesienie do oczekujących na odbiór*/}
      {showWarningAlertSubmitReceived && <WarningAlertSubmit Content={alertMsg} Func={handleCommitReceived} CloseAlert={closeAlert}/>}
      Lista zleceń
      <div className="table-responseive" >
        
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col" rowSpan="2">Id</th>          
              <th scope="col" colSpan="3">Dane urządzenia</th>
              <th scope="col" colSpan="1" rowSpan="2">Dane klienta</th>
              <th scope="col" rowSpan="2">Login serwisanta</th>
              <th scope="col" rowSpan="2" colSpan="2">Edycja</th>
            </tr>
            <tr>
              <th scope="col">Data przyjęcia</th>             
              <th scope="col">Typ</th>
              <th scope="col">Model</th>

            </tr>
          </thead>
          <tbody>
          {repairsTable.map((data) => 

            <tr key={data.Id}>   
              <td>{data.Id}</td>

              <td>{data.CreationDate.slice(0,10)}</td>
              <td>{data.DeviceType}</td>
              <td>{data.DeviceName + ' ' +data.DeviceModel}</td>

              <td>{data.ClientName}</td>


              <td>{data.EmployeeLogin}</td>

              <td><button className="btn btn-warning mt-2"  onClick={() => handleReopenRepair(data.Id)}>Otwórz ponownie zlecenie</button></td>
              <td><button className="btn btn-warning mt-2"  onClick={() => handleChangeReceived(data.Id)} disabled={!data.IfReceived}>Przenieś do niedostarczonych</button></td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;