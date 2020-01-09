const header = document.getElementById('header')
let prevScrollpos = window.pageYOffset // Get the previous offset position of the navbar

/**
 * Auto hide header on scroll
 */
function hideHeader () {
  const currentScrollpos = window.pageYOffset 
  if (currentScrollpos > prevScrollpos) {
    header.classList.add('vanish-header')
  } else if (currentScrollpos == 0) {
    header.classList.remove('vanish-header')
  } else {
    header.classList.remove('vanish-header')
  }

  prevScrollpos = currentScrollpos
}

window.addEventListener('scroll', hideHeader)