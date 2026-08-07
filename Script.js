// Robinson Holdings Website

document.addEventListener("DOMContentLoaded", () => {
  console.log("Robinson Holdings website loaded.");

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });

  // Contact form
  const form = document.querySelector("form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      alert("Thank you for contacting Robinson Holdings! We'll get back to you soon.");

      form.reset();
    });
  }
});