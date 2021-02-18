//   const login = async () => {
//   const email = document.querySelector('#idEmail').value;
//   const password = document.querySelector('#idPassword').value;

//   try {
//     const response = await fetch('http://localhost:5000/api/accounts/login', {
//       method: 'POST',
//       body: JSON.stringify({
//         email, password,
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//     if (response.status >= 400) {
//       const { msg } = await response.json();
//       document.getElementById('idAlert').hidden = false;
//       document.getElementById('idAlert').innerHTML = msg;
//       return;
//     }
//     // document.location.replace('dashboard.html');
//   } catch (err) {
//     document.getElementById('idAlert').hidden = false;
//     document.getElementById('idAlert').innerHTML = 'Something went wrong';
//   }
// };

document.querySelector('#idEmail').value = "kunalmandot1999@gmail.com"
document.querySelector('#idPassword').value = "kunal123"

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
    document.cookie = "access_token=" + response.data.token
    window.location.replace('dashboard.html')
    // console.log(cookies)
  } catch (err) {
    console.dir(err);
  }
}

document.getElementById('idLogin').addEventListener('click', login);
