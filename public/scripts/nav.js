//variables to store previous and current Yoffset of the window
var prev = window.pageYOffset;
var now;

// to open and close the menu bar when swiped right and left respectively
document.addEventListener('swiped-left', menuOpen);
document.addEventListener('swiped-right', menuOpen);

//event listener when scrolled
window.onscroll = function () {
    now = window.pageYOffset;
    var btn = document.getElementsByTagName("nav")[0];
    if (now > 70) {
        if (now - prev < 0) {
            btn.style.transform = "translateY(0)";
        } else {
            btn.style.transform = "translateY(-70px)";
            var is_open = document.getElementsByClassName('open');
            if (is_open.length > 0) {
                menuOpen()
            }
        }
    }
    prev = window.pageYOffset;
};

function menuOpen() {
    document.getElementsByClassName("nav-links")[0].classList.toggle("open");
    document.getElementsByClassName("burger")[0].classList.toggle("menuAnimate");
}

