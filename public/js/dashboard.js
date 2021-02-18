const logout = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/accounts/logout', {
      method: 'DELETE',
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

document.getElementById('idLogout').addEventListener('click', logout);
