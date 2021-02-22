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
      withCredentials: true,
    });
    document.location.replace('login.html');
  } catch (err) {
    document.getElementById('idAlert').hidden = false;
    document.getElementById('idAlert').innerHTML = err.response.data.msg;
  }
};

const pageLoad = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const todoId = urlParams.get('todoId');
    const response = await axios({
      method: 'GET',
      url: `http://localhost:5000/api/todos/${todoId}`,
      headers: {
        authorization: getCookie('access_token'),
      },
    });
    const container = document.getElementById('idTodoContainer');
    let str = `<div class="col-md-3" style='margin-top:20px'>Title :</div>
      <div class="col-md-9" style='margin-top:20px'>${response.data.title}</div>
      <div class="col-md-3" style='margin-top:20px'>Label :</div>
      <div class="col-md-9" style='margin-top:20px'>${response.data.label.text}</div>`;

    str += `
      <div class="col-md-3" style='margin-top:20px'>Created at : </div>
      <div class="col-md-9" style='margin-top:20px'>${response.data.createdAt}</div>`;
    if (response.data.updated) {
      str += `
      <div class="col-md-3" style='margin-top:20px'>Updated at: </div>
      <div class="col-md-9" style='margin-top:20px'>${response.data.updated.at}</div>
      <div class="col-md-3" style='margin-top:20px'>Updated by: </div>
      <div class="col-md-9" style='margin-top:20px'>${response.data.updated.by}</div>`;
    }
    if (response.data.statusChanged) {
      str += `
      <div class="col-md-3" style='margin-top:20px'>Status changed at: </div>
      <div class="col-md-9" style='margin-top:20px'>${response.data.statusChanged.at}</div>
      <div class="col-md-3" style='margin-top:20px'>Status changed by: </div>
      <div class="col-md-9" style='margin-top:20px'>${response.data.statusChanged.by}</div>`;
    }
    if (response.data.tasks) {
      str += `
        <div class="col-md-3" style='margin-top:20px'>Tasks</div>
        <div class="col-md-12" style='margin-top:20px'>
          <table class="table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Task</th>
                <th scope="col">Created at</th>
                <th scope="col">Updated at</th>
                <th scope="col">Updated by</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>`;
      response.data.tasks.forEach((element) => {
        str += `<tr>
          <th><input type="checkbox"></th>
          <td>${element.text}</td>
          <td>${element.createdAt}</td>
          <td>${element.updated.at}</td>
          <td>${element.updated.by}</td>
          <td><a href="#">Update</a></td>
          <td><a href="#">Delete</a></td>
        </tr>`;
      });
      str += `</tbody>
          </table>
        </div>`;
    }
    if (response.data.sharedWith.length > 0) {
      str += `<div class="col-md-3" style='margin-top:20px'>Shared with</div>
      <div class="col-md-12" style='margin-top:20px'>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Email</th>
              <th scope="col">Created at</th>
              <th scope="col"></th>
          </tr>
        </thead>
        <tbody>`;
      response.data.sharedWith.forEach((element) => {
        str += `<tr>
                <td>${element.email}</td>
                <td>${element.createdAt}</td>
                <td><button class="btn btn-danger" onclick="unshareTodo('${element._id}')">Unshare</button></td>
              </tr>`;
      });
      str += `</tbody>
        </table>
      </div>`;
    }
    container.innerHTML = str;
  } catch (err) {
    document.getElementById('idAlert').hidden = false;
    document.getElementById('idAlert').innerHTML = err.response.data.msg;
  }
};

const shareTodo = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const todoId = urlParams.get('todoId');
    await axios({
      method: 'POST',
      url: `http://localhost:5000/api/todos/${todoId}/share`,
      data: {
        email: document.querySelector('#idSharedWithEmail').value,
      },
      headers: {
        authorization: getCookie('access_token'),
      },
    });
    window.location.reload();
  } catch (err) {
    document.getElementById('idAlert').hidden = false;
    document.getElementById('idAlert').innerHTML = err.response.data.msg;
  }
};

// eslint-disable-next-line no-unused-vars
const unshareTodo = async (sharedWithUserId) => {
  const urlParams = new URLSearchParams(window.location.search);
  const todoId = urlParams.get('todoId');
  console.log(sharedWithUserId);
  try {
    await axios({
      method: 'DELETE',
      url: `http://localhost:5000/api/todos/${todoId}/unshare/${sharedWithUserId}`,
      headers: {
        authorization: getCookie('access_token'),
      },
    });
    window.location.reload();
  } catch (err) {
    document.getElementById('idAlert').hidden = false;
    document.getElementById('idAlert').innerHTML = err.response.data.msg;
  }
};

window.addEventListener('load', pageLoad);
document.getElementById('idLogout').addEventListener('click', logout);
document.getElementById('idShare').addEventListener('click', shareTodo);
document.getElementById('idTrash').addEventListener('click', trashTodo);
