import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken, getUser } from './Common';

// handle the private routes
function PrivateRoute({ ComponentClient: componentClient, ComponentUsers: componentUsers , ...rest }) {

  const token = getToken()
  const userData = getUser()
  console.log("private: " + token + "user: " + userData.Type);

  return (
    <Route
      {...rest}
      render={(props) => {
        if(getToken() && userData.Type === "admin") {
          console.log("private route user")
          return <componentUsers {...props} />
        } else if(getToken() && userData.Type === "client"){
          console.log("private route client")
          return <componentClient {...props} />
        } else {
          return <Redirect to={{ pathname: '/LoginPanel', state: { from: props.location } }} />
        }
      }}
    />
  )
}

export default PrivateRoute;