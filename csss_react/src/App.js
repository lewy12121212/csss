import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

import { dbAddress } from './dbCon';

//import EmployeeDashboard from './panels/employee_panels/EmployeeDashboard'
//employee_panels
import AdminPanel from './panels/employee_panels/admin_panel/AdminPanel'
import CoordinatorPanel from './panels/employee_panels/coordinator_panel/CoordinatorPanel'
import ManagerPanel from './panels/employee_panels/manager_panel/ManagerPanel'
import ServicePanel from './panels/employee_panels/service_panel/ServicePanel'

import ClientDashboard from './panels/client_panel/ClientDashboard'
import Home from './Home'
import ClientLoginPanel from './panels/login_panel/ClientLoginPanel'
import EmployeeLoginPanel from './panels/login_panel/EmployeeLoginPanel'
import ShowRepair from "./panels/repairs/ShowRepair"

import FaceRegistration from './panels/login_panel/face_recognition/FaceRegistration'
import FaceLogin from './panels/login_panel/face_recognition/FaceLogin'
import Pdf from './pdf/Pdf'
import QrGenerator from './qr_generator/QrGenerator';

import PrivateRoute from './utils/PrivateRoute';
import PublicRoute from './utils/PublicRoute';
import { getToken, removeUserSession, setUserSession } from './utils/Common';

import ClientResetPassword from './panels/login_panel/ClientResetPassword';

function App() {

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }
    //uogólnić verifyToken -> wyłuskać typ użytkownika, i uzależnić od niego zapytanie do odpowiedniej tabeli!
    axios.get(`https://${dbAddress}:4000/verifyToken?token=${token}`).then(response => {
      setUserSession(response.data.token, response.data.user);
      setAuthLoading(false);
    }).catch(error => {
      removeUserSession();
      setAuthLoading(false);
    });
  }, []);

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>
  }

  return (
    <div className="app align-items-center">
      <BrowserRouter>
        <div className="content box">
          {/* Private oraz Public Route - to komponenty importowane w nagłówkach, poprzez parametr "props" przekazują komponenty "login oraz Dashboard" */}
          <Switch>
            {/* FaceLogin for tests */}
            <PublicRoute path="/FaceRegistration" component={FaceRegistration} panelType="EmployeeCam" />
            <PublicRoute path="/FaceLogin" component={FaceLogin} panelType="EmployeeCam" />
            {/* QrCode for tests */}
            <PublicRoute path="/Qr" component={QrGenerator} panelType="QR" />
            {/* PdfGenerator for tests */}
            <PublicRoute path="/Pdf" component={Pdf} />
            {/* END TEST SECTION */}

            {/* Public login components */}
            <PublicRoute path="/ClientLoginPanel" component={ClientLoginPanel} panelType="Client" />
            <PublicRoute path="/ClientResetPassword" component={ClientResetPassword} panelType="Client" />
            <PublicRoute path="/EmployeeLoginPanel" component={EmployeeLoginPanel} panelType="Employee" />
            {/* Private components */}
            <PrivateRoute path="/ClientDashboard" component={ClientDashboard} panelType="Client" />
            <PrivateRoute path="/EmployeeDashboard/Admin" component={AdminPanel} panelType="Admin" />
            <PrivateRoute path="/EmployeeDashboard/Coordinator" component={CoordinatorPanel} panelType="Coordinator" />
            <PrivateRoute path="/EmployeeDashboard/Manager" component={ManagerPanel} panelType="Manager" />
            <PrivateRoute path="/EmployeeDashboard/Service" component={ServicePanel} panelType="Service" />
            {/*<PrivateRoute path="/Repairs/:id" component={routerProps => <ShowRepair id={routerProps.match.params.id} />} panelType="Repairs" />*/}
            <PrivateRoute path="/Repairs/:id" component={ShowRepair} panelType="Repairs" />
            {/* Main route */}
            <PublicRoute exact path="/" component={Home} />
            <Redirect to="/" />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
