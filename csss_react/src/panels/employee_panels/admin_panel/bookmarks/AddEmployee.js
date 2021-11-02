import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './Bookmarks.scss'

function AddEmployee(props) {

  return (
    <div className="container col-6">
      <h3>Dodaj pracownika:</h3>
      <form>
        <div className="form-group">
          <input type="text" className="form-control" id="Name" placeholder="Imię" />
        </div>
        <div className="form-group">
          <input type="text" className="form-control" id="Surname" placeholder="Nazwisko" />
        </div>
        <div className="form-group">
          <input type="text" className="form-control" id="Login" placeholder="Login" />
        </div>
        <div className="form-group">
          <input type="email" className="form-control" id="Mail" placeholder="Adres Email" />
        </div>
        <div className="form-group">
          <input type="password" className="form-control" id="Pass" placeholder="Hasło" />
        </div>
        <hr />
        <div className="form-check">
          <input className="form-check-input" type="radio" id="Admin" value="Admin" />
          <label className="form-check-label" htmlFor="Admin">
            Administrator
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" id="Service" value="Service" />
          <label className="form-check-label" htmlFor="Service">
            Serwisant
          </label>
        </div>
        <div className="form-check disabled">
          <input className="form-check-input" type="radio" id="Menager" value="Menager" />
          <label className="form-check-label" htmlFor="Menager">
            Menadżer
          </label>
        </div>
        <div className="form-check disabled">
          <input className="form-check-input" type="radio" id="Coordinator" value="Coordinator" />
          <label className="form-check-label" htmlFor="Coordinator">
            Koordynator
          </label>
        </div>
        <hr />
        <button type="button" className="btn btn-success">Dodaj pracownika</button>
      </form>

    </div>
  );
}

export default AddEmployee;