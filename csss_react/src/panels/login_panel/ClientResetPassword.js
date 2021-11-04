import React, { useState } from 'react';
import axios from 'axios';

import { dbAddress } from '../../dbCon';

import '../../index.scss';

function ClientResetPassword (props) {

  const email = useFormInput('');
  const password = useFormInput('');
  const repeatPassword = useFormInput('');
  const verifyCodeClient = useFormInput('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifyCode, setVerifyCode] = useState(null);
  const [sendCode, setSendCode] = useState(false);
  const [resetPass, setResetPass] = useState(true);

  const handleBack = () => {
    props.history.push("/ClientLoginPanel");
  }

  const handleReset = () => {
    setResetPass(false);
    setSendCode(true);
  }

  const handleChangePassword = () => {

  }

  return(
    <div className="container col-xl-6 col-lg-8 col-md-10 col-12">
      <div className="row d-flex justify-content-center mt-5">
        <div id="client-title-panel" className="col-10 col-lg-7 d-flex justify-content-center text-center global-title">
          Zresetuj hasło
        </div>
        {resetPass &&
          <div className="col-10 col-lg-7 d-flex flex-column align-items-center content-panel">
          <div className="client-form-group field col-10">
            <input type="input" className="client-form-field" placeholder="email..." {...email} name="email" id='email' required />
            <label for="email" className="client-form-label">Email</label>
          </div>
          {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
          <button className="global-btn local-client-btn" onClick={handleReset} disabled={loading}>{loading ? 'Ładowanie...' : 'Resetuj hasło'}</button><br />
          <button className="global-btn local-client-btn" onClick={handleBack}>Wróć</button>
        </div>
        }
        {sendCode &&
      
        <div className="col-10 col-lg-7 d-flex flex-column align-items-center content-panel">
        <div className="client-form-group field col-10">
          <input type="input" className="client-form-field" placeholder="hasło..." {...password} name="password" id='password' required />
          <label for="password" className="client-form-label">Nowe hasło</label>
        </div>
        <div className="client-form-group field col-10">
          <input type="input" className="client-form-field" placeholder="powtórz hasło..." {...repeatPassword} name="repeatPassword" id='repeatPassword' required />
          <label for="repeatPassword" className="client-form-label">Powtórz hasło</label>
        </div>
        <div className="client-form-group field col-10">
          <input type="input" className="client-form-field" placeholder="kod weryfikacyjny..." {...verifyCodeClient} name="verifyCode" id='verifyCode' required />
          <label for="verifyCode" className="client-form-label">Kod weryfikacyjny</label>
        </div>
        {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
        <button className="global-btn local-client-btn" onClick={handleChangePassword} disabled={loading}>{loading ? 'Ładowanie...' : 'Zmień hasło'}</button><br />
        <button className="global-btn local-client-btn" onClick={handleBack}>Wróć</button>
      </div>
    
      }
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

export default ClientResetPassword;