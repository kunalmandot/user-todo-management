const login = async () => {
  try {
    await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/accounts/login',
      data: {
        email: document.querySelector('#idEmail').value,
        password: document.querySelector('#idPassword').value,
      },
      withCredentials: true,
    });
    window.location.replace('dashboard.html');
  } catch (err) {
    document.getElementById('idAlert').hidden = false;
    document.getElementById('idAlert').innerHTML = err.response.data.msg;
  }
};

document.getElementById('idLogin').addEventListener('click', login);
