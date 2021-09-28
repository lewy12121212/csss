import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from './Common';

// handle the public routes
function PublicRoute({ component: Component, panelType: PanelType, ...rest }) {

  //const token = getToken()
  //const userData = getUser()
  //console.log("PublicRoute: private: " + token + "user: " + JSON.stringify(userData));
  
  //też należy sprawdzić który panel!!!
  return (
    <Route
      {...rest}
      render={(props) => !getToken() ? <Component {...props} /> : <Redirect to={{ pathname: '/' }} />}
    />
  )
}

export default PublicRoute;