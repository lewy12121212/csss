import React from "react";
import './pdf.scss';


class Form extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      DataWystawienia: '',
      DataWykonania: ''  
    };
  }

  setDataWystawienia = (DataWystawienia) => {
    this.setState({
      ...this.state,
      DataWystawienia: DataWystawienia
    })
  }

  setDataWykonania = (DataWykonania) => {
    this.setState({
      ...this.state,
      DataWykonania: DataWykonania
    })
  }

  
   // handleSubmit(event) {
    //  alert('Podano następujące imię: ' + this.state.value);
   //   event.preventDefault();
    //}


  
    
  
    render() {
      return (

      <div className="login-wrapper">
        <h1>Dane do faktury</h1>
        <label>
            <p>Data wystawienia</p>
            <input type="text" onChange={e => this.setDataWystawienia(e.target.value)}/>
        </label>
        <label>
            <p>Data wykonania usługi:</p>
            <input type="password" onChange={e => this.setDataWykonania(e.target.value)}/>
        </label>
        <div>
            <button type="submit" className="btn btn-success" onClick={() => this.props.SendFormData(this.state.Login, this.state.Password)}>Zapisz</button>
        </div>

      </div>
        /*
       <form>
          {this.props.data}
          <label>
            Data wystawienia
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <label>
            Data wykonania usługi
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
        
        </form>
/*
<form action="./pdf.scss">
<label for="fname">First Name</label>
<input type="text" id="fname" name="firstname" placeholder="Your name..">

<label for="lname">Last Name</label>
<input type="text" id="lname" name="lastname" placeholder="Your last name..">


<input type="submit" value="Submit">
</form>
*/
      );
    }
  }

export default Form;