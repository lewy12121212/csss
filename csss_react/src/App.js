import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import axios from 'axios';

//import Login from './users_panels/Login';
//import Home from './users_panels/Home';
import LoginPanel from './panels/login_panel/LoginPanel'
import UsersDashboard from './panels/users_panels/UsersDashboard';
import ClientDashboard from './panels/client_panel/ClientDashboard'

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

    axios.get(`http://localhost:4000/verifyToken?token=${token}`).then(response => {
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
    <div className="app">
      <BrowserRouter>
        <div className="content">
          {/* Private oraz Public Route - to komponenty importowane w nagłówkach, poprzez parametr "props" przekazują komponenty "login oraz Dashboard" */}
          <Switch>
            <PublicRoute exact path="/" component={LoginPanel} />
            <PublicRoute path="/LoginPanel" component={LoginPanel} />
            <PrivateRoute path="/UsersDashboard" componentClient={ClientDashboard} componentUsers={UsersDashboard}/>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
