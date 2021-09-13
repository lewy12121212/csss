import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken, getUser } from './Common';

// handle the private routes
function PrivateRoute({ componentClient: ComponentClient, componentUsers: ComponentUsers , ...rest }) {

  const token = getToken()
  const userData = getUser()
  console.log("private: " + token + "user: " + userData.Type);

  return (
    <Route
      {...rest}
      render={(props) => {
        if(getToken() && userData.Type === "admin") {
          console.log("private route user")
          return <ComponentUsers {...props} />
        } else if(getToken() && userData.Type === "client"){
          console.log("private route client")
          return <ComponentClient {...props} />
        } else {
          return <Redirect to={{ pathname: '/LoginPanel', state: { from: props.location } }} />
        }
      }}
    />
  )
}

export default PrivateRoute;