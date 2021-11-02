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
        <div className="container col-10 col-md-8 col-lg-6">
          <button className="btn btn-primary" onClick={handleEditUser}>Wróć</button><br />
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
            <div className="form-group">
              <label htmlFor="Type">Type</label>
              <input type="email" className="form-control" id="Type" name="Type" defaultValue={userData.Type} />
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
        </div>
      }
    </div>
  );
}

export default ShowAccount;