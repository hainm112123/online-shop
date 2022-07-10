var registerBtn = document.querySelector('.header__navbar .register-btn');
var registerModal = document.querySelector('.register-modal');
var loginBtn = document.querySelector('.header__navbar .login-btn');
var loginModal = document.querySelector('.login-modal');
var modalCloseBtns = document.querySelectorAll('.modal .modal__close-btn');

function openRegisterModal() {
    registerModal.style.display = 'flex';
}
function closeRegisterModal() {
    registerModal.style.display = 'none';
}

function openLoginModal() {
    loginModal.style.display = 'flex';
}
function closeLoginModal() {
    loginModal.style.display = 'none';
}

registerBtn.onclick = openRegisterModal;
loginBtn.onclick = openLoginModal;
for (var modalCloseBtn of modalCloseBtns) {
    modalCloseBtn.onclick = function() {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    }
}

var modalOverlays = document.querySelectorAll('.modal .modal__overlay');
for (var modalOverlay of modalOverlays) {
    modalOverlay.onclick = function() {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    }
}
 
var switchToLoginBtn = document.querySelector('.register-modal .modal__switch .modal__switch-btn');
// console.log(switchToLoginBtn);
switchToLoginBtn.onclick = function() {
    registerModal.style.display = 'none';
    loginModal.style.display = 'flex';
}

var switchToRegisterBtn = document.querySelector('.login-modal .modal__switch .modal__switch-btn');
switchToRegisterBtn.onclick = function() {
    loginModal.style.display = 'none';
    registerModal.style.display = 'flex';
}

// ----------------------------product like--------------------------
var homeProductItemLikes = document.querySelectorAll('.home-product-item__like');
for (var homeProductItemLike of homeProductItemLikes) {
    homeProductItemLike.onclick = function(event) {
        this.classList.toggle('home-product-item__like--liked');
        event.preventDefault();
    }
}