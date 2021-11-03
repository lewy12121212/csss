import React, { useState, useEffect } from 'react';

import '../AdminPanel.scss'
import '../../../../index.scss';
import '../../EmployeePanels.scss';

function Settings(props) {

  const [userData, setUserData] = useState(JSON.parse(props.userData))
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [login, setLogin] = useState("")
  const [mail, setMail] = useState("")
  const [phone, setPhone] = useState("")
  const [ifChange, setIfChange] = useState(true)
  const [changeUserInfo, setChangeUserInfo] = useState(false)

  useEffect(() => {
    console.log('Get users table...')
    //setUserData()
    setName(userData.Name)
    setSurname(userData.Surname)
    setLogin(userData.Login)
    setMail(userData.Mail)
    setPhone(userData.Phone)

  }, [setUserData, setName, setSurname, setLogin, setMail])

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

  function handleChangeData(){
    setChangeUserInfo(true)
    setIfChange(false)
  }

  function handleSendInfoChanges(){
    console.log(userData)
    setChangeUserInfo(false)
  }

  return (
    <div className="container col-12 col-md-10 col-lg-8"style={{ color: 'black' }}>
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
          <input type="button" className="btn btn-danger col-12" onClick={handleSendInfoChanges} value="TAK"/>
        </div>
      }
      <hr />

      <h3>Zmień hasło:</h3>
      {/*TODO - komponent resetowania hasła + ustalenie polityki haseł*/}
      <div className="form-group">
        <label htmlFor="newPassword">Nowe hasło</label>
        <input type="password" className="form-control col-12" id="newPassword" name="newPassword" />
      </div>
      <div className="form-group">
        <label htmlFor="newSecPassword">Powtórz hasło</label>
        <input type="password" className="form-control" id="newSecPassword" name="newSecPassword" />
      </div>
      <button className="btn btn-warning col-12">Zmień hasło</button>
      <hr />

      <h3>Zarejestruj twarz</h3>
      <p>Zarejestruj twarz w celu odblokowania możliwości logowania biometrycznego</p>
      {/*TODO - dodawanie twarzy oraz usuwanie logowania twarzą */}
      <button className="btn btn-danger col-12">Zarejestruj twarz</button>
    </div>
  );
}

export default Settings;