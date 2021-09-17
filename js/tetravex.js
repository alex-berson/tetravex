let x, y, x0, y0, rect0;

const showBoard = () => document.querySelector("body").style.opacity = 1;

const random = (n) => Math.floor(Math.random() * n);

const shuffle = ([...arr]) => arr.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
}

const setBoardSize = (n) => {

    if (screen.height > screen.width) {
         var boardSize = Math.ceil(screen.width * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / n) * n;
    } else {
         var boardSize = Math.ceil(window.innerHeight * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / n) * n;
    }

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
}

const headerColors = () => {

    let colors = [0,1,2,3,4,5,6,7,8];
    const chars = document.querySelectorAll(".char");

    colors = shuffle(colors);
    
    for (let char of chars) {
        char.style.color = `var(--color${colors.shift() + 1})`;
    }
}

const singleTriangles = (n) => {

    let triangles = [];

    for (let i = 0; i < n; i++) {
        triangles.push(i * 4);
        triangles.push((n - 1) * n * 4 + 2 + i * 4);
        triangles.push(3 + i * n * 4);
        triangles.push(n * 4 - 3 + i * n * 4);
    }

    return triangles;
}

const doubleTriangles = (n) => {

    let triangles = [];

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n; j++) {
            triangles.push([2 + j * 4 + i * n * 4, n * 4 + j * 4 + i * n * 4]);
            triangles.push([1 + j * 4 * n + i * 4, 7 + j * 4 * n + i * 4]);
        }
    }

    return triangles;
}

const tilesColors = () => {

    // let singles = [0,3,4,8,9,15,21,26,27,30,33,34];
    // let doubles = [[1,7],[2,12],[5,11],[6,16],[10,20],[13,19],[14,24],[17,23],[18,28],[22,32],[25,31],[29,35]];

    let singles = singleTriangles(3);
    let doubles = doubleTriangles(3);
    let colors = [0,1,2,3,4,5,6,7,8,9];
    let triangles = [];

    let tiles = document.querySelectorAll('.tile');

    colors = shuffle(colors.concat(colors).concat(shuffle(colors).slice(0,4)));


    for (let single of singles) {

        let color = colors.shift();

        triangles[single] = color;

        // document.documentElement.style.setProperty(`--triangle${single + 1}`, `var(--color${color + 1})`);
    }

    for (let double of doubles) {

        let color = colors.shift();

        triangles[double[0]] = color;
        triangles[double[1]] = color;

        // document.documentElement.style.setProperty(`--triangle${double[0] + 1}`, `var(--color${color + 1})`);
        // document.documentElement.style.setProperty(`--triangle${double[1] + 1}`, `var(--color${color + 1})`);
    }

    for (let [i, tile] of tiles.entries()) {
        tile.style.borderColor = `var(--color${triangles[i * 4] + 1}) var(--color${triangles[i * 4 + 1] + 1}) var(--color${triangles[i * 4 + 2] + 1}) var(--color${triangles[i * 4 + 3] + 1})`
    }

    // console.log(triangles);
}

const wellShuffled = (arr) => {

    const n = Math.sqrt(arr.length);

    // console.log(n);

    for (let i = 0; i < arr.length; i++){
        if (arr[i] == i) return false;
    }

    // if (arr.some((item, index) => item == index)) return false;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - 1; j++) {
            if (arr[i * n + j + 1] - arr[i * n + j] == 1) return false;
            if (arr[i + j * n + n] - arr[i + j * n] == n) return false;
        }
    }

    return true;
}

// const shuffleTilesEnd = (e) => {

//     let tile = e.currentTarget;

//     tile.classList.remove("shuffle");
//     tile.removeEventListener('transitionend', shuffleTilesEnd);
// }

const swapID = (tile1, tile2) => {

    temp = tile1.id;
    tile1.id = tile2.id;
    tile2.id = temp;

    // console.log(tile1);

    // console.log(tile2)


}

const shuffleTiles = () => {

    let tilesOrder = [0,1,2,3,4,5,6,7,8];
    let temp;

    do {
        tilesOrder = shuffle(tilesOrder);
    } while(!wellShuffled(tilesOrder));

    let tiles = document.querySelectorAll('.tile');

    // for (let tile of tiles) {
    //     tile.classList.add("shuffle");
    // }

    console.log(tilesOrder);

    for (let [i, tile] of tiles.entries()) {

        let destinationTile = tiles[tilesOrder.indexOf(i)];
        let offsetLeft =  destinationTile.offsetLeft - tile.offsetLeft;
        let offsetTop = destinationTile.offsetTop - tile.offsetTop;

        tile.id = tilesOrder.indexOf(i) + 1;

        // tile.classList.add("shuffle");
        tile.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
        // tile.addEventListener('transitionend', shuffleTilesEnd);
    }
}

const startMove = (e) => {

    const tile = e.currentTarget;
    rect0 = tile.getBoundingClientRect();

    if (e.type === "touchstart") {
        x = x0 = e.touches[0].clientX;
        y = y0 = e.touches[0].clientY;
    } else {
        x = x0 = e.clientX
        y = y0 = e.clientY
    }

    disableTouch();
    tile.classList.add("move");
    tile.addEventListener('touchmove', move);
    tile.addEventListener('touchend', endMove);
    tile.addEventListener('mousemove', move);
    tile.addEventListener('mouseup', endMove);
}

const move = (e) => {

    let dx, dy;
    let tile = e.currentTarget;
    let style = window.getComputedStyle(tile);
    let matrix = new WebKitCSSMatrix(style.transform);

    if (e.type === "touchmove") {
        dx = e.touches[0].clientX - x;
        dy = e.touches[0].clientY - y;

        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        dx = e.clientX - x;
        dy = e.clientY - y;

        x = e.clientX;
        y = e.clientY;
    }

    tile.style.transform = `translate(${matrix.m41 + dx}px, ${matrix.m42 + dy}px)`;
}

const win = () => {

    document.querySelectorAll('.tile').forEach((tile, i) => {

        if (tile.id = i) console.log(i);

    });
}

const swapEnd = (e) => {

    let tile = e.currentTarget;

    enableTouch();
    tile.classList.remove("swap", "move");
    // tile.classList.remove("move");
    tile.removeEventListener('transitionend', swapEnd);
    // win();

}

const getSwapTile = (movingTile) => {

    const tiles = document.querySelectorAll('.tile');
    const rectTile = movingTile.getBoundingClientRect();
    const ox = rectTile.left + rectTile.width / 2;
    const oy = rectTile.top + rectTile.height / 2;

    for (let tile of tiles) {

        if (tile == movingTile) continue;

        const rectTile = tile.getBoundingClientRect();

        if (ox >= rectTile.left && ox <= rectTile.right && oy >= rectTile.top && oy <= rectTile.bottom) {
            return tile;
        }
    }
}

const endMove = (e) => {

    const tile = e.currentTarget;
    let style = window.getComputedStyle(tile);
    let matrix = new WebKitCSSMatrix(style.transform);
    let event = new Event('transitionend');
    let swapTile = getSwapTile(tile);

    tile.classList.add("swap");
    tile.removeEventListener('touchmove', move);
    tile.removeEventListener('touchend', endMove);
    tile.removeEventListener('mousemove', move);
    tile.removeEventListener('mouseup', endMove);
    tile.addEventListener('transitionend', swapEnd);

    if (!swapTile) {
        tile.style.transform = `translate(${matrix.m41 - (x - x0)}px, ${ matrix.m42 - (y - y0)}px)`;
    } else {

        let rectSwap = swapTile.getBoundingClientRect();
        let style = window.getComputedStyle(swapTile);
        let matrix2 = new WebKitCSSMatrix(style.transform);
        let offsetLeft =  rect0.left - rectSwap.left;
        let offsetTop = rect0.top - rectSwap.top;

        swapTile.classList.add("swap");
        swapTile.addEventListener('transitionend', swapEnd);

        swapID(tile, swapTile);

        tile.style.transform = `translate(${matrix.m41 - (x - x0) - offsetLeft}px, ${ matrix.m42 - (y - y0) - offsetTop}px)`;
        swapTile.style.transform = `translate(${matrix2.m41 + offsetLeft}px, ${ matrix2.m42 + offsetTop}px)`;
    }

    if (x == x0 && y == y0) tile.dispatchEvent(event);
}

const disableTouch = () => {
    document.querySelectorAll('.tile').forEach((tile) => {
      tile.removeEventListener('touchstart', startMove);
      tile.removeEventListener('mousedown', startMove);
    });
}

const enableTouch = () => {
    document.querySelectorAll('.tile').forEach((tile) => {
      tile.addEventListener('touchstart', startMove);
      tile.addEventListener('mousedown', startMove);
    });
}

const init = () => {

    disableTapZoom();
    setBoardSize(3);
    headerColors();
    tilesColors();
    shuffleTiles();
    showBoard();
    setTimeout(enableTouch, 1000);
}

window.onload = () => {
    document.fonts.ready.then(() => {
        init();
    }); 
};
