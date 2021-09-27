import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

//styles
//import Background from "./img/mountains.jpg";

//import Login from './users_panels/Login';
//import Home from './users_panels/Home';
//import LoginPanel from './panels/login_panel/LoginPanel'
import EmployeeDashboard from './panels/employee_panels/EmployeeDashboard'
import ClientDashboard from './panels/client_panel/ClientDashboard'
import Home from './Home'
import ClientLoginPanel from './panels/login_panel/ClientLoginPanel'
import EmployeeLoginPanel from './panels/login_panel/EmployeeLoginPanel'

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
    axios.get(`http://192.168.1.5:4000/verifyToken?token=${token}`).then(response => {
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
