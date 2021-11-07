import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { dbAddress } from '../../../../dbCon'

import '../AdminPanel.scss'
import '../../../../index.scss';
import '../../EmployeePanels.scss';

function Settings(props) {

  const [userData, setUserData] = useState(JSON.parse(props.userData))
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [login, setLogin] = useState("")
  const [mail, setMail] = useState("")
  const [phone, setPhone] = useState("")
  const [ifChange, setIfChange] = useState(true)
  const [changeUserInfo, setChangeUserInfo] = useState(false)

  //for password changer
  //const [password, setPassword] = useState("")
  //const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRePassword, setNewRePassword] = useState("");
  const [ifChangePassButton, setIfChangePassButton] = useState(true)
  const [changePasswordWarning, setChangePasswordWarning] = useState(false)
  const [changePasswordWarningMsg, setChangePasswordWarningMsg] = useState("")
  
  useEffect(() => {
    console.log('Get users table...')
    setId(userData.Id)
    setName(userData.Name)
    setSurname(userData.Surname)
    setLogin(userData.Login)
    setMail(userData.Mail)
    setPhone(userData.Phone)
    //setPassword(userData.Pass)

  }, [setId, userData, setUserData, setName, setSurname, setLogin, setMail])

  const handleChangeUserData = () => { //to send request
    axios.post(`http://${dbAddress}:4000/employee/admin/changeUserInfo`, { Id: id, Name: name, Surname: surname, Login: login, Mail: mail, Phone: phone}).then(response => {
      props.refreshUser()
    }).catch((error) => {
      alert(error.message.data.message)
      console.log(error.response.data.message)
    });
  }

  const handleChangePassword = () => {
    axios.post(`http://${dbAddress}:4000/employee/admin/changeUserPassword`, { Id: id, newPassword: newPassword, newRePassword: newRePassword }).then(response => {
      setChangePasswordWarning(false)
      props.refreshUser()
    }).catch((error) => {
      console.log(error.response.data.message)
      setChangePasswordWarningMsg(error.response.data.message)
      setChangePasswordWarning(true)
    });
  }

  function handleSetNewPassword(e){
    setNewPassword(e.target.value)
    setIfChangePassButton(false)
  }

  function handleSetNewRePassword(e){
    setNewRePassword(e.target.value)
    setIfChangePassButton(false)
  }

  //=============================
  function handleNameChange(e){
    setName(e.target.value) 
    setIfChange(false)
  }
  function handleSurnameChange(e){
    setSurname(e.target.value)
    setIfChange(false)
  }
  function handleLoginChange(e){
    setLogin(e.target.value)
    setIfChange(false)
  }
  function handleMailChange(e){
    setMail(e.target.value)
    setIfChange(false)
  }
  function handlePhoneChange(e){
    setPhone(e.target.value)
    setIfChange(false)
  }

  function handleChangeData(){ //to set up warning window
    setChangeUserInfo(true)
    setIfChange(false)
  }

  return (
    <div className="bookmarkBox container col-12 col-md-10 col-lg-8" style={{ color: 'black' }}>
      <h3>Informacje o użytkowniku:</h3>
      
      <form className="justify-content-center">
        <div className="row col-12 mx-auto">
          <div className="form-group col-12 col-md-6">
            <label htmlFor="Name">Imię</label>
            <input type="text" className="form-control" id="Name" name="Name" onChange={handleNameChange} defaultValue={name} />
          </div>
          <div className="form-group col-12 col-md-6">
            <label htmlFor="Surname">Nazwisko</label>
            <input type="text" className="form-control" id="Surname" name="Surname" onChange={handleSurnameChange} defaultValue={surname} />
          </div>
          <div className="form-group">
            <label htmlFor="Login">Login</label>
            <input type="text" className="form-control" id="Login" name="Login" onChange={handleLoginChange} defaultValue={login} />
          </div>
          <div className="form-group">
            <label htmlFor="Mail">Mail</label>
            <input type="email" className="form-control" id="Mail" name="Mail" onChange={handleMailChange} defaultValue={mail} />
          </div>
          <div className="form-group">
            <label htmlFor="Phone">Telefon</label>
            <input type="tel" className="form-control" id="Phone" name="Phone" onChange={handlePhoneChange} defaultValue={phone} />
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-12 col-md-6 table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
              <tr>
                <th colSpan="2">Obecne dane</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>Imię</td>
                <td>{userData.Name}</td>
              </tr>
              <tr>
                <td>Nazwisko</td>
                <td>{userData.Surname}</td>
              </tr>
              <tr>
                <td>Login</td>
                <td>{userData.Login}</td>
              </tr>
              <tr>
                <td>Mail</td>
                <td>{userData.Mail}</td>
              </tr>
              <tr>
                <td>Telefon</td>
                <td>{userData.Phone}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div className="col-12 col-md-6">
            <table className="table table-bordered table-striped">
              <thead>
              <tr>
                <th colSpan="2">Nowe dane</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>Imię</td>
                <td>{name}</td>
              </tr>
              <tr>
                <td>Nazwisko</td>
                <td>{surname}</td>
              </tr>
              <tr>
                <td>Login</td>
                <td>{login}</td>
              </tr>
              <tr>
                <td>Mail</td>
                <td>{mail}</td>
              </tr>
              <tr>
                <td>Telefon</td>
                <td>{phone}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <input type="button" className="btn btn-success col-12" onClick={handleChangeData} value="Zatwierdź zmiany" disabled={ifChange}/>
      </form> 
      {changeUserInfo && 
        <div className="alert alert-danger mt-2 text-center" role="alert">
          <p>Czy na pewno chcesz zmienić dane swojego konta?</p>
          <p>UWAGA! Zmiana danych użytkownika wymusi wylogowanie z systemu w celu wdożenia zmian.</p>
          <input type="button" className="btn btn-danger col-12" onClick={handleChangeUserData} value="TAK"/>
        </div>
      }
      <hr />

      <h3>Zmień hasło:</h3>
      {/*TODO - komponent resetowania hasła + ustalenie polityki haseł*/}
      <div className="form-group">
        <label htmlFor="newPassword">Nowe hasło</label>
        <input type="password" className="form-control col-12" id="newPassword" name="newPassword" onChange={handleSetNewPassword}/>
      </div>
      <div className="form-group">
        <label htmlFor="newRePassword">Powtórz hasło</label>
        <input type="password" className="form-control" id="newRePassword" name="newRePassword" onChange={handleSetNewRePassword}/>
      </div>
      <button className="btn btn-warning col-12" onClick={handleChangePassword} disabled={ifChangePassButton}>Zmień hasło</button>
      {changePasswordWarning && 
        <div className="alert alert-danger mt-2 text-center" role="alert">
          <p>{changePasswordWarningMsg}</p>
        </div>
      }
      <hr />

      <h3>Zarejestruj twarz</h3>
      <p>Zarejestruj twarz w celu odblokowania możliwości logowania biometrycznego</p>
      {/*TODO - dodawanie twarzy oraz usuwanie logowania twarzą */}
      <button className="btn btn-danger col-12">Zarejestruj twarz</button>
    </div>
  );
}

export default Settings;