const signup = async (e) => {
  e.preventDefault();
  const email = document.querySelector('#idEmail').value;
  const password = document.querySelector('#idPassword').value;
  const confirmPassword = document.querySelector('#idConfirmPassword').value;

  const result = await axios.post('https://localhost:5000/api/accounts/signup', {
    email: email,
    password: password,
    confirmPassword: confirmPassword,
  });
  if (result) {
    console.log(result);
  }
};

document.addEventListener('submit', signup);
