import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken, getUser } from './Common';

function PublicRoute({ component: Component, panelType: PanelType, ...rest }) {

  const token = getToken()
  const userData = getUser()

  return (
    <Route
      {...rest}
      render={(props) => {
        if(token && userData.Type !== undefined){
          return <Redirect to={{ pathname: `/EmployeeDashboard/${userData.Type}` }} />
        } else if(token && userData.Type === undefined){
          return <Redirect to={{ pathname: `/ClientDashboard` }} />
        } else {
          return <Component {...props} />
        }
      }}
    />
  )
}

export default PublicRoute;