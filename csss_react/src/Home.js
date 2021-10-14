import React, {Component} from 'react';
import { withRouter } from "react-router-dom";

//styles
import './index.scss';
import './home.scss';

class Search extends Component{

  handleClickUser = () => {
    this.props.history.push("/EmployeeLoginPanel");
  };

  handleClickClient = () => {
    this.props.history.push("/ClientLoginPanel");
  };
  render() {
    return (
      <div className="vertical-center">
        <div className="container col-12">
          <div className="row d-flex justify-content-center button-row">
            <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center button-col">
              <button id="employee-button" className="btn btn-secondary col-8 button-square" onClick={this.handleClickUser}>Jestem <br />pracownikiem</button>
            </div>
            <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center button-col">  
              <button id="client-button" className="btn btn-secondary col-8 button-square" onClick={this.handleClickClient}>Jestem  <br />klientem</button>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default withRouter(Search)