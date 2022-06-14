let x, y, x0, y0, matrix, rect; 
let dragging = false;
let size = getComputedStyle(document.documentElement).getPropertyValue('--size');

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('service-worker.js')
//             .then(reg => {
//                 console.log('Service worker registered!', reg);
//             })
//             .catch(err => {
//                 console.log('Service worker registration failed: ', err);
//             });
//     });
// } 


const showBoard = () => document.querySelector('body').style.opacity = 1;

// const size = () => getComputedStyle(document.documentElement).getPropertyValue('--size');

// const random = (n) => Math.floor(Math.random() * n);

const shuffle = ([...arr]) => arr.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1]);

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
}

const setBoardSize = () => {

    let boardSize;

    if (screen.height > screen.width) {
        boardSize = Math.ceil(screen.width * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / (size * 2)) * (size * 2);
    } else {
        boardSize = Math.ceil(window.innerHeight * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / (size * 2)) * (size * 2);
    }

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
    document.documentElement.style.setProperty('--tile-size', boardSize / size / 2 - 1 + 'px');
}

const headerColors = () => {

    let colors = [0,1,2,3,4,5,6,7];

    const chars = document.querySelectorAll('.char');

    colors = shuffle(colors);

    // colors = [0,4,6,3,2,5,7,1];

    // console.log('HEADER: ', colors);
    
    for (let char of chars) {
        char.style.color = `var(--color${colors.shift()})`;
    }
}

const singleTriangles = () => {

    let triangles = [];

    for (let i = 0; i < size; i++) {
        triangles.push(i * 4);
        triangles.push((size - 1) * size * 4 + 2 + i * 4);
        triangles.push(3 + i * size * 4);
        triangles.push(size * 4 - 3 + i * size * 4);
    }

    return triangles;
}

const doubleTriangles = () => {

    let triangles = [];

    for (let i = 0; i < size - 1; i++) {
        for (let j = 0; j < size; j++) {
            triangles.push([2 + j * 4 + i * size * 4, size * 4 + j * 4 + i * size * 4]);
            triangles.push([1 + j * 4 * size + i * 4, 7 + j * 4 * size + i * 4]);
        }
    }

    return triangles;
}

const tilesColors = () => {

    // let singles = [0,3,4,8,9,15,21,26,27,30,33,34];
    // let doubles = [[1,7],[2,12],[5,11],[6,16],[10,20],[13,19],[14,24],[17,23],[18,28],[22,32],[25,31],[29,35]];

    const singles = singleTriangles();
    const doubles = doubleTriangles();
    // let colors = [0,1,2,3,4,5,6,7,8,9];
    let triangles = [];
    const colorsLength = singles.length + doubles.length;
    let tiles = document.querySelectorAll('.tile');

    do {
        triangles = [];
        let colors = [0,1,2,3,4,5,6,7,8,9];

        for (let i = 0; i < Math.floor(colorsLength / colors.length); i++) {
            colors  = colors.concat(colors);
        }

        colors = shuffle(colors.concat(shuffle(colors).slice(0,Math.floor(colorsLength % colors.length))));

        console.log('TILES: ', colors);
        
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

    // } while (adjoiningColors(triangles) || winCombinations(triangles));   //
    } while (winCombinations(triangles));   //


    // triangles = [9,0,6,8,1,9,3,0,3,5,3,9,8,1,9,5,6,2,6,8,3,4,7,2,3,3,4,4,9,9,6,3,6,6,0,1,7,1,0,6,4,8,0,1,6,4,5,8,0,2,2,5,0,5,7,2,0,2,4,5,5,7,7,2];


    for (let [i, tile] of tiles.entries()) {
        tile.style.borderColor = `var(--color${triangles[i * 4]}) var(--color${triangles[i * 4 + 1]}) var(--color${triangles[i * 4 + 2]}) var(--color${triangles[i * 4 + 3]})`
    }

    // console.log(triangles);
}

const adjoiningColors = (triangles) => {

    for (let i = 0; i < triangles.length; i += 4) {
        // console.log(i);
        for (let j = 0; j < 4; j++) {
            // console.log(i + j, i + (j + 1) % 4);
            if ((triangles[i + j] == 3 && triangles[i + (j + 1) % 4] == 4) || (triangles[i + j] == 4 && triangles[i + (j + 1) % 4] == 3)) {
                // console.log('TRUE');
                return true;
            }
        }
    }

    // console.log(triangles);
    // console.log('FALSE');
    return false;
}

const winCombinations = (triangles) => {

    const doubles = doubleTriangles();

    const trianles2d = [];

    for (let i = 0; i < triangles.length / 4; i++) {

        let four = [];

        for (let j = 0; j < 4; j++) {

            four.push(triangles[i * 4 + j]);
        }

        trianles2d.push(four);
    }

    let copyTrianles2d = trianles2d.map(arr => arr.slice());

    for (let i = 0; i < size * size - 1; i++) {
        for (let j = i + 1; j < size * size; j++) {

            copyTrianles2d = trianles2d.map(arr => arr.slice());

            [copyTrianles2d[i], copyTrianles2d[j]] = [copyTrianles2d[j], copyTrianles2d[i]];
        
            let triangles1d = copyTrianles2d.flat();

            if (doubles.some(double => triangles1d[double[0]] != triangles1d[double[1]])) continue;

            return true;
        }
    }

    return false;
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

//     tile.classList.remove('shuffle');
//     tile.removeEventListener('transitionend', shuffleTilesEnd);
// }

const swapID = (tile1, tile2) => {

    let temp = tile1.id;
    tile1.id = tile2.id;
    tile2.id = temp;
}

const shuffleTiles = () => {

    // let tilesOrder = [0,1,2,3,4,5,6,7,8];

    let tilesOrder = Array.from({length: size * size}, (_, i) => i);


    // let temp;

    do {
        tilesOrder = shuffle(tilesOrder);
    } while(!wellShuffled(tilesOrder));

    // tilesOrder = [1,0,2,3,4,5,6,7,8,9,10,11,12,13,14,15];


    let tiles = document.querySelectorAll('.tile');

    // for (let tile of tiles) {
    //     tile.classList.add('shuffle');
    // }

    console.log('ORDER: ', tilesOrder);

    for (let [i, tile] of tiles.entries()) {

        let destinationTile = tiles[tilesOrder.indexOf(i)];
        let offsetLeft =  destinationTile.offsetLeft - tile.offsetLeft;
        let offsetTop = destinationTile.offsetTop - tile.offsetTop;

        tile.id = `t${tilesOrder.indexOf(i) + 1}`;

        // tile.classList.add('shuffle');
        tile.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
        // tile.addEventListener('transitionend', shuffleTilesEnd);
    }
}

const startMove = (e) => {
    
    const tile = e.currentTarget;

    // console.log('START MOVE')

    // let n = 0;

    if (dragging || win()) return;

    // if (win()) return;

    // document.querySelectorAll('.tile').forEach((tile) => {
    //     tile.classList.remove('move');
    // });

    // tile.classList.add('move');

    // while (e.currentTarget != e.touches[n].target) n++;
    // console.log(tile.id);

    if (tile.classList.contains('swap')) return;

    dragging = true;

    tile.classList.add('move');

    // disableTouch();

    rect = tile.getBoundingClientRect();

    let style = window.getComputedStyle(tile);  //
    matrix = new WebKitCSSMatrix(style.transform);  //

    if (e.type === 'touchstart') {
        let n = 0;

        while (e.currentTarget != e.touches[n].target) n++;

        x = x0 = e.touches[n].clientX;
        y = y0 = e.touches[n].clientY;
    } else {
        x = x0 = e.clientX
        y = y0 = e.clientY
    }

    tile.addEventListener('touchmove', move);
    tile.addEventListener('mousemove', move);

    tile.addEventListener('touchend', endMove);
    tile.addEventListener('touchcancel', endMove);
    tile.addEventListener('mouseup', endMove);
    tile.addEventListener('mouseleave', endMove);
}

const move = (e) => {

    // let n = 0;
    let dx, dy;
    let tile = e.currentTarget;
    let style = window.getComputedStyle(tile);
    let matrix = new WebKitCSSMatrix(style.transform);

    // while (e.currentTarget != e.touches[n].target) n++;

    if (e.type === 'touchmove') {

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

    // console.log(dx, dy);

    // tile.style.transform = `translate(${Math.round(matrix.m41 + dx)}px, ${Math.round(matrix.m42 + dy)}px)`;

    tile.style.transform = `translate(${matrix.m41 + dx}px, ${matrix.m42 + dy}px)`;

}

const reset = () => {

    // let n = size();

    document.querySelector('.board').removeEventListener('touchstart', reset);
    document.querySelector('.board').removeEventListener('mousedown', reset);

    // console.log('reset');

    // e.stopPropagation();

    document.querySelector('.board').classList.remove('win-board');
    document.querySelectorAll('.tile').forEach((tile, index) => {
        tile.classList.remove('win-tile');
        tile.id = `t${index + 1}`;
    });
    
    dragging = false;

    headerColors();
    tilesColors();
    shuffleTiles();
    // enableTouch();
}

const freezeBoard = (e) => {

    let tile = e.currentTarget;

    // disableTouch();

    tile.removeEventListener('transitionend', freezeBoard);
    document.querySelector('.board').addEventListener('touchstart', reset);
    document.querySelector('.board').addEventListener('mousedown', reset);

    document.querySelector('.board').classList.add('win-board');
    document.querySelectorAll('.tile').forEach(tile => {
        tile.classList.add('win-tile');
    });
}

const win = () => {

    let colors = [];
    // let n = size();
    let doubles = doubleTriangles();
    let tiles = document.querySelectorAll('.tile');

    tiles.forEach(tile => {

        let id = parseInt(tile.id.substring(1));
        let topColor = window.getComputedStyle(tile).getPropertyValue('border-top-color');
        let rightColor = window.getComputedStyle(tile).getPropertyValue('border-right-color');
        let bottomColor = window.getComputedStyle(tile).getPropertyValue('border-bottom-color');
        let leftColor = window.getComputedStyle(tile).getPropertyValue('border-left-color');
        
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


    let tile = e.currentTarget;

    tile.removeEventListener('transitionend', swapEnd);
    
    tile.classList.remove('swap');

}

const swappedTile = (movingTile) => {

    const tiles = document.querySelectorAll('.tile');
    const rectTile = movingTile.getBoundingClientRect();
    const ox = rectTile.left + rectTile.width / 2;
    const oy = rectTile.top + rectTile.height / 2;

    for (let tile of tiles) {

        // if (tile == movingTile) continue;

        if (tile == movingTile || tile.classList.contains('swap')) continue; //

        const rectTile = tile.getBoundingClientRect();

        if (ox >= rectTile.left && ox <= rectTile.right && oy >= rectTile.top && oy <= rectTile.bottom) {
            return tile;
        }
    }
}

const endMove = (e) => {

    const tile = e.currentTarget;
    let style = window.getComputedStyle(tile);
    let matrix1 = new WebKitCSSMatrix(style.transform);
    let event = new Event('transitionend');
    let tileSwap = swappedTile(tile);
    let rectTile = tile.getBoundingClientRect();

    tile.classList.add('swap');
    tile.classList.remove('move'); //

    tile.removeEventListener('touchmove', move);
    tile.removeEventListener('mousemove', move);

    tile.removeEventListener('touchend', endMove);
    tile.removeEventListener('touchcancel', endMove);
    tile.removeEventListener('mouseup', endMove);
    tile.removeEventListener('mouseleave', endMove);

    // tile.addEventListener('transitionend', (e) => {
    //     e.currentTarget.classList.remove('swap');
    // }, {once: true});

    tile.addEventListener('transitionend', swapEnd);


    if (tileSwap) {
        
        let rectSwap = tileSwap.getBoundingClientRect();
        let style = window.getComputedStyle(tileSwap);
        let matrix2 = new WebKitCSSMatrix(style.transform);
        let offsetLeft =  rect.left - rectSwap.left;
        let offsetTop = rect.top - rectSwap.top;

        tileSwap.classList.add('swap');
        // tile.classList.remove('move'); //



        // let dist = distance(parseInt(tile.id.substring(1)) - 1, parseInt(swapTile.id.substring(1)) - 1) / 10 + 0.2;

        // console.log(dist);

        // swapTile.style.transition = `all ${dist}s linear`;
        // swapTile.style.zIndex = 90;


        // swapTile.addEventListener('transitionend', (e) => {
        //     e.currentTarget.classList.remove('swap');
        // }, {once: true});

        tileSwap.addEventListener('transitionend', swapEnd);


        swapID(tile, tileSwap);

        // swapTile.addEventListener('transitionend', freezeBoard);


        // tile.style.transform = `translate(${Math.round(matrix.m41 - (x - x0) - offsetLeft)}px, ${Math.round(matrix.m42 - (y - y0) - offsetTop)}px)`;
        tile.style.transform = `translate(${Math.round(matrix1.m41 - (rectTile.left - rect.left) - offsetLeft)}px, ${Math.round(matrix1.m42 - (rectTile.top - rect.top) - offsetTop)}px)`;

        tileSwap.style.transform = `translate(${Math.round(matrix2.m41 + offsetLeft)}px, ${Math.round(matrix2.m42 + offsetTop)}px)`;

        // enableTouch(tile, swapTile); //
        // setTimeout(enableTouch, 50, tile, swapTile); //

        if (win()) {
            tileSwap.addEventListener('transitionend', freezeBoard);
            return;
        }

        dragging = false;

        return;
    }

    tile.style.transform = `translate(${Math.round(matrix1.m41 - (rectTile.left - rect.left))}px, ${Math.round(matrix1.m42 - (rectTile.top - rect.top))}px)`;
    // tile.style.transform = `translate(${Math.round(matrix.m41 - (x - x0))}px, ${Math.round(matrix.m42 - (y - y0))}px)`;

    // setTimeout(enableTouch, 50, tile); //

    dragging = false;

    if (x == x0 && y == y0) tile.dispatchEvent(event);

    // enableTouch(tile); //

}

const returnTile = () => {

    // alert('RETURN');
    const tiles = document.querySelectorAll('.tile');

    // let event = new Event('transitionend');

    for (let tile of tiles) {

        if (tile.classList.contains('move')) {

            tile.removeEventListener('touchmove', move);
            tile.removeEventListener('mousemove', move);

            tile.removeEventListener('touchend', endMove);
            tile.removeEventListener('touchcancel', endMove);
            tile.removeEventListener('mouseup', endMove);
            tile.removeEventListener('mouseleave', endMove);

            // tile.addEventListener('transitionend', (e) => {
            //     e.currentTarget.classList.remove('swap');
            // }, {once: true});

            tile.addEventListener('transitionend', swapEnd);

            tile.style.transform = `translate(${matrix.m41}px, ${matrix.m42}px`;

            tile.classList.remove('move');

            tile.classList.add('swap'); //


            // enableTouch(); //

            // setTimeout(enableTouch, 50, tile); //

            dragging = false;

            return;
        }
    }
}

// const disableTouch = () => {
//     document.querySelectorAll('.tile').forEach((tile) => {
//       tile.removeEventListener('touchstart', startMove);
//       tile.removeEventListener('mousedown', startMove);
//     });
// }

// const enableTouchTile = (tile, args = []) => {
//     // if (tile.classList.contains('swap')) return;

//     for (let arg of args) {
//         if (arg == tile) return;
//     }

//     // tile.addEventListener('touchstart', startMove, {once: true});
//     // tile.addEventListener('mousedown', startMove, {once: true});

//     tile.addEventListener('touchstart', startMove);
//     tile.addEventListener('mousedown', startMove);    
// }

const enableTouch = (...args) => {
    // console.log(args);
    document.querySelectorAll('.tile').forEach((tile) => {
        // enableTouchTile(tile, args);
      tile.addEventListener('touchstart', startMove);
      tile.addEventListener('mousedown', startMove);
    });

    window.addEventListener('orientationchange', returnTile);
}

const init = () => {

    // const n = size();

    disableTapZoom();
    setBoardSize();
    headerColors();
    tilesColors();
    shuffleTiles();
    showBoard();

    // setTimeout(freezeBoard, 1200);

    setTimeout(enableTouch, 500);


    // setTimeout(preview, 1500);

}

window.onload = () => document.fonts.ready.then(() => init());
