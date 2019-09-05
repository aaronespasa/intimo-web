const $menuIcon = document.querySelector('.menu-icon')
const $sidenav = document.querySelector('.sidenav')
const $sidenavClose = document.querySelector('.sidenav-close-icon')

$menuIcon.addEventListener('click', () => $sidenav.classList.toggle('active'))

$sidenavClose.addEventListener('click', () => $sidenav.classList.toggle('active'))
