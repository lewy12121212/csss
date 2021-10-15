import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

import { dbAddress } from './dbCon';

import EmployeeDashboard from './panels/employee_panels/EmployeeDashboard'
import ClientDashboard from './panels/client_panel/ClientDashboard'
import Home from './Home'
import ClientLoginPanel from './panels/login_panel/ClientLoginPanel'
import EmployeeLoginPanel from './panels/login_panel/EmployeeLoginPanel'
import Pdf from './pdf/Pdf'

import PrivateRoute from './utils/PrivateRoute';
import PublicRoute from './utils/PublicRoute';
import { getToken, removeUserSession, setUserSession } from './utils/Common';

function App() {

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }

    //uogólnić verifyToken -> wyłuskać typ użytkownika, i uzależnić od niego zapytanie do odpowiedniej tabeli!
    axios.get(`http://${dbAddress}:4000/verifyToken?token=${token}`).then(response => {
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
            <PublicRoute path="/Pdf" component={Pdf} />
            {/* Public login components */}
            <PublicRoute path="/ClientLoginPanel" component={ClientLoginPanel} panelType="Client" />
            <PublicRoute path="/EmployeeLoginPanel" component={EmployeeLoginPanel} panelType="Employee" />
            {/* Private components */}
            <PrivateRoute path="/ClientDashboard" component={ClientDashboard} panelType="Client" />
            <PrivateRoute path="/EmployeeDashboard" component={EmployeeDashboard} panelType="Employee" />
            {/* Main route*/}
            <PublicRoute exact path="/" component={Home} />
            <Redirect to="/" />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
