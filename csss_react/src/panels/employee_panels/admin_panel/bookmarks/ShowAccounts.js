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
    axios.get(`http://${dbAddress}:4000/employee/admin/getUsersTable`).then(response => {
      setUsersTable(response.data.data)
    }).catch((error) => {
      console.log(error.response.data.message)
    });
  }

  const handleTypeChange = () => {

  }

  return (
    <div style={{ color: 'black' }}>
      
      {showTable && 
        <div className="table-responseive" >
          <button className="btn btn-warning" onClick={handleSetUsersTable}>Odświerz</button>
          <table className="table">
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
        <div className="bookmarkBox container col-10 col-md-8 col-lg-6">
          <button className="btn btn-primary" onClick={handleEditUser}>Wróć</button><br />
          <h3>Informacje o użytkowniku:</h3>
          <form className="justify-content-center">
            <div className="row col-12 mx-auto">
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
              <hr />
              <div className="form-check">
                <input className="form-check-input" type="radio" id="Admin" name="Type" value="Admin" onChange={handleTypeChange} />
                <label className="form-check-label" htmlFor="Admin">
                  Administrator
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" id="Service" name="Type" value="Service" onChange={handleTypeChange} />
                <label className="form-check-label" htmlFor="Service">
                  Serwisant
                </label>
              </div>
              <div className="form-check disabled">
                <input className="form-check-input" type="radio" id="Manager" name="Type" value="Manager" onChange={handleTypeChange} />
                <label className="form-check-label" htmlFor="Menager">
                  Menadżer
                </label>
              </div>
              <div className="form-check disabled">
                <input className="form-check-input" type="radio" id="Coordinator" name="Type" value="Coordinator" onChange={handleTypeChange} />
                <label className="form-check-label" htmlFor="Coordinator">
                  Koordynator
                </label>
              </div>
              <button className="btn btn-success">Zatwierdź zmiany</button>
            </div>
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