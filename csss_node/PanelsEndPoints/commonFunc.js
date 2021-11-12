function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[0-9]{9}$/;
  return re.test(phone);
}

function validateNameSurname(name) {
  const re = /^[a-zA-Z\-]+$/;
  return re.test(name);
}

function validateLogin(login) {
  const re = /^[a-zA-Z0-9]+$/;
  return re.test(login);
}

module.exports = {
  validateEmail,
  validatePhone,
  validateNameSurname,
  validateLogin
}
