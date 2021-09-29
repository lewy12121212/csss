//Opis komponentu - będzie zawierał części wspólne dla paneli użytkowników
import React from 'react';
import { getUser, removeUserSession } from '../../utils/Common';

import { Route } from 'react-router-dom';

import AdminPanel from './admin_panel/AdminPanel';
import ManagerPanel from './manager_panel/ManagerPanel';
import ServicePanel from './service_panel/ServicePanel';


function EmployeeDashboard(props) {
  const user = getUser();

  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    props.history.push('/');
  }

  return (
    <div style={{ color: 'white' }}>
      Witaj użytkowniku {user.Name}!<br /><br />

      <Route path="/EmployeeDashboard/admin" component={AdminPanel} />
      <Route path="/EmployeeDashboard/manager" component={ManagerPanel} />
      <Route path="/EmployeeDashboard/service" component={ServicePanel} />

      <input type="button" onClick={handleLogout} value="Logout" />
    </div>
  );
}

export default EmployeeDashboard;