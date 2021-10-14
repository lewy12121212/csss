//Opis komponentu - będzie zawierał części wspólne dla paneli użytkowników
import React from 'react';
import { getUser, removeUserSession } from '../../utils/Common';

function ClientDashboard(props) {
  const user = getUser();

  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    props.history.push('/');
  }

  return (
    <div style={{ color: 'white' }}>
      Witaj w panelu zarządzania naprawą numer: {user.RepairId}<br /><br />
      <input type="button" onClick={handleLogout} value="Logout" />
    </div>
  );
}

export default ClientDashboard;