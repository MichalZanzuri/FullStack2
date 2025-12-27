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

    //update scores
    if (user.scores) {
        document.getElementById('score-run').innerText = user.scores.run || 0;
        document.getElementById('score-memory').innerText = user.scores.memory || 0;
    }
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