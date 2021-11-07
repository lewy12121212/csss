import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { dbAddress } from '../../../../dbCon'
import { PassGenerator } from '../../../../utils/PassGenerator'
import 'bootstrap/dist/css/bootstrap.min.css';

import './Bookmarks.scss' 

function AddEmployee(props) {

  const [errorInfo, setErrorInfo] = useState(false)
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [login, setLogin] = useState("")
  const [mail, setMail] = useState("")
  const [phone, setPhone] = useState("")
  const [type, setType] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    let genPass = PassGenerator()
    setPassword(genPass)

  }, [setPassword])

  const handleAddEmployee = () => { //to send request
    console.log(name + surname + mail + password + login + type)
    axios.post(`http://${dbAddress}:4000/employee/admin/addEmployee`, { Name: name, Surname: surname, Login: login, Pass: password, Mail: mail, Phone: phone, Type: type}).then(response => {
      alert("Poprawnie dodano użytkownika")
      props.history.push("/EmployeeDashboard/Admin/ShowAccounts");
    }).catch((error) => {
      setErrorInfo(true)
      console.log(error.response.data.message)

    });
  }

  function handleNameChange(e){
    setName(e.target.value)
    setErrorInfo(false)
  }
  function handleSurnameChange(e){
    setSurname(e.target.value)
    setErrorInfo(false)
  }
  function handleLoginChange(e){
    setLogin(e.target.value)
    setErrorInfo(false)
  }
  function handleMailChange(e){
    setMail(e.target.value)
    setErrorInfo(false)
  }
  function handlePhoneChange(e){
    setPhone(e.target.value)
    setErrorInfo(false)
  }
  function handleTypeChange(e){
    setType(e.target.value)
    setErrorInfo(false)
  }
  function handleGeneratePass(){
    let genPass = PassGenerator()
    setPassword(genPass)
  }

  return (
    <div className="bookmarkBox container col-10 col-md-8 col-lg-6">
      <h3>Dodaj pracownika:</h3>
      <form>
        <div className="form-group">
          <input type="text" className="form-control" id="Name" placeholder="Imię" onChange={handleNameChange} />
        </div>
        <div className="form-group">
          <input type="text" className="form-control" id="Surname" placeholder="Nazwisko" onChange={handleSurnameChange} />
        </div>
        <div className="form-group">
          <input type="text" className="form-control" id="Login" placeholder="Login" onChange={handleLoginChange} />
        </div>
        <div className="form-group">
          <input type="email" className="form-control" id="Mail" placeholder="Adres Email" onChange={handleMailChange} />
        </div>
        <div className="form-group">
          <input type="text" className="form-control" id="Phone" placeholder="Telefon" onChange={handlePhoneChange} />
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
        {type}
        <hr />
        <div className="form-group">
          <button type="button" className="btn btn-warning" onClick={handleGeneratePass}>Generuj hasło</button>
          HASŁO: {password}
        </div>
        {errorInfo && 
        <div className="alert alert-danger mt-2 text-center" role="alert">
          <p>Sprawdź poprawność wprowadzonych danych.</p>
        </div>
        }
        <button type="button" className="btn btn-success" onClick={handleAddEmployee}>Dodaj pracownika</button>
      </form>


    </div>
  );
}

export default AddEmployee;