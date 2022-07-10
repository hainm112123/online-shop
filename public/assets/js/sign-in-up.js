document.addEventListener('DOMContentLoaded' , function() {
  const db = firebase.firestore();

  var clientsRef = db.collection("clients");
  var clients = [];
  var idCounterRef = db.collection("counter").doc("idCounter");
  var idCounter;

  function Signup() {
    var phoneNumberInput = document.querySelector('.modal__form .signup-phone-number-input').value;
    var passwordInput = document.querySelector('.modal__form .signup-password-input').value;
    var retypePasswordInput = document.querySelector('.modal__form .signup-retype-password-input').value;

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
    if (clients.find(function(client) {
      return client.username === phoneNumberInput;
    })) {
      alert('this account already exists!');
      return;
    }

    clientsRef.add({
      username: phoneNumberInput,
      password: passwordInput,
      id: idCounter + 1,
    }).then(function() {
      alert('Register complete!');
      idCounter ++;
      idCounterRef.update({
        value: idCounter,
      }).then(function() {
        console.log('update id-counter complete');
      })
    }).catch(function(err) {
      alert("Oops, something's wrong >_<! Please try again.");
      console.log(err);
    });
  
    toUserHomePage(account);
  }

  function Login() {
    var phoneNumberInput = document.querySelector('.modal__form .login-phone-number-input').value;
    var passwordInput = document.querySelector('.modal__form .login-password-input').value;

    if (phoneNumberInput.length !== 10) {
      alert('invailid phonenumber');
      return;
    }
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

    toUserHomePage(account);
  }

  function toUserHomePage(account) {
    window.location.href += account.id.toString();
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
  
    var loginBtn = document.querySelector('.modal__form .login-btn');
    var signupBtn = document.querySelector('.modal__form .signup-btn');
    loginBtn.addEventListener('click' , Login);
    signupBtn.addEventListener('click', Signup);
  }

  main();
});