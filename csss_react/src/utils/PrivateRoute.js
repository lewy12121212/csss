import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken, getUser } from './Common';

// handle the private routes
function PrivateRoute({ component: Component, panelType: PanelType, ...rest }) {

  const token = getToken()
  const userData = getUser()

  //type of user!
  return (
    <Route
      {...rest}
      render={(props) => {
        if(token && PanelType === "Client" && userData.Type === undefined) {
          return <Component {...props} />
        } else if(token && PanelType === "Employee" && userData.Type !== undefined) {
          return <Component {...props} />
        } else {
          return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        }
      }}
    />
  )
}

export default PrivateRoute;