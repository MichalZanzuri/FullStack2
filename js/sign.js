
function toggleForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
    
    // Clear input fields when toggling
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
}

//for login
function handleLogin(event) {
    event.preventDefault();

    const user = document.getElementById('loginUsername').value;
    const pass = document.getElementById('loginPassword').value;
    
    // Call the function from userManager.js
    loginUser(user, pass);
}

//for register
function handleRegister(event) {
    event.preventDefault(); // prevent form submission

    const user = document.getElementById('newUsername').value;
    const pass = document.getElementById('newPassword').value;

    // Call the function from userManager.js
    const success = registerUser(user, pass);
    
    if(success) {
        alert("Successfully registered! Logging you in...");
    }
}