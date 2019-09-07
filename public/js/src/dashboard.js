/* Sidenav */
const $menuIcon = document.querySelector('.menu-icon');
const $sidenav = document.querySelector('.sidenav');
const $sidenavClose = document.querySelector('.sidenav-close-icon');

$menuIcon.addEventListener('click', () => $sidenav.classList.toggle('active'));

$sidenavClose.addEventListener('click', () => $sidenav.classList.toggle('active'));

/* Header Avatar */
const $headerAvatarBtn = document.getElementById('header-avatar-settings');
const $headerAvatarList = document.getElementById('header-avatar-list');

$headerAvatarBtn.addEventListener('click', () => $headerAvatarList.classList.toggle('header-avatar-settings-active'));
