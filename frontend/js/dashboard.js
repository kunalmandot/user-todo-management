function getCook(cookiename) {
  // Get name followed by anything except a semicolon
  var cookiestring=RegExp(cookiename+"=[^;]+").exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}

function delete_cookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const logout = async () => {
  try {
    const token = getCook('access_token')
    const response = await fetch('http://localhost:5000/api/accounts/logout', {
      method: 'DELETE',
      headers: {
        authorization: token
      }
    });
    if (response.status >= 400) {
      const { msg } = await response.json();
      document.getElementById('idAlert').hidden = false;
      document.getElementById('idAlert').innerHTML = msg;
      return;
    }
    document.location.replace('login.html');
    delete_cookie('access_token')    
  } catch (err) {
    document.getElementById('idAlert').hidden = false;
    document.getElementById('idAlert').innerHTML = 'Something went wrong';
  }
};

document.getElementById('idLogout').addEventListener('click', logout);
