// js/userManager.js

const USERS_KEY = 'campus_run_users';
const CURRENT_USER_KEY = 'campus_run_current_user';

function getAllUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

//Sign Up
function registerUser(username, password) {
    const users = getAllUsers();
    
    if (users.some(user => user.username === username)) {
        alert("Username is taken! Try another name");
        return false;
    }
    const newUser = {
        username: username,
        password: password,
        scores: {
            memory: 0,
            run: 0
        }
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    loginUser(username, password); 
    return true;
}

//Login
function loginUser(username, password) {
    const users = getAllUsers();
    const foundUser = users.find(user => user.username === username && user.password === password);

    if (foundUser) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
        window.location.href = '../../dashboard.html';
        return true;
    } else {
        alert("Incorrect username or password");
        return false;
    }
}

function getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
}

function updateScore(gameName, newScore) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    if (newScore > (currentUser.scores[gameName] || 0)) {
        currentUser.scores[gameName] = newScore;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

        const users = getAllUsers();
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
    }
}