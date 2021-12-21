import React, { useState } from 'react';
import axios from 'axios';

import { dbAddress } from '../../dbCon';

import '../../index.scss';

import PasswordStrengthBar from 'react-password-strength-bar';

function ClientResetPassword (props) {

  const email = useFormInput('');
  const [password, setPassword] = useState('');
  const repeatPassword = useFormInput('');
  const verifyCodeClient = useFormInput('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifyCode, setVerifyCode] = useState(false);
  const [sendCode, setSendCode] = useState(false);
  const [resetPass, setResetPass] = useState(true);
  const [strongEnough, setStrongEnough] = useState(true);

  const handleBack = () => {
    props.history.push("/ClientLoginPanel");
  }

  const handleReset = () => {
    setLoading(true)
    console.log("Dziaaa")
    if(email.value !== '')
    {
      axios.post(`https://${dbAddress}:4000/client/ResetPassword`, { email: email.value}).then(response => {
        //starting countdown of validCode lifetime
        setResetPass(false);
        setSendCode(true);
        setError(null);
      }).catch(error =>{
        setError(error.response.data.message)
      });
    }
    else
    {
      setError('Należy podać adres email.')
    }
    setLoading(false)
  }

  const handleVerifyCode = () => {

    setLoading(true)
    //remeber time was get in ms
    axios.post(`https://${dbAddress}:4000/client/verifyCode`, { Code: verifyCodeClient.value, Mail: email.value}).then(response => {
      setSendCode(false);
      setVerifyCode(true);
      setError(null);
      setLoading(false);
    }).catch(error =>
    {
      setError(error.response.data.message);
    })  
 
  }

  const handleChangePassword = () => {
    //console.log(repeatPassword)
    setLoading(true)
    if(password.length<7)
    {
      setError("Podane hasło jest zbyt krótkie.")
    }
    else if(password === repeatPassword.value)
    {
      //console.log('email ', email.value, ' pass ', password);
      axios.post(`https://${dbAddress}:4000/client/changePassword`, { Code: verifyCodeClient.value, Mail: email.value, ClientPass: password}).then(result => {

        alert("Hasło zostało zmienione.");
        props.history.push("/ClientLoginPanel");
        setError(null);
      }).catch(error => {
        setError(error.response.data.message)
      })
    }
    else
    {
      setError('Błędnie powtórzono hasło.');
    }
    setLoading(false)
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
              <label htmlFor="email" className="client-form-label">Email</label>
            </div>
            {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}
            <button className="col-10 col-md-8 col-lg-8 global-btn local-client-btn" onClick={handleReset} disabled={loading}>{loading ? 'Ładowanie...' : 'Wyślij kod'}</button>
            <button className="col-10 col-md-8 col-lg-8 global-btn local-client-btn" onClick={handleBack}>Wróć</button>
          </div>
        }
        {sendCode &&
          <div className="col-10 col-lg-7 d-flex flex-column align-items-center content-panel">
            <div className="client-form-group field col-10">
              <input type="input" className="client-form-field" placeholder="kod weryfikacyjny..." {...verifyCodeClient} name="verifyCode" id='verifyCode' required />
              <label htmlFor="verifyCode" className="client-form-label">Kod weryfikacyjny</label>
            </div>
            {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}
            <button className="col-10 col-md-8 col-lg-8 global-btn local-client-btn" onClick={handleVerifyCode} disabled={loading}>{loading ? 'Ładowanie...' : 'Zweryfikuj'}</button>
            <button className="col-10 col-md-8 col-lg-8 global-btn local-client-btn" onClick={handleBack}>Wróć</button>
          </div>
        }
        {verifyCode &&
          <div className="col-10 col-lg-7 d-flex flex-column align-items-center content-panel">
            <div className="client-form-group field col-10">
              <input type="password" id="password1" className="client-form-field" placeholder="Nowe hasło." value={password} onChange={e => setPassword(e.target.value)}/>
              <label htmlFor="password1" className="client-form-label">Nowe hasło</label>
              <PasswordStrengthBar password={password} scoreWords={["słabe", "średnie", "dobre", "bardzo dobre", "silne"]} shortScoreWord={["Zbyt krótkie"]} minLength={8} onChangeScore={(score, feedback) => { if(score===2) setStrongEnough(false); else setStrongEnough(true);}}/>
            </div>
            <div className="client-form-group field col-10">
              <input type="password" className="client-form-field" placeholder="powtórz hasło..." {...repeatPassword} name="repeatPassword" id='repeatPassword' required />
              <label htmlFor="repeatPassword" className="client-form-label">Powtórz hasło</label>
            </div>
            {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}
              <div className="description-password-rules col-10">
                <label>Wymagania co do złożoności hasła:</label>
                <ul className="client-list">
                  <li>Hasło musi składać się z conajmniej 8 znaków.</li>
                  <li>Musi zawierać co najmniej: dużą, małą literę, cyfrę oraz znak specjalny.</li>
                </ul>
              </div>
            <button className="col-10 col-md-8 col-lg-8 global-btn local-client-btn" onClick={handleChangePassword} disabled={strongEnough}>Resetuj hasło</button>
            <button className="col-10 col-md-8 col-lg-8 global-btn local-client-btn" onClick={handleBack}>Wróć</button>
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