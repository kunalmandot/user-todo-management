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

const pageLoad = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: 'http://localhost:5000/api/todos',
      headers: {
        authorization: getCookie('access_token'),
      },
    });
    if (response.data.msg) {
      document.getElementById('idAlert').hidden = false;
      document.getElementById('idAlert').innerHTML = response.data.msg;
      return;
    }
    const container = document.getElementById('idTodoContainer');
    // eslint-disable-next-line no-restricted-syntax
    for (const value of Object.values(response.data)) {
      let date = value.updated ? `Updated at : ${value.updated.at}` : `Created at : ${value.createdAt}`;
      // eslint-disable-next-line prefer-destructuring
      date = date.split('T')[0];
      container.innerHTML += `<div class="col-md-4" style='margin-top:30px'>
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title"><a href="todo.html?todoId=${value._id}">${value.title}</a></h5>
            <p class="card-text">${value.label.text}</p>
          </div>
          <div class="card-footer">
            <small class="text-muted">${date}</small>
          </div>
        </div>
      </div>`;
    }
  } catch (err) {
    document.getElementById('idAlert').hidden = false;
    document.getElementById('idAlert').innerHTML = err.response.data.msg;
  }
};

const createTodo = async () => {
  try {
    await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/todos',
      data: {
        title: document.querySelector('#idTitle').value,
        labelText: document.querySelector('#idLabelText').value,
        labelColour: document.querySelector('#idLabelColour').value,
      },
      headers: {
        authorization: getCookie('access_token'),
      },
    });
    window.location.reload();
  } catch (err) {
    console.log(err);
    document.getElementById('idAlert').hidden = false;
    document.getElementById('idAlert').innerHTML = err.response.data.msg;
  }
};

window.addEventListener('load', pageLoad);
document.getElementById('idLogout').addEventListener('click', logout);
document.getElementById('idCreateTodo').addEventListener('click', createTodo);
