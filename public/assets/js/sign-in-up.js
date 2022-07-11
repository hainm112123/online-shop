document.addEventListener('DOMContentLoaded' , function() {
  const db = firebase.firestore();

  var clientsRef = db.collection("clients");
  var clients = [];
  var idCounterRef = db.collection("counter").doc("idCounter");
  var idCounter;
  var isLoginRef = db.collection("counter").doc("isLogin");
  var isLogin;

  function Signup() {
    var phoneNumberInput = document.querySelector('.modal__form .signup-phone-number-input').value;
    var passwordInput = document.querySelector('.modal__form .signup-password-input').value;
    var retypePasswordInput = document.querySelector('.modal__form .signup-retype-password-input').value;
    var usernameInput = document.querySelector('.modal__form .signup-username-input').value;

    if (phoneNumberInput.length !== 10) {
      alert('invailid phonenumber');
      return;
    }
    if (passwordInput.length < 4) {
      alert('password too short!');
      return;
    }
    if (retypePasswordInput !== passwordInput) {
      alert("retyped password don't match!");
      return ;
    }
    if (usernameInput.length < 4) {
      alert('username must be at least 4 character');
      return;
    }
    if (clients.find(function(client) {
      return client.username === usernameInput;
    })) {
      alert('this username already exists!');
      return;
    }

    clientsRef.add({
      username: usernameInput,
      phoneNumbe: phoneNumberInput,
      password: passwordInput,
      id: idCounter + 1,
    }).then(function() {
      alert('Register complete!');
      idCounter ++;
      idCounterRef.update({
        value: idCounter,
      }).then(function() {
        console.log('update id-counter complete');
        GoLogin(idCounter);
      });
    }).catch(function(err) {
      alert("Oops, something's wrong >_<! Please try again.");
      console.log(err);
    });
  }

  function Login() {
    var phoneNumberInput = document.querySelector('.modal__form .login-phone-number-input').value; //username
    var passwordInput = document.querySelector('.modal__form .login-password-input').value;

    if (passwordInput.length < 4) {
      alert('wrong password!');
      return;
    }

    var account = clients.find(function(client) {
      return client.username === phoneNumberInput;
    });
    if (!account || account.password !== passwordInput) {
      alert('wrong username/password');
      return; 
    }

    GoLogin(account.id);
  }


  var headerSinupBtn = document.querySelector('.header__navbar .register-btn');
  var headerLoginBtn = document.querySelector('.header__navbar .login-btn');
  var headerUserInfor = document.querySelector('.header__navbar .header__user-infor');

  function Logout() {
    isLoginRef.update({
      value: false,
    }).then(function() {
      document.location.reload();
    });
  }

  function GoLogin(id) {
    isLoginRef.update({
      value: true,
      userId: id,
    }).then(function() {
      document.location.reload();
    });
  }

  function displayUserHomePage(username) {
    // document.location.reload();
    headerLoginBtn.style.display = 'none';
    headerSinupBtn.style.display = 'none';
    headerUserInfor.style.display = 'inline-flex';
    var headerUsername = document.querySelector('.navbar-item__username');
    headerUsername.innerHTML = username;
  }
  
  async function main() {
    var [clientsSnap, idCounterSnap , isLoginSnap] = await Promise.all([
      clientsRef.get(),
      idCounterRef.get(),
      isLoginRef.get(),
    ]);
    clients = clientsSnap.docs.map(function(doc) {
      return doc.data();
    });
    idCounter = idCounterSnap.data().value;
    isLogin = isLoginSnap.data();

    if (isLogin.value === true) {
      var user = clients.find(function(client) {
        return client.id === isLogin.userId;
      });
      displayUserHomePage(user.username);
    }
  
    var loginBtn = document.querySelector('.modal__form .login-btn');
    var signupBtn = document.querySelector('.modal__form .signup-btn');
    var logoutBtn = document.querySelector('.navbar-item__user-menu-logout');
    loginBtn.addEventListener('click', Login);
    signupBtn.addEventListener('click', Signup);
    logoutBtn.addEventListener('click', Logout);
  }

  main();
});