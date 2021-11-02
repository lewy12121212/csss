import React, { useState, useEffect } from 'react';
import { dbAddress } from '../../../../dbCon';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

import './Bookmarks.scss'

function ShowAccount(props) {

  const [usersTable, setUsersTable] = useState([])
  const [userData, setUserData] = useState([])
  const [editUser, setEditUser] = useState(false)
  const [showTable, setShowTable] = useState(true)

  useEffect(() => {
    console.log('Get users table...')
    handleSetUsersTable()
  }, [])

  const handleEditUser = (data) => {
    if(editUser) {
      setEditUser(false)
      setUserData([])
      setShowTable(true)
    } else {
      setEditUser(true)
      setUserData(data)
      setShowTable(false)
    }
  }

  const handleSetUsersTable = () => {
    axios.get(`http://${dbAddress}:4000/employee/panels/getUsersTable`).then(response => {
      setUsersTable(response.data.data)
    }).catch((error) => {
      console.log(error.response.data.error)
    });
  }

  return (
    <div className="table-responseive" style={{ color: 'black' }}>
      
      {showTable && 
        <div>
          <button className="btn btn-warning" onClick={handleSetUsersTable}>Odświerz</button>
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Imię</th>
                <th scope="col">Nazwisko</th>
                <th scope="col">Typ</th>
                <th scope="col">Edytuj</th>
              </tr>
            </thead>
            <tbody>
            {usersTable.map((data) => 
              <tr key={data.Id}>
                <td>{data.Id}</td>
                <td>{data.Name}</td>
                <td>{data.Surname}</td>
                <td>{data.Type}</td>
                <td><button className="btn btn-primary" onClick={() => handleEditUser(data)}>Edytuj</button></td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      }

      {editUser && 
        <div className="container">
          <button className="btn btn-primary" onClick={handleEditUser}>Wróć</button><br />
          Informacje o użytkowniku:<br />
          Imię: <input type="text" value={userData.Name} /><br />
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
        </div>
      }
    </div>
  );
}

export default ShowAccount;