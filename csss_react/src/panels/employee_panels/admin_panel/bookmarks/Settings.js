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
    <div style={{ color: 'black' }}>
      <div className="container">
        Informacje o użytkowniku:<br />
        Imię: <input type="text" name="Name" onChange={handleNameChange} value={userData.Name}/><br />
        Nazwisko: <input type="text" value={userData.Surname} /><br />
        Mail: <input type="text" value={userData.Mail} /><br />
        Type: <input type="text" value={userData.Type} /><br />
        <button className="btn btn-success">Zatwierdź zmiany</button>
        <hr />
        Ustawienia konta:<br />
        <input type="text" value={userData.Login}></input><br />
        Zmień hasło:<br />
        {/*TODO - komponent resetowania hasła + ustalenie polityki haseł*/}
        Nowe hasło: <input type="password" /><br />
        Powtórz hasło: <input type="password" /><br />
        <button className="btn btn-warning">Zmień hasło</button>
        <hr />
        {/*TODO - dodawanie twarzy oraz usuwanie logowania twarzą */}
        <button className="btn btn-danger">Zarejestruj twarz</button>
      </div>
    </div>
  );
}

export default Settings;