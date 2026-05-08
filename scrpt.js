window.addEventListener("load", function () {
    const preloader = document.querySelector(".preloader");

    if (preloader) {
        preloader.style.opacity = "0";
        preloader.style.visibility = "hidden";

        setTimeout(() => {
            preloader.remove();
        }, 500);
    }
});
