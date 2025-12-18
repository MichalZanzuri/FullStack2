  function showComingSoon() {
    const modal = document.getElementById("coming-soon-modal");
    modal.classList.remove("hidden");

    setTimeout(() => {
      modal.classList.add("hidden");
    }, 800);
  }
