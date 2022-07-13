document.addEventListener('DOMContentLoaded' , function() {
  const db = firebase.firestore();

  var clientsRef = db.collection("clients");
  var clients = [];
  var idCounterRef = db.collection("counter").doc("idCounter");
  var idCounter;
  var isLogin = parseInt(localStorage.getItem("isLogin"));
  var userLoginId = parseInt(localStorage.getItem("userLoginId"));

  var signupOject = function(input, validator, rule) {
    this.input = input;
    this.validator = validator;
    this.rule = rule;
  }

  var signupElements = [
    new signupOject(document.querySelector('.modal__form .signup-phone-number-input'), document.querySelector('.singup-phone-number-validate'), 
      function (passowrd) {
        return passowrd.value.length === 10;
      },
    ),

    new signupOject(document.querySelector('.modal__form .code-input'), document.querySelector('.signup-code-validate'), 
      function (code) {
        return code.value.length === 6;
      },
    ),

    new signupOject(document.querySelector('.modal__form .signup-username-input'), document.querySelector('.signup-username-validate--length'), 
      function (username) {
        return username.value.length >= 4;
      },
    ),

    new signupOject(document.querySelector('.modal__form .signup-username-input'), document.querySelector('.signup-username-validate--existed'), 
      function (username) {
        if (clients.find(function(client) {
          return client.username === username.value;
        })) {
          return false;
        }
        return true;
      },
    ),

    new signupOject(document.querySelector('.modal__form .signup-password-input'), document.querySelector('.signup-password-validate'), 
      function (password) {
        return password.value.length >= 6;
      },
    ),

    new signupOject(document.querySelector('.modal__form .signup-retype-password-input'), document.querySelector('.signup-retype-password-validate'), 
      function (retypePassword) {
        return retypePassword.value === signupElements[4].input.value;
      }
    ),
  ]; 
  const validatorColor = '#f02849';

  function Signup() {
    var ok = true;
    for (var element of signupElements) {
      if (!element.rule(element.input)) {
        element.input.style.outline = '1px solid ' + validatorColor;
        element.validator.style.display = 'block';
        ok = false;
      }
    }

    if (ok === false) return;

    clientsRef.add({
      username: signupElements[2].input.value,
      phoneNumbe: signupElements[0].input.value,
      password: signupElements[4].input.value,
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

  var loginUsernameInput = document.querySelector('.login-phone-number-input');
  var loginPasswordInput = document.querySelector('.login-password-input');
  var loginValidator = document.querySelector('.login-password-validate');
  function Login() {
    var account = clients.find(function(client) {
      return client.username === loginUsernameInput.value;
    });
    if (!account || account.password !== loginPasswordInput.value) {
      loginValidator.style.display = 'block';
      loginUsernameInput.style.outline = '1px solid ' + validatorColor;
      loginPasswordInput.style.outline = '1px solid ' + validatorColor;
      return; 
    }

    GoLogin(account.id);
  }


  var headerSinupBtn = document.querySelector('.header__navbar .register-btn');
  var headerLoginBtn = document.querySelector('.header__navbar .login-btn');
  var headerUserInfor = document.querySelector('.header__navbar .header__user-infor');
  function Logout() {
    localStorage.setItem("isLogin" , 0);
    localStorage.setItem("userLoginId" , 0);
    document.location.reload();
  }
  function GoLogin(id) {
    localStorage.setItem("isLogin" , 1);
    localStorage.setItem("userLoginId" , id);
    document.location.reload();
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
    var [clientsSnap, idCounterSnap] = await Promise.all([
      clientsRef.get(),
      idCounterRef.get(),
    ]);
    clients = clientsSnap.docs.map(function(doc) {
      return doc.data();
    });
    idCounter = idCounterSnap.data().value;

    if (isLogin === 1) {
      var user = clients.find(function(client) {
        return client.id === userLoginId;
      });
      displayUserHomePage(user.username);
    }
  
    var loginBtn = document.querySelector('.modal__form .login-btn');
    var signupBtn = document.querySelector('.modal__form .signup-btn');
    var logoutBtn = document.querySelector('.navbar-item__user-menu-logout');
    loginBtn.addEventListener('click', Login);
    signupBtn.addEventListener('click', Signup);
    logoutBtn.addEventListener('click', Logout);

    signupElements.forEach(function(element) {
      element.input.addEventListener('blur', function() {
        if (element.input.value && !element.rule(element.input)) {
          element.input.style.outline = '1px solid ' + validatorColor;
          element.validator.style.display = 'block';
          // console.log(element.validator);
        }
      });
      element.input.addEventListener('input' , function() {
        element.input.style.outline = 'none';
        element.validator.style.display = 'none';
      });
    });
    signupElements[4].input.addEventListener('input' , function() {
      signupElements[5].input.style.outline = 'none';
      signupElements[5].validator.style.display = 'none';
    });

    loginUsernameInput.addEventListener('input', function() {
      loginValidator.style.display = 'none';
      loginUsernameInput.style.outline = 'none';
      loginPasswordInput.style.outline = 'none';
    });
    loginPasswordInput.addEventListener('input', function() {
      loginValidator.style.display = 'none';
      loginUsernameInput.style.outline = 'none';
      loginPasswordInput.style.outline = 'none';
    });
  }

  main();
});