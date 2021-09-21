import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession } from '../../utils/Common';

function ClientLoginPanel(props) {
  const [loading, setLoading] = useState(false);
  const repairId = useFormInput('');
  const email = useFormInput('');
  const [error, setError] = useState(null);

  const handleHomeBack = () => {
    props.history.push("/");
  }
  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    axios.post('http://localhost:4000/clients/signin', { email: email.value, repairId: repairId.value }).then(response => {
      setLoading(false);
      setUserSession(response.data.token, response.data.user);
      props.history.push('/ClientsDashboard');
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    });
  }

  return (
    <div>
      Klient<br />
      <div>
        Mail: <input type="text" {...email} autoComplete="new-password" />
        Id naprawy: <input type="text" {...repairId} autoComplete="new-password" />
      </div>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} /><br />
      <input type="button" value="Back" onClick={handleHomeBack} />
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

export default ClientLoginPanel;