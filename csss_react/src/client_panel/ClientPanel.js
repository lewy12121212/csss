import React, { useState } from 'react';
//import axios from 'axios';
//import { setUserSession } from '../../utils/Common';

function ClientPanel(props) {
  const [loading, setLoading] = useState(false);
  const clientId = useFormInput('');
  const [error, setError] = useState(null);

  // handle button click of login form
  const handleLogin = () => {
    alert("ClientPanel")
  }

  return (
    <div>
      Id klienta<br /><br />
      <div>
        <input type="text" {...clientId} autoComplete="new-password" />
      </div>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} /><br />
    </div>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default ClientPanel;