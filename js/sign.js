// js/sign.js

function toggleForms() {
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');

    loginBox.classList.toggle('hidden');
    registerBox.classList.toggle('hidden');
}


document.addEventListener('DOMContentLoaded', () => {
    const signUpBtn = document.getElementById('signUpButton');
    if(signUpBtn) {
        signUpBtn.addEventListener('click', () => {
            const user = document.getElementById('newUsername').value;
            const pass = document.getElementById('newPassword').value;

            if(user && pass) {
                const success = registerUser(user, pass);
                if(success) {
                    alert("Successfully registered! Connecting...");
                }
            } else {
                alert("Please fill in all fields.");
            }
        });
    }

    const loginBtn = document.getElementById('loginButton');
    if(loginBtn) {
        loginBtn.addEventListener('click', () => {
            const user = document.getElementById('loginUsername').value;
            const pass = document.getElementById('loginPassword').value;
            
            if(user && pass) {
                loginUser(user, pass);
            } else {
                alert("Please enter username and password");
            }
        });
    }
});