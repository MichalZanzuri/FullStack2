
const USERS_KEY = 'campus_run_users';
const CURRENT_USER_KEY = 'campus_run_current_user';
const MAX_ATTEMPTS = 3; // num of tries
const BLOCK_TIME_MS = 30 * 1000; // block time
const LEADERBOARD_KEY = 'campus_run_leaderboards';

function getAllUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Sign Up
function registerUser(username, password) {
    const users = getAllUsers();
    
    if (users.some(user => user.username === username)) {
        alert("Username is taken! Try another name");
        return false;
    }
    
    const newUser = {
        username: username,
        password: password,
        scores: { memory: 0, run: 0 },
        loginAttempts: 0, 
        blockUntil: null 
    };

    users.push(newUser);
    saveUsers(users);
    
    // Auto-login after registration
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    window.location.href = '../../dashboard.html';
    return true;
}

// Login
function loginUser(username, password) {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex === -1) {
        alert("User not found.");
        return false;
    }

    const user = users[userIndex];

    if (user.blockUntil && Date.now() < user.blockUntil) {//check if still blocked
        const remainingMinutes = Math.ceil((user.blockUntil - Date.now()) / 60000);
        alert(`Account is blocked! Try again in ${remainingMinutes} minutes.`);
        return false;
    }

    if (user.password === password) {
        // Reset counters because successful login
        user.loginAttempts = 0;
        user.blockUntil = null;
        
        // Update the clean user in the database
        users[userIndex] = user;
        saveUsers(users);

        if (!user.scores) user.scores = { memory: 0, run: 0 };

        // Set current user in LocalStorage
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        window.location.href = '../../dashboard.html';
        return true;

    } else {
        user.loginAttempts = (user.loginAttempts || 0) + 1;
        
        let message = "Incorrect password.";

        // Check if threshold exceeded
        if (user.loginAttempts >= MAX_ATTEMPTS) {
            user.blockUntil = Date.now() + BLOCK_TIME_MS; // blocked
            message = `Too many failed attempts. You are blocked for 30 seconds.`;
        } else {
            message += ` You have ${MAX_ATTEMPTS - user.loginAttempts} attempts left.`;
        }

        // save the updated user (with the failed attempts counter) in LocalStorage
        users[userIndex] = user;
        saveUsers(users);
        
        alert(message);
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

    if (!currentUser.scores) currentUser.scores = {};

    const currentBest = currentUser.scores[gameName] || 0;

    if (newScore > currentBest && newScore > 0) {
        currentUser.scores[gameName] = newScore;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

        const users = getAllUsers();
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            saveUsers(users);
        }
    }
//global highscore leaderboard update
const leaderboards = getLeaderboards();

// Check if the user already exists in the leaderboard
const existingIndex = leaderboards[gameName].findIndex(
    entry => entry.username === currentUser.username
);

if (existingIndex !== -1) {
    //if user exists, update score if newScore is higher
    if (newScore > leaderboards[gameName][existingIndex].score) {
        leaderboards[gameName][existingIndex].score = newScore;
    }
} else {
    // Add new user to leaderboard
    leaderboards[gameName].push({
        username: currentUser.username,
        score: newScore
    });
}

// Sort leaderboard 
leaderboards[gameName].sort((a, b) => b.score - a.score);

// Keep only top 3 scores
leaderboards[gameName] = leaderboards[gameName].slice(0, 3);

// Save updated leaderboard
localStorage.setItem(
    LEADERBOARD_KEY,
    JSON.stringify(leaderboards)
);

    

}
function getLeaderboards() {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : { run: [], memory: [] };
}
