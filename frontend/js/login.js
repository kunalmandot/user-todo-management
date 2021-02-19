const login = async () => {
  try {
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/accounts/login',
      data: {
        email: document.querySelector('#idEmail').value,
        password: document.querySelector('#idPassword').value,
      },
    });
    const date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    document.cookie = `access_token=${response.data.token}; expires=${date.toGMTString()}`;
    window.location.replace('dashboard.html');
  } catch (err) {
    document.getElementById('idAlert').hidden = false;
    document.getElementById('idAlert').innerHTML = err.response.data.msg;
  }
};

document.getElementById('idLogin').addEventListener('click', login);
