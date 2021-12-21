import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession } from '../../utils/Common';

import { dbAddress } from '../../dbCon';
//styles
import '../../index.scss';
import './client.scss';
import './login.scss';

function ClientLoginPanel(props) {
  const [loading, setLoading] = useState(false);
  const pass = useFormInput('');
  const email = useFormInput('');
  const [error, setError] = useState(null);

  const handleHomeBack = () => {
    props.history.push("/");
  }
  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    axios.post(`https://${dbAddress}:4000/client/signin`, { email: email.value, pass: pass.value }).then(response => {
      setLoading(false);
      console.log(response.data.user)
      setUserSession(response.data.token, response.data.user);
      props.history.push('/ClientDashboard');
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Coś poszło nie tak...");
    });
  }



  return(
    <div className="container col-xl-6 col-lg-8 col-md-10 col-12">
      <div className="row d-flex justify-content-center mt-5">
        <div id="client-title-panel" className="col-10 col-lg-7 d-flex justify-content-center text-center global-title">
          ZALOGUJ SIĘ DO PANELU KLIENTA
        </div>
        <div className="col-10 col-lg-7 d-flex flex-column align-items-center content-panel">
          <div className="client-form-group field col-10">
            <input type="text" className="client-form-field" placeholder="Email..." {...email} name="email" id='email' required />
            <label htmlFor="email" className="client-form-label">Email</label>
          </div>
          <div className="client-form-group field col-10">
            <input type="password" className="client-form-field" placeholder="Hasło..." {...pass} name="pass" id='pass' required />
            <label htmlFor="pass" className="client-form-label">Hasło</label>
          </div>
          {error && <><small className="warningLoginError" style={{ color: 'red' }}>{error}</small></>}
          {/*TODO - change the link style*/}
          <a className="reset-password" href='/ClientResetPassword'> Zapomniałem hasła </a>
          <button className="col-10 col-md-8 col-lg-8 global-btn local-client-btn loginButton" onClick={handleLogin} disabled={loading}>{loading ? 'Ładowanie...' : 'Zaloguj'}</button>
          <button className="col-10 col-md-8 col-lg-8 global-btn local-client-btn" onClick={handleHomeBack}>Wróć</button>

{/*
          {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
          <a href='/ClientResetPassword'> Zapomniałem hasła </a>
          <button className="global-btn local-client-btn" onClick={handleLogin} disabled={loading}>{loading ? 'Ładowanie...' : 'Zaloguj'}</button><br />
          <button className="global-btn local-client-btn" onClick={handleHomeBack}>Wróć</button>
>>>>>>> EmailNotification
*/}
        </div>
      </div>
    </div>
  );

  //return (
  //  <div>
  //    Klient<br />
  //    <div>
  //      Mail: <input type="text" {...email} autoComplete="new-password" />
  //      Id naprawy: <input type="text" {...repairId} autoComplete="new-password" />
  //    </div>
  //    {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
  //    <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} /><br />
  //    <input type="button" value="Back" onClick={handleHomeBack} />
  //  </div>
  //);
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