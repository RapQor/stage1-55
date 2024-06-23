let isOpen = false;
function openHumberger() {
    let humbergerButton = document.getElementById("humberger-nav-container");

    if (!isOpen) {
    //artinya humber sudah di click
    humbergerButton.style.display = "flex";
    isOpen = true; //si icon dia terbuka atau terclik
    } else {
    humbergerButton.style.display = "none";
    isOpen = false;
    }
}