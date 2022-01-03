import React, {useEffect} from 'react';
//import axios from 'axios';
//import { useDidMount } from '../employee_panels/common/commonFunc';
import { getUser, removeUserSession } from '../../utils/Common';
//import { dbAddress } from '../../dbCon';
//import ReactToPrint from 'react-to-print';
import ShowRepairService from './ShowRepairService';
import ShowRepairClient from './ShowRepairClient';
import ShowRepairCoord from './ShowRepairCoord';

import './repair.scss'

function ShowRepair(props) {
  //const didMount = useDidMount();
  const user = getUser();

  const handleLogout = () => {
    removeUserSession();
    props.history.push('/');
  }

  useEffect(() => {
    const handleInvalidToken = e => {
      if (e.key === 'token' && e.oldValue && !e.newValue) {
        props.history.push('/');
      }
    }
    window.addEventListener('storage', handleInvalidToken)
    return function cleanup() {
      window.removeEventListener('storage', handleInvalidToken)
    }
  }, [props])

  console.log(user)
  if(user.Type === "Client"){
    return (<ShowRepairClient linkId={props.match.params.id} handleLogout={handleLogout} history={props.history}/>)
  } else if(user.Type === 'Service'){
    return (<ShowRepairService linkId={props.match.params.id} handleLogout={handleLogout} history={props.history}/>)
  } else if(user.Type === 'Coordinator'){
    return (<ShowRepairCoord linkId={props.match.params.id} handleLogout={handleLogout} history={props.history}/>)
  }
}

export default ShowRepair;