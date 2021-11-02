import React, { useState } from 'react';

import '../AdminPanel.scss'
import '../../../../index.scss';
import '../../EmployeePanels.scss';

function Settings(props) {

  var [userData, setUserData] = useState(JSON.parse(props.userData))

  //useEffect(() => {
  //  setUserData(JSON.parse(props.userData));
  //}, [])

  function handleNameChange(e) {
    e.preventDefault();
    setUserData({Name: e.target.value})
  }

  return (
    <div className="container col-10 col-md-8 col-lg-6"style={{ color: 'black' }}>
      <h3>Informacje o użytkowniku:</h3>
      <form>
        <div className="form-group">
          <label htmlFor="Name">Imię</label>
          <input type="text" className="form-control" id="Name" name="Name" defaultValue={userData.Name} />
        </div>
        <div className="form-group">
          <label htmlFor="Surname">Nazwisko</label>
          <input type="text" className="form-control" id="Surname" name="Surname" defaultValue={userData.Surname} />
        </div>
        <div className="form-group">
          <label htmlFor="Login">Login</label>
          <input type="text" className="form-control" id="Login" name="Login" defaultValue={userData.Login} />
        </div>
        <div className="form-group">
          <label htmlFor="Mail">Mail</label>
          <input type="email" className="form-control" id="Mail" name="Mail" defaultValue={userData.Mail} />
        </div>
        <button className="btn btn-success">Zatwierdź zmiany</button>
      </form>

      <hr />
      <h3>Zmień hasło:</h3>
      {/*TODO - komponent resetowania hasła + ustalenie polityki haseł*/}
      <div className="form-group">
        <label htmlFor="newPassword">Nowe hasło</label>
        <input type="password" className="form-control" id="newPassword" name="newPassword" />
      </div>
      <div className="form-group">
        <label htmlFor="newSecPassword">Powtórz hasło</label>
        <input type="password" className="form-control" id="newSecPassword" name="newSecPassword" />
      </div>
      <button className="btn btn-warning">Zmień hasło</button>
      <hr />
      <h3>Zarejestruj twarz</h3>
      <p>Zarejestruj twarz w celu odblokowania możliwości logowania biometrycznego</p>
      {/*TODO - dodawanie twarzy oraz usuwanie logowania twarzą */}
      <button className="btn btn-danger">Zarejestruj twarz</button>
    </div>
  );
}

export default Settings;