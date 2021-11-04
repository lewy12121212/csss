import React from 'react';
import { getUser, removeUserSession } from '../../../utils/Common';

import '../../../index.scss';
import '../EmployeePanels.scss';

function AdminPanel(props) {
  const user = getUser();

  const handleLogout = () => {
    removeUserSession();
    props.history.push('/');
  }

  return (
    <div style={{ color: 'white' }}>
      Nazwa użytkownika {user.Name}<br />
      Typ użytkownika: {user.Type}<br />
      Panel administratora

      <br /><input type="button" className="btn btn-primary" onClick={handleLogout} value="Logout" />
    </div>
  );
}

export default AdminPanel;