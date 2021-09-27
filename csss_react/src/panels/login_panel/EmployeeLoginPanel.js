import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession } from '../../utils/Common';

//styles
import '../../index.scss';
import './employee.scss'

function EmployeeLoginPanel(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);

  const handleHomeBack = () => {
    props.history.push("/");
  }

  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    axios.post('http://192.168.1.5:4000/employee/signin', { username: username.value, password: password.value }).then(response => {
      setLoading(false);
      setUserSession(response.data.token, response.data.user);
      props.history.push('/EmployeeDashboard');
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Coś poszło nie tak :(");
    });
  }

  return (
    <div className="container col-6">
      <div className="row d-flex justify-content-center">
        <div id="title-panel" className="col-10 col-lg-7 d-flex justify-content-center">
          ZALOGUJ SIĘ DO PANELU
        </div>
        <div id="content-panel" className="col-10 col-lg-7 d-flex flex-column align-items-center">
          <input className="input-text" type="text" placeholder="Login..." {...username} autoComplete="new-password" /><br />
          <input className="input-text" type="password" placeholder="Hasło..." {...password} autoComplete="new-password" />
          
          {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
          
          <input type="button" value={loading ? 'Ładowanie...' : 'Zaloguj'} onClick={handleLogin} disabled={loading} /><br />
          <input type="button" value="Cofnij" onClick={handleHomeBack} />
        </div>
      </div>

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

export default EmployeeLoginPanel;