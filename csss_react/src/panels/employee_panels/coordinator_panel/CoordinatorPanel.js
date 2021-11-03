import React from 'react';
import { getUser, removeUserSession } from '../../../utils/Common';

import '../../../index.scss';
import '../EmployeePanels.scss';

function CoordinatorPanel(props) {
  const user = getUser();

  const handleLogout = () => {
    removeUserSession();
    props.history.push('/');
  }

  return (
    <div style={{ color: 'white' }}>
      Nazwa użytkownika {user.Name}<br />
      Typ użytkownika: {user.Type}<br />
      Panel koordynatora

      <br /><input type="button" className="btn btn-primary" onClick={handleLogout} value="Logout" />
    </div>
  );
}

export default CoordinatorPanel;