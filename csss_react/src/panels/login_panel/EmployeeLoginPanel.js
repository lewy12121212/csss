import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession } from '../../utils/Common';

import { dbAddress } from '../../dbCon';
//styles
import '../../index.scss';
import './employee.scss';
import './login.scss';

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
    console.log(username.value + " " + password.value)

    axios.post(`http://${dbAddress}:4000/employee/signin`, { username: username.value, password: password.value }).then(response => {
      setLoading(false);
      setUserSession(response.data.token, response.data.user);
      props.history.push(`/EmployeeDashboard/${response.data.user.Type}`);
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Coś poszło nie tak...");
    });
  }

  //login by enter - only callback work - not login, login by enter has empty input variable error :/
  //useEffect(() => {
  //  const listener = event => {
  //    if (event.code === "Enter" || event.code === "NumpadEnter") {
  //      console.log("Login...");
  //      console.log(username.value + " " + password.value)
  //      handleLogin()
  //      event.preventDefault();
  //      // callMyFunction();
  //    }
  //  };
  //  document.addEventListener("keydown", listener);
  //  return () => {
  //    document.removeEventListener("keydown", listener);
  //  };
  //}, []);

  return (
    <div className="container col-xl-6 col-lg-8 col-md-10 col-12">
      <div className="row d-flex justify-content-center mt-5">
        <div id="employee-title-panel" className="col-10 col-lg-7 d-flex justify-content-center text-center global-title">
          ZALOGUJ SIĘ DO PANELU PRACOWNIKA
        </div>
        <div className="col-10 col-lg-7 d-flex flex-column align-items-center content-panel">
          <div className="employee-form-group field col-10">
            <input type="input" className="employee-form-field" placeholder="Login..." {...username} autoComplete="new-password" name="Login" id='Login' required />
            <label htmlFor="Login" className="employee-form-label">Login</label>
          </div>
          <div className="employee-form-group field col-10">
            <input type="password" className="employee-form-field" placeholder="Haslo..."  {...password} autoComplete="new-password" name="password" id='password' required />
            <label htmlFor="password" className="employee-form-label">Hasło</label>
          </div>
          {error && <><small style={{ color: 'red' }}>{error}</small></>}<br />

          <button className="global-btn local-employee-btn" onClick={handleLogin} disabled={loading}>{loading ? 'Ładowanie...' : 'Zaloguj'}</button><br />
          <button className="global-btn local-employee-btn" onClick={handleHomeBack}>Wróć</button>
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
