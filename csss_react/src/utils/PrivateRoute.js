import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken, getUser } from './Common';

// handle the private routes
function PrivateRoute({ componentClient: ComponentClient, componentUsers: componentUsers , ...rest }) {

  const token = getToken()
  const userData = getUser()
  console.log("private: " + token + "user: " + userData.type);

  return (
    <Route
      {...rest}
      render={(props) => {
        if(getToken() && userData.type === "user") {
          console.log("private route user")
          return <componentUsers {...props} />
        } else if(getToken() && userData.type === "client"){
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