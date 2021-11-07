export function PassGeneratorAlt() {
  
  const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*_-";

  const characters = alpha + numbers + symbols;

  let password = "";
  for (let i = 0; i < 10; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
}

export function PassGenerator() {
  
  const alpha = "abcdefghijklmnopqrstuvwxyz";
  const alphaLarge = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numbers = "0123456789";
  const symbols = "!@#$%^&*_-";

  let password = "";

  for (let i = 0; i < 3; i++) {
    password += alpha.charAt(
      Math.floor(Math.random() * alpha.length)
    );
  }
  for (let i = 0; i < 3; i++) {
    password += numbers.charAt(
      Math.floor(Math.random() * numbers.length)
    );
  }
  for (let i = 0; i < 3; i++) {
    password += alphaLarge.charAt(
      Math.floor(Math.random() * alphaLarge.length)
    );
  }
  for (let i = 0; i < 3; i++) {
    password += symbols.charAt(
      Math.floor(Math.random() * symbols.length)
    );
  }


  return password;
}