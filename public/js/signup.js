const signup = async () => {
  const email = document.querySelector('#idEmail').value;
  const password = document.querySelector('#idPassword').value;
  const confirmPassword = document.querySelector('#idConfirmPassword').value;

  try {
    const response = await fetch('http://localhost:5000/api/accounts/signup', {
      method: 'POST',
      body: JSON.stringify({
        email, password, confirmPassword,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status >= 400) {
      const { msg } = await response.json();
      document.getElementById('idAlert').hidden = false;
      document.getElementById('idAlert').innerHTML = msg;
      return;
    }
    document.location.replace('login.html');
  } catch (err) {
    document.getElementById('idAlert').hidden = false;
    document.getElementById('idAlert').innerHTML = 'Something went wrong';
  }
};

document.getElementById('idSignup').addEventListener('click', signup);
