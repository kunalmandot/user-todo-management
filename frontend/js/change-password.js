function getCookie(cookiename) {
  // Get name followed by anything except a semicolon
  const cookiestring = RegExp(`${cookiename}=[^;]+`).exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(cookiestring ? cookiestring.toString().replace(/^[^=]+./, '') : '');
}

const logout = async () => {
  try {
    await axios({
      method: 'DELETE',
      url: 'http://localhost:5000/api/accounts/logout',
      headers: {
        authorization: getCookie('access_token'),
      },
    });
    document.cookie = 'access_token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    document.location.replace('login.html');
  } catch (err) {
    document.getElementById('idAlert').hidden = false;
    document.getElementById('idAlert').innerHTML = err.response.data.msg;
  }
};

const changePassword = async () => {
  try {
    const response = await axios({
      method: 'PUT',
      url: 'http://localhost:5000/api/accounts/change-password',
      data: {
        oldPassword: document.querySelector('#idOldPassword').value,
        newPassword: document.querySelector('#idNewPassword').value,
        confirmNewPassword: document.querySelector('#idConfirmNewPassword').value,
      },
      headers: {
        authorization: getCookie('access_token'),
      },
    });
    document.getElementById('idAlert').hidden = false;
    document.getElementById('idAlert').innerHTML = response.data.msg;

    document.querySelector('#idOldPassword').value = '';
    document.querySelector('#idNewPassword').value = '';
    document.querySelector('#idConfirmNewPassword').value = '';
  } catch (err) {
    document.getElementById('idAlert').hidden = false;
    document.getElementById('idAlert').innerHTML = err.response.data.msg;
  }
};

document.getElementById('idLogout').addEventListener('click', logout);
document.getElementById('idChangePassword').addEventListener('click', changePassword);
