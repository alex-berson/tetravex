const showBoard = () => document.querySelector("body").style.opacity = 1;

const random = (n) => Math.floor(Math.random() * n);

const shuffle = ([...arr]) => arr.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
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

const wellShuffled = (arr) => {

    let n = Math.sqrt(arr.length);

    console.log(n);

    if (arr.some((item, index) => item == index)) return false;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - 1; j++) {
            if (arr[i * n + j + 1] - arr[i * n + j] == 1) return false;
            if (arr[i + j * n + n] - arr[i + j * n] == n) return false;
        }
    }

    return true;
}

const shuffleTiles = () => {

    let order = [0,1,2,3,4,5,6,7,8];

    console.log(order);

    do {

        order = shuffle(order);
    
    }while(!wellShuffled(order));

    console.log(wellShuffled(order));

    console.log(order);

    let tiles = document.querySelectorAll('.tile');

    for (let tile of tiles) {
        tile.classList.add("shuffle");
    }

    for (let [i, tile] of tiles.entries()) {

        let destinationTile = tiles[order.indexOf(i)];
        let offsetLeft =  destinationTile.offsetLeft - tile.offsetLeft;
        let offsetTop = destinationTile.offsetTop - tile.offsetTop;

        tile.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
    }
}

const init = () => {

    disableTapZoom();
    showBoard();
    headerColors();
    boardColors();
    setTimeout(shuffleTiles, 1500);
}

window.onload = () => {
    document.fonts.ready.then(() => {
        init();
    }); 
};
