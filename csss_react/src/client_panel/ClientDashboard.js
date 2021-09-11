//Opis komponentu - będzie zawierał części wspólne dla paneli użytkowników
import React from 'react';
import { getUser, removeUserSession } from '../utils/Common';

function Dashboard(props) {
  const user = getUser();

  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    props.history.push('/LoginPanel');
  }

  return (
    <div>
      Witaj kliencie {user.name}!<br /><br />
      <input type="button" onClick={handleLogout} value="Logout" />
    </div>
  );
}

export default Dashboard;