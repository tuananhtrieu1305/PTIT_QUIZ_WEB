document.addEventListener("DOMContentLoaded", () => {
  const paginationButtons = document.querySelectorAll(".pg-btn");

  paginationButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      paginationButtons.forEach((button) => button.classList.remove("active"));
      this.classList.add("active");
    });
  });
});
