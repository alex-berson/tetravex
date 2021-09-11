
// const boardSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--boardSize').replace(/[^0-9]/g,''))/100;

// if (window.innerHeight > window.innerWidth) {
//     document.documentElement.style.setProperty('--board-size', 100/window.innerWidth * Math.ceil(window.innerWidth*boardSize/3)*3 + 'vmin');
// } else {
//     document.documentElement.style.setProperty('--board-size', 100/window.innerHeight * Math.ceil(window.innerHeight*boardSize/3)*3 + 'vmin');
// }


const disableTapZoom = () => {

    const preventDefault = (e) => e.preventDefault();

    document.body.addEventListener('touchstart', preventDefault, {passive: false});
}

const showBoard = () => {
    document.querySelector("body").style.opacity = 1;
}

const random = (n) => {
    return Math.floor(Math.random() * n);
}

const headerColors = () => {

    const chars = document.querySelectorAll(".char");
    for (let char of chars) {
        char.style.color = `var(--color${random(9) + 1})`;
    }
}

const boardColors = () => {

    for (let i = 0; i < 36; i++) {
            document.documentElement.style.setProperty(`--triangle${i + 1}`, `var(--color${random(10) + 1})`);
    }
}

const init = () => {

    disableTapZoom();
    showBoard();
    headerColors();
    boardColors();
}

window.onload = () => {
    document.fonts.ready.then(() => {
        init();
    }); 
};
