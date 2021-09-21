import React, {Component} from 'react';
import { withRouter } from "react-router-dom";

class Search extends Component{

  handleClickUser = () => {
    this.props.history.push("/EmployeeLoginPanel");
  };

  handleClickClient = () => {
    this.props.history.push("/ClientLoginPanel");
  };
  render() {
    return (
      <div>
        <button onClick={this.handleClickUser} type="button">Employee</button>
        <button onClick={this.handleClickClient} type="button">Client</button>
      </div>
    );
  }
}

export default withRouter(Search)