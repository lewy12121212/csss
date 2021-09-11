import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken, getUser } from './Common';

// handle the public routes
function PublicRoute({ component: Component, ...rest }) {

  const token = getToken()
  const userData = getUser()
  console.log("private: " + token + "user: " + JSON.stringify(userData));

  return (
    <Route
      {...rest}
      render={(props) => !getToken() ? <Component {...props} /> : <Redirect to={{ pathname: '/Dashboard' }} />}
    />
  )
}

export default PublicRoute;