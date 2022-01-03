import React, { useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import { useDidMount } from '../employee_panels/common/commonFunc';
import { dbAddress } from '../../dbCon';
import InfoAlert from '../../alerts/InfoAlert'
import WarningAlertSubmit from '../../alerts/WarningAlertSubmit'
import DangerAlert from '../../alerts/DangerAlert'

import StatusBox from './StatusBox'

import './repair.scss'

function Device(props) {
  const didMount = useDidMount();

  const [jsonDescription, setJsonDescription] = useState([]);


  const [showDangerAlert, setShowDangerAlert] = useState(false)
  const [showWarningAlert, setShowWarningAlert] = useState(false)
  const [showInfoAlert, setShowInfoAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState({MainInfo: "", SecondaryInfo: ""})
  //const [privateDescription, setPrivateDescription] = useState("")

  function closeAlert(){
    setShowDangerAlert(false)
    setShowWarningAlert(false)
    setShowInfoAlert(false)
    setAlertMsg({MainInfo: "", SecondaryInfo: ""})
  }

  const selectRepair = useCallback(() => {
    axios.post(`https://${dbAddress}:4000/client/DeviceRepairs`, {DeviceId: props.Id}).then(response => {
      console.log(response.data.data)
      let jsonArray = []
      response.data.data.forEach((row)=>{
        let toAdd = JSON.parse(row.Description).repair.reverse()
        jsonArray.push(toAdd)
      })
      console.log(jsonArray)
      console.log(JSON.parse(response.data.data[0].Description))
      setJsonDescription(jsonArray)
    }).catch((error) => {
      //setAlertMsg({MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo})
      //setShowDangerAlert(true)
    });
  }, [setJsonDescription, props])

  useEffect(() => {

    if(didMount) {
      console.log('mounted');
      selectRepair()
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
  }, [props, didMount, setJsonDescription, selectRepair])



  return (
    <div className="mainRepairBox container col-11 col-md-10 mt-4 mb-4">
      {showDangerAlert && <DangerAlert Content={alertMsg} CloseAlert={closeAlert}/>}
      {showWarningAlert && <WarningAlertSubmit Content={alertMsg} CloseAlert={closeAlert}/>}
      {showInfoAlert && <InfoAlert Content={alertMsg} CloseAlert={closeAlert}/>}

      <div className="d-flex justify-content-center p-2 bd-highlight">
        <input type="button" className="btn btn-warning" onClick={() => {props.changeRender(false)}} value="Wróć" />
      </div>
      <div className="row text-center">
        <div className="col-12 mt-2">
          <hr />
          <h5>Historia czynności zlecenia</h5>
          {/*jsonDescription.repair[0]*/}
          {jsonDescription.map((data) => (
            data.map((row) => (
              <div key={`${row.Time}${row.Data}`}>
                <StatusBox data={row} />
              </div>
            ))
          ))}
          <hr />
        </div>
      </div>
      
    </div>
  );
}

export default Device;