document.addEventListener('DOMContentLoaded', () => {
//check if user is logged in
    const user = getCurrentUser();

    if (!user) {
        window.location.href = 'index.html'; 
        return;
    }

    //update user name
    const nameElement = document.getElementById('user-name');
    if (nameElement) {
        nameElement.innerText = user.username;
    }
    loadLeaderboards();

   
});

function logout() {
    localStorage.removeItem('campus_run_current_user');
    window.location.href = 'index.html';
}

function showComingSoon() {
    const modal = document.getElementById("coming-soon-modal");
    modal.classList.remove("hidden");
  
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 800);
}
function loadLeaderboards() {
    const leaderboards = getLeaderboards();

    renderLeaderboard('run', leaderboards.run);
    renderLeaderboard('memory', leaderboards.memory);
}

function renderLeaderboard(gameType, list) {
    const container = document.getElementById(`${gameType}-leaderboard`);
    if (!container) return;

    container.innerHTML = '';

    if (!list || list.length === 0) {
        container.innerHTML = '<li>No scores yet</li>';
        return;
    }

    list.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${entry.username} : ${entry.score}`;
        container.appendChild(li);
    });
}
