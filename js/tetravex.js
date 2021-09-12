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

const shuffle = (arr) => {
    return arr.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);
}

const headerColors = () => {

    let colors = [0,1,2,3,4,5,6,7,8];
    const chars = document.querySelectorAll(".char");

    colors = shuffle(colors);
    
    for (let char of chars) {
        char.style.color = `var(--color${colors.shift() + 1})`;
    }
}

const boardColors = () => {

    let singles = [0,3,4,8,9,15,21,26,27,30,33,34];
    let doubles = [[1,7],[2,12],[5,11],[6,16],[10,20],[13,19],[14,24],[17,23],[18,28],[22,32],[25,31],[29,35]];
    let colors = [0,1,2,3,4,5,6,7,8,9];

    colors = shuffle(colors.concat(colors).concat(shuffle(colors).slice(0,4)));

    console.log(colors);

    for (let single of singles) {
        document.documentElement.style.setProperty(`--triangle${single + 1}`, `var(--color${colors.shift() + 1})`);
    }

    for (let double of doubles) {
        let color = colors.shift();
        document.documentElement.style.setProperty(`--triangle${double[0] + 1}`, `var(--color${color + 1})`);
        document.documentElement.style.setProperty(`--triangle${double[1] + 1}`, `var(--color${color + 1})`);
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
