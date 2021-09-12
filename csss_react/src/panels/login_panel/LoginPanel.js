import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession } from '../../utils/Common';

import ClientLoginPanel from './ClientLoginPanel';
import UsersLoginPanel from './UsersLoginPanel';

function LoginPanel(props) {

  return (
    <div>
      <div className="localLoginPanel">
        <UsersLoginPanel {...props} />
      </div>
      <div className="lacalLoginPanel">
        <ClientLoginPanel {...props} />
      </div>
    </div>
  );
}

export default LoginPanel;