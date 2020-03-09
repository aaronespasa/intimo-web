const header = document.getElementById('header');
let prevScrollpos = window.pageYOffset; // Get the previous offset position of the navbar

/**
 * Auto hide header on scroll
 */
function hideHeader () {
  let currentScrollpos = window.pageYOffset;
  if (currentScrollpos < 20) {
      // Scroll to the top
      // The < 20 prevents to hide the header automatically on mobile
      header.classList.remove('vanish-header');
  } else if (currentScrollpos > prevScrollpos) {
      // Scroll down
      header.classList.add('vanish-header');
  } else {
      // Scroll up
      header.classList.remove('vanish-header');
  }

  prevScrollpos = currentScrollpos;
}

window.addEventListener('scroll', hideHeader);