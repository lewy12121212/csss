import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken, getUser } from './Common';

function PrivateRoute({ component: Component, panelType: PanelType, ...rest }) {

  const token = getToken()
  const userData = getUser()

  return (
    <Route
      {...rest}
      render={(props) => {
        if (PanelType === "Repairs" && token){
          return <Component {...props} />
        } else if(token && userData.Type === "Client" && PanelType === "Client"){
          return <Component {...props} />
        } else if(token && userData.Type === PanelType) {
          console.log("type of user: " + userData.Type + " ?= " + PanelType)
          return <Component {...props} />
        } else if(token && userData.Type !== PanelType) {
          return <Redirect to={{ pathname: `/EmployeeDashboard/${userData.Type}`, state: { from: props.location } }} />
        } else {
          return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        }
      }}
    />
  )
}

export default PrivateRoute;