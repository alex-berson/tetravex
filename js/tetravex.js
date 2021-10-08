let x, y, x0, y0, rect; 

const showBoard = () => document.querySelector("body").style.opacity = 1;

// const random = (n) => Math.floor(Math.random() * n);

const shuffle = ([...arr]) => arr.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
}

const setBoardSize = (n) => {

    if (screen.height > screen.width) {
         var boardSize = Math.ceil(screen.width * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / (n * 2)) * (n * 2);
    } else {
         var boardSize = Math.ceil(window.innerHeight * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / (n * 2)) * (n * 2);
    }

    // alert(boardSize);

    // alert(boardSize / n / 2);

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');

    document.documentElement.style.setProperty('--tile-size', boardSize / n / 2 - 1 + 'px');
}

const headerColors = () => {

    let colors = [0,1,2,3,4,5,6,7,8];

    // let colors = [0,1,2,3,4,5];

    const chars = document.querySelectorAll(".char");

    colors = shuffle(colors);

    // colors = [0,4,6,3,2,5,7,1];

    console.log("HEADER: ", colors);
    
    for (let char of chars) {
        char.style.color = `var(--color${colors.shift()})`;
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

const tilesColors = (n) => {

    // let singles = [0,3,4,8,9,15,21,26,27,30,33,34];
    // let doubles = [[1,7],[2,12],[5,11],[6,16],[10,20],[13,19],[14,24],[17,23],[18,28],[22,32],[25,31],[29,35]];

    let singles = singleTriangles(n);
    let doubles = doubleTriangles(n);
    let colors = [0,1,2,3,4,5,6,7,8,9];
    let triangles = [];
    let colorsLength = singles.length + doubles.length;
    let tiles = document.querySelectorAll('.tile');

    for (let i = 0; i < Math.floor(colorsLength / colors.length); i++) {
        colors  = colors.concat(colors);
    }

    colors = shuffle(colors.concat(shuffle(colors).slice(0,Math.floor(colorsLength % colors.length))));

    console.log("TILES: ", colors);
    
    // colors = shuffle(colors.concat(colors).concat(shuffle(colors).slice(0,4)));

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
        tile.style.borderColor = `var(--color${triangles[i * 4]}) var(--color${triangles[i * 4 + 1]}) var(--color${triangles[i * 4 + 2]}) var(--color${triangles[i * 4 + 3]})`
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

    let temp = tile1.id;
    tile1.id = tile2.id;
    tile2.id = temp;
}

const shuffleTiles = (n) => {

    // let tilesOrder = [0,1,2,3,4,5,6,7,8];

    let tilesOrder = Array.from({length: n * n}, (_, i) => i);

    // let temp;

    do {
        tilesOrder = shuffle(tilesOrder);
    } while(!wellShuffled(tilesOrder));

    let tiles = document.querySelectorAll('.tile');

    // for (let tile of tiles) {
    //     tile.classList.add("shuffle");
    // }

    console.log("ORDER: ", tilesOrder);

    for (let [i, tile] of tiles.entries()) {

        let destinationTile = tiles[tilesOrder.indexOf(i)];
        let offsetLeft =  destinationTile.offsetLeft - tile.offsetLeft;
        let offsetTop = destinationTile.offsetTop - tile.offsetTop;

        tile.id = `t${tilesOrder.indexOf(i) + 1}`;

        // tile.classList.add("shuffle");
        tile.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
        // tile.addEventListener('transitionend', shuffleTilesEnd);
    }
}

const startMove = (e) => {

    // console.log("START MOVE")

    // let n = 0;

    if (win()) return;

    // while (e.currentTarget != e.touches[n].target) n++;

    disableTouch();

    const tile = e.currentTarget;
    rect = tile.getBoundingClientRect();

    if (e.type === "touchstart") {
        let n = 0;

        while (e.currentTarget != e.touches[n].target) n++;

        x = x0 = e.touches[n].clientX;
        y = y0 = e.touches[n].clientY;
    } else {
        x = x0 = e.clientX
        y = y0 = e.clientY
    }

    tile.classList.add("move");
    tile.addEventListener('touchmove', move);
    tile.addEventListener('touchend', endMove);
    tile.addEventListener('mousemove', move);
    tile.addEventListener('mouseup', endMove);
    tile.addEventListener("mouseleave", endMove);
}

const move = (e) => {

    // let n = 0;
    let dx, dy;
    let tile = e.currentTarget;
    let style = window.getComputedStyle(tile);
    let matrix = new WebKitCSSMatrix(style.transform);

    // while (e.currentTarget != e.touches[n].target) n++;

    if (e.type === "touchmove") {

        let n = 0;
        
        while (e.currentTarget != e.touches[n].target) n++;

        // if (Math.abs(e.touches[0].clientX - x) > 30 ||  Math.abs(e.touches[0].clientY - y) > 30) return;  

        dx = e.touches[n].clientX - x;
        dy = e.touches[n].clientY - y;

        x = e.touches[n].clientX;
        y = e.touches[n].clientY;
    } else {
        dx = e.clientX - x;
        dy = e.clientY - y;

        x = e.clientX;
        y = e.clientY;
    }

    // tile.style.transform = `translate(${Math.round(matrix.m41 + dx)}px, ${Math.round(matrix.m42 + dy)}px)`;

    tile.style.transform = `translate(${matrix.m41 + dx}px, ${matrix.m42 + dy}px)`;

}

const reset = () => {

    let n = getDimension();

    document.querySelector(".board").removeEventListener("touchstart", reset);
    document.querySelector(".board").removeEventListener("mousedown", reset);

    console.log("reset");

    // e.stopPropagation();

    document.querySelector(".board").classList.remove("win-board");
    document.querySelectorAll(".tile").forEach((tile, index) => {
        tile.classList.remove("win-tile");
        tile.id = `t${index + 1}`;
    });
    
    headerColors();
    tilesColors(n);
    shuffleTiles(n);
    enableTouch();
}

const freezeBoard = (e) => {

    let tile = e.currentTarget;

    disableTouch();

    tile.removeEventListener('transitionend', freezeBoard);
    document.querySelector(".board").addEventListener("touchstart", reset);
    document.querySelector(".board").addEventListener("mousedown", reset);

    document.querySelector(".board").classList.add("win-board");
    document.querySelectorAll(".tile").forEach(tile => {
        tile.classList.add("win-tile");
    });

}

const win = () => {

    let colors = [];
    let n = getDimension();
    let doubles = doubleTriangles(n);
    let tiles = document.querySelectorAll('.tile');

    tiles.forEach(tile => {

        let id = parseInt(tile.id.substring(1));
        let topColor = window.getComputedStyle(tile).getPropertyValue("border-top-color");
        let rightColor = window.getComputedStyle(tile).getPropertyValue("border-right-color");
        let bottomColor = window.getComputedStyle(tile).getPropertyValue("border-bottom-color");
        let leftColor = window.getComputedStyle(tile).getPropertyValue("border-left-color");
        
        colors[id - 1] = [topColor, rightColor, bottomColor, leftColor];
    });

    colors = colors.flat();

    for (let double of doubles) {
        if (colors[double[0]] != colors[double[1]]) return false;
    }

    // for (let [i, tile] of tiles.entries()) {
    //     if (parseInt(tile.id.substring(1)) != i + 1) return false;
    // }

    return true;
}

const swapEnd = (e) => {

    // console.log("swapend");

    let tile = e.currentTarget;

    enableTouch();
    tile.classList.remove("swap", "move");

    // tile.style.transition = "";
    // tile.style.zIndex = "auto";

    tile.removeEventListener('transitionend', swapEnd);
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
    let rectTile = tile.getBoundingClientRect();

    tile.classList.add("swap");
    tile.removeEventListener('touchmove', move);
    tile.removeEventListener('touchend', endMove);
    tile.removeEventListener('mousemove', move);
    tile.removeEventListener('mouseup', endMove);
    tile.removeEventListener("mouseleave", endMove);
    tile.addEventListener('transitionend', swapEnd);

    if (swapTile) {
        
        let rectSwap = swapTile.getBoundingClientRect();
        let style = window.getComputedStyle(swapTile);
        let matrix2 = new WebKitCSSMatrix(style.transform);
        let offsetLeft =  rect.left - rectSwap.left;
        let offsetTop = rect.top - rectSwap.top;

        swapTile.classList.add("swap");


        // let dist = distance(parseInt(tile.id.substring(1)) - 1, parseInt(swapTile.id.substring(1)) - 1) / 10 + 0.2;

        // console.log(dist);

        // swapTile.style.transition = `all ${dist}s linear`;
        // swapTile.style.zIndex = 90;


        swapTile.addEventListener('transitionend', swapEnd);

        swapID(tile, swapTile);

        if (win()) swapTile.addEventListener('transitionend', freezeBoard);

        // swapTile.addEventListener('transitionend', freezeBoard);


        // tile.style.transform = `translate(${Math.round(matrix.m41 - (x - x0) - offsetLeft)}px, ${Math.round(matrix.m42 - (y - y0) - offsetTop)}px)`;
        tile.style.transform = `translate(${Math.round(matrix.m41 - (rectTile.left - rect.left) - offsetLeft)}px, ${Math.round(matrix.m42 - (rectTile.top - rect.top) - offsetTop)}px)`;

        swapTile.style.transform = `translate(${Math.round(matrix2.m41 + offsetLeft)}px, ${Math.round(matrix2.m42 + offsetTop)}px)`;

        return;
    }

    tile.style.transform = `translate(${Math.round(matrix.m41 - (rectTile.left - rect.left))}px, ${Math.round(matrix.m42 - (rectTile.top - rect.top))}px)`;
    // tile.style.transform = `translate(${Math.round(matrix.m41 - (x - x0))}px, ${Math.round(matrix.m42 - (y - y0))}px)`;

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

const getDimension = () => {
    return getComputedStyle(document.documentElement).getPropertyValue('--dimension');
}

const setServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js')
                .then(reg => {
                    console.log('Service worker registered!', reg);
                })
                .catch(err => {
                    console.log('Service worker registration failed: ', err);
                });
        });
    } 
}

const init = () => {

    let n = getDimension();

    setServiceWorker();
    disableTapZoom();
    setBoardSize(n);
    headerColors();
    tilesColors(n);
    shuffleTiles(n);
    showBoard();

    // setTimeout(freezeBoard, 1200);

    setTimeout(enableTouch, 1000);


    // setTimeout(preview, 1500);

}

window.onload = () => {
    document.fonts.ready.then(() => {
        init();
    }); 
};
