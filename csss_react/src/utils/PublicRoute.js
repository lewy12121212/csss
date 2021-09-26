import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken, getUser } from './Common';

// handle the public routes
function PublicRoute({ component: Component, panelType: PanelType, ...rest }) {

  const token = getToken()
  const userData = getUser()
  //console.log("PublicRoute: private: " + token + "user: " + JSON.stringify(userData));
  
  //też należy sprawdzić który panel!!!
  return (
    <Route
      {...rest}
      render={(props) => {
        if(token && PanelType === "Client" && userData.Type === undefined) {
          return <Component {...props} />
        } else if(token && PanelType === "Employee" && userData.Type !== undefined) {
          return <Component {...props} />
        } else {
          return <Redirect to={{ pathname: '/' }} />
        }
      }}
    />
  )
}

export default PublicRoute;