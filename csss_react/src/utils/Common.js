//return cookie by name
//function getCookie(cookieName) {
//  let cookie = {};
//  document.cookie.split(';').forEach(function(el) {
//    let [key,value] = el.split('=');
//    cookie[key.trim()] = value;
//  })
//  return cookie[cookieName];
//}

// return the user data from the session storage
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  //console.log("react session: " + userStr);
  //console.log("Cookie by name: " + getCookie("user"))
  //const userStr = getCookie("user");
  //const userStr = document.cookie.match("user")
  //console.log("get user" + userStr)
  if (userStr) return JSON.parse(userStr);
  else return null;
}

// return the token from the session storage
export const getToken = () => {
  return localStorage.getItem('token') || null;
  //return getCookie("token") || null;
  //const token = getCookie("token");
  //if (token) return token;
  //else return null;
}

// remove the token and user from the session storage
export const removeUserSession = () => {
  //document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  //document.cookie = "user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// set the token and user from the session storage
export const setUserSession = (token, user) => {
  //document.cookie = "token="+ token + ";";
  //document.cookie = "user="+ JSON.stringify(user)+";";
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  console.log("tu:" + JSON.stringify(user))
}