const size = getComputedStyle(document.documentElement).getPropertyValue('--size');
// let dragging = false;

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

const touchScreen = () => matchMedia('(hover: none)').matches;

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

    colors = [0,4,2,3,5,6,7,1];

    // colors = [0,4,2,3,1,5,7,6];


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

    // const cells = document.querySelectorAll('.cell');

    const singles = singleTriangles();
    const doubles = doubleTriangles();
    // let colors = [0,1,2,3,4,5,6,7,8,9];
    let triangles = [];
    const colorsLength = singles.length + doubles.length;
    let tiles = document.querySelectorAll('.tile');

    // do {
        triangles = [];
        let colors = [0,1,2,3,4,5,6,7,8,9];

        for (let i = 0; i < Math.floor(colorsLength / colors.length); i++) {
            colors  = colors.concat(colors);
        }

        colors = shuffle(colors.concat(shuffle(colors).slice(0,Math.floor(colorsLength % colors.length))));

        // console.log('TILES: ', colors);
        
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
    // } while (winCombinations(triangles));   //

    // triangles = [2,3,4,1,1,6,3,3,6,7,0,6,9,5,2,7,4,2,0,1,3,7,4,2,0,8,1,7,2,2,6,8,0,3,9,3,4,8,5,3,1,4,7,8,6,9,0,4,9,0,5,7,5,9,8,0,7,5,6,9,0,4,8,5];

    // triangles = [2,3,9,1,1,6,3,3,6,7,0,6,9,5,2,7,9,4,0,1,3,7,2,4,0,8,1,7,2,2,6,8,0,3,9,3,2,8,5,3,1,4,7,8,6,9,0,4,9,0,5,7,5,4,8,0,7,5,6,4,0,4,8,5];

    // triangles = [4, 9, 2, 1, 6, 4, 7, 9, 9, 8, 1, 4, 0, 8, 0, 8, 2, 5, 7, 4, 7, 3, 6, 5, 1, 2, 5, 3, 0, 6, 9, 2, 7, 9, 6, 5, 6, 3, 1, 9, 5, 0, 3, 3, 9, 4, 7, 0, 6, 8, 1, 0, 1, 8, 5, 8, 3, 2, 2, 8, 7, 3, 7, 2];

    // triangles = [4, 3, 5, 0, 5, 4, 1, 3, 8, 6, 0, 4, 3, 2, 8, 6, 5, 7, 5, 0, 1, 6, 6, 7, 0, 9, 8, 6, 8, 1, 3, 9, 5, 7, 2, 0, 6, 8, 9, 7, 8, 5, 1, 8, 3, 6, 7, 5, 2, 7, 1, 2, 9, 4, 3, 7, 1, 9, 4, 4, 7, 9, 2, 9];

    console.log(triangles);

    for (let [i, tile] of tiles.entries()) {

        // tile.style.top = `${cells[i].getBoundingClientRect().top}px`;
        // tile.style.left = `${cells[i].getBoundingClientRect().left}px`;

        // tile.style.opacity = 1;

        // console.log(cells[i].offsetTop, cells[i].offsetLeft);
        // console.log(tile.offsetTop, tile.getBoundingClientRect().top);


        tile.style.borderColor = `var(--color${triangles[i * 4]}) var(--color${triangles[i * 4 + 1]}) var(--color${triangles[i * 4 + 2]}) var(--color${triangles[i * 4 + 3]})`
    }

    // console.log(triangles);
}

// const adjoiningColors = (triangles) => {

//     for (let i = 0; i < triangles.length; i += 4) {
//         for (let j = 0; j < 4; j++) {
//             if ((triangles[i + j] == 3 && triangles[i + (j + 1) % 4] == 4) || (triangles[i + j] == 4 && triangles[i + (j + 1) % 4] == 3)) {
//                 return true;
//             }
//         }
//     }
//     return false;
// }

// const winCombinations = (triangles) => {

//     const doubles = doubleTriangles();

//     const trianles2d = [];

//     for (let i = 0; i < triangles.length / 4; i++) {

//         let four = [];

//         for (let j = 0; j < 4; j++) {

//             four.push(triangles[i * 4 + j]);
//         }

//         trianles2d.push(four);
//     }

//     let copyTrianles2d = trianles2d.map(arr => arr.slice());

//     for (let i = 0; i < size * size - 1; i++) {
//         for (let j = i + 1; j < size * size; j++) {

//             copyTrianles2d = trianles2d.map(arr => arr.slice());

//             [copyTrianles2d[i], copyTrianles2d[j]] = [copyTrianles2d[j], copyTrianles2d[i]];
        
//             let triangles1d = copyTrianles2d.flat();

//             if (doubles.some(double => triangles1d[double[0]] != triangles1d[double[1]])) continue;

//             return true;
//         }
//     }

//     return false;
// }

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

    let cells = document.querySelectorAll('.cell');
    let tiles = document.querySelectorAll('.tile');

    // let tilesOrder = [0,1,2,3,4,5,6,7,8];

    let tilesOrder = Array.from({length: size * size}, (_, i) => i);


    // let temp;

    do {
        tilesOrder = shuffle(tilesOrder);
    } while(!wellShuffled(tilesOrder));

    // tilesOrder = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

    // tilesOrder = [1,0,2,3,4,5,6,7,8,9,10,11,12,13,14,15];


    // tilesOrder = [12, 2, 15, 6, 14, 0, 10, 1, 4, 7, 5, 8, 3, 9, 13, 11];

    // tilesOrder = [6, 12, 15, 1, 9, 0, 13, 2, 4, 8, 7, 14, 11, 3, 5, 10];

    console.log(tilesOrder);

    // for (let tile of tiles) {
    //     tile.classList.add('shuffle');
    // }

    // console.log('ORDER: ', tilesOrder);

    // for (let [i, tile] of tiles.entries()) {

    //     let destinationTile = tiles[tilesOrder.indexOf(i)];
    //     let offsetLeft =  destinationTile.offsetLeft - tile.offsetLeft;
    //     let offsetTop = destinationTile.offsetTop - tile.offsetTop;

    //     tile.id = `t${tilesOrder.indexOf(i) + 1}`;

    //     tile.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;

    // }

    tilesOrder.forEach((pos, i) => {
        tiles[pos].id = `t${i + 1}`;
        // tiles[pos].style.top = `${cells[i].getBoundingClientRect().top}px`;
        // tiles[pos].style.left = `${cells[i].getBoundingClientRect().left}px`;

        tiles[pos].style.top = `${cells[i].offsetTop}px`;
        tiles[pos].style.left = `${cells[i].offsetLeft}px`;
    });

}

const startMove = (e) => {
    
    const tile = e.currentTarget;

    // const cell = document.querySelector(`#${tile.id.replace('t', 'c')}`); //

    // console.log(tile.id.replace('t', 'c'));

    // console.log('START MOVE')

    // let n = 0;

    // if (dragging || win()) return;
    if (win()) return;

    // console.log(MouseEvent.buttons);

    // if (win()) return;

    // document.querySelectorAll('.tile').forEach((tile) => {
    //     tile.classList.remove('move');
    // });

    // tile.classList.add('move');

    // while (e.currentTarget != e.touches[n].target) n++;
    // console.log(tile.id);

    // if (tile.classList.contains('swap')) return;

    // dragging = true;

    tile.classList.add('move');

    // disableTouch();

    // rect = tile.getBoundingClientRect();

    // const test = window.getComputedStyle(tile).transform;
    // tile.style.transform = test;



    // let style = window.getComputedStyle(tile);  //
    // matrix = new WebKitCSSMatrix(style.transform);  //

    // rect = cell.getBoundingClientRect();

    // let style = window.getComputedStyle(cell);  //
    // matrix = new WebKitCSSMatrix(style.transform);  //

    if (e.type === 'touchstart') {
        let n = 0;

        while (e.currentTarget != e.touches[n].target) n++;

        tile.dataset.x0 = tile.dataset.x = e.touches[n].clientX;
        tile.dataset.y0 = tile.dataset.y = e.touches[n].clientY;

        tile.addEventListener('touchmove', touchMove);


    } else {

        let tiles = document.querySelectorAll('.move');

        if (tiles.length > 1) {
            returnTile();
            return;
        }

        tile.dataset.x0 = tile.dataset.x = e.clientX
        tile.dataset.y0 = tile.dataset.y = e.clientY

        document.addEventListener('mousemove', mouseMove);
    }

    // tile.addEventListener('touchmove', move);
    // tile.addEventListener('mousemove', move);

    tile.addEventListener('touchend', endMove);
    tile.addEventListener('touchcancel', endMove);
    document.addEventListener('mouseup', endMove);
    // tile.addEventListener('mouseleave', endMove);
}

const touchMove = (e) => {

    let tile = e.currentTarget;
    let style = window.getComputedStyle(tile);
    let matrix = new WebKitCSSMatrix(style.transform);

    // while (e.currentTarget != e.touches[n].target) n++;

    let n = 0;
    
    while (e.currentTarget != e.touches[n].target) n++;

    // if (Math.abs(e.touches[0].clientX - x) > 30 ||  Math.abs(e.touches[0].clientY - y) > 30) return;  

    let dx = e.touches[n].clientX - tile.dataset.x;
    let dy = e.touches[n].clientY - tile.dataset.y;

    // dx1 = e.touches[n].clientX - x0;
    // dy1 = e.touches[n].clientY - y0;

    tile.dataset.x = e.touches[n].clientX;
    tile.dataset.y = e.touches[n].clientY;
    
    // console.log(dx, dy);

    // tile.style.transform = `translate(${Math.round(matrix.m41 + dx)}px, ${Math.round(matrix.m42 + dy)}px)`;

    tile.style.transform = `translate(${matrix.m41 + dx}px, ${matrix.m42 + dy}px)`;

    // let cell = document.querySelector(`#${tile.id.replace('t', 'c')}`);  


    // tile.style.left = cell.offsetLeft + dx1 + 'px';
    // tile.style.top = cell.offsetTop + dy1 + 'px';

    // console.log(tile.id, cell.id);
    // console.log(dx, dy);


}

const mouseMove = (e) => {

    let tiles = document.querySelectorAll('.move');

    if (tiles.length > 1) {
        returnTile();
        return;
    }

    let tile = tiles[0];
    let style = window.getComputedStyle(tile);
    let matrix = new WebKitCSSMatrix(style.transform);
    let dx = e.clientX - tile.dataset.x;
    let dy = e.clientY - tile.dataset.y;

    tile.dataset.x = e.clientX;
    tile.dataset.y = e.clientY;

    tile.style.transform = `translate(${matrix.m41 + dx}px, ${matrix.m42 + dy}px)`;
}

const reset = () => {

    // let n = size();

    document.querySelector('.board').removeEventListener('touchstart', reset);
    document.querySelector('.board').removeEventListener('mousedown', reset);

    // console.log('reset');

    // e.stopPropagation();

    document.querySelector('.board').classList.remove('win-board');
    // document.querySelector('.designed').classList.remove('win-designed');
    document.querySelectorAll('.tile').forEach((tile, index) => {
        tile.classList.remove('win-tile');
        tile.id = `t${index + 1}`;
        tile.style.transform = ''; //
    });
    
    // dragging = false;

    headerColors();
    tilesColors();
    shuffleTiles();
}

const freezeBoard = (e) => {

    let tile = e.currentTarget;

    // disableTouch();

    tile.removeEventListener('transitionend', freezeBoard);
    document.querySelector('.board').addEventListener('touchstart', reset);
    document.querySelector('.board').addEventListener('mousedown', reset);

    document.querySelector('.board').classList.add('win-board');
    // document.querySelector('.designed').classList.add('win-designed');
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

    console.log("SWAPEND");

}

const swappedTile = (movingTile) => {

    // let cell = document.querySelector(`#${tileSwap.id.replace('t', 'c')}`);


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

    const el = e.currentTarget;

    // console.log(tile);

    let tile = el != document ? el : document.querySelector('.move');

    let cell1 = document.querySelector(`#${tile.id.replace('t', 'c')}`);
    let style = window.getComputedStyle(tile);
    let matrix1 = new WebKitCSSMatrix(style.transform);
    let event = new Event('transitionend');
    let tileSwap = swappedTile(tile);
    let rectTile = tile.getBoundingClientRect();
    // let rect = cell1.getBoundingClientRect();
    let rectCell1 = cell1.getBoundingClientRect();

    // console.log(rect, rectCell1);

    // let rectCell1 = rect;


    tile.classList.add('swap');
    tile.classList.remove('move'); //

    tile.removeEventListener('touchmove', touchMove);
    document.removeEventListener('mousemove', mouseMove);

    tile.removeEventListener('touchend', endMove);
    tile.removeEventListener('touchcancel', endMove);
    document.removeEventListener('mouseup', endMove);
    // tile.removeEventListener('mouseleave', endMove);

    // tile.addEventListener('transitionend', (e) => {
    //     e.currentTarget.classList.remove('swap');
    // }, {once: true});

    tile.addEventListener('transitionend', swapEnd);


    if (tileSwap) {

        let cell2 = document.querySelector(`#${tileSwap.id.replace('t', 'c')}`);
        
        // let rectSwap = tileSwap.getBoundingClientRect();

        // let rectSwap = cell2.getBoundingClientRect();

        let style = window.getComputedStyle(tileSwap);
        let matrix2 = new WebKitCSSMatrix(style.transform);
        // let offsetLeft =  rect.left - rectSwap.left;
        // let offsetTop = rect.top - rectSwap.top;

        let offsetLeft =  cell1.offsetLeft - cell2.offsetLeft;
        let offsetTop = cell1.offsetTop - cell2.offsetTop;

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
        // tile.style.transform = `translate(${Math.round(matrix1.m41 - (rectTile.left - rect.left) - offsetLeft)}px, ${Math.round(matrix1.m42 - (rectTile.top - rect.top) - offsetTop)}px)`;

        tile.style.transform = `translate(${Math.round(matrix1.m41 - (rectTile.left - rectCell1.left) - offsetLeft)}px, ${Math.round(matrix1.m42 - (rectTile.top - rectCell1.top) - offsetTop)}px)`;
        // tile.style.transform = `translate(${Math.round(matrix1.m41 - (rectTile.left - cell1.offsetLeft) - offsetLeft)}px, ${Math.round(matrix1.m42 - (rectTile.top - cell1.offsetTop) - offsetTop)}px)`;

        // console.log(rectTile.left - rect.left, tile.offsetLeft - cell1.offsetLeft);
        // console.log(rectTile.top - rect.top, tile.offsetTop - cell1.offsetTop);


        tileSwap.style.transform = `translate(${Math.round(matrix2.m41 + offsetLeft)}px, ${Math.round(matrix2.m42 + offsetTop)}px)`;

        // enableTouch(tile, swapTile); //
        // setTimeout(enableTouch, 50, tile, swapTile); //

        if (win()) {
            tileSwap.addEventListener('transitionend', freezeBoard);
            return;
        }

        // dragging = false;

        return;
    }

    // let cell = document.querySelector(`#${tile.id.replace('t', 'c')}`);  //
    // tile.style.left = cell.offsetLeft + 'px'; //
    // tile.style.top = cell.offsetTop + 'px'; //
    // tile.style.transform = '';

    tile.style.transform = `translate(${Math.round(matrix1.m41 - (rectTile.left - rectCell1.left))}px, ${Math.round(matrix1.m42 - (rectTile.top - rectCell1.top))}px)`;

    // dragging = false;

    if (tile.dataset.x0 == tile.dataset.x && tile.dataset.y0 == tile.dataset.y) tile.dispatchEvent(event);

    // if (x == x0 && y == y0) console.log( "X = X0)");


    // enableTouch(tile); //

}

const returnTile = () => {

    // alert('RETURN');
    // const tiles = document.querySelectorAll('.tile');

    // let event = new Event('transitionend');

    // for (let tile of tiles) {

        // if (tile.classList.contains('move')) {
            
    document.querySelectorAll('.move').forEach(tile => {

        let cell = document.querySelector(`#${tile.id.replace('t', 'c')}`);
        let style = window.getComputedStyle(tile);
        let matrix = new WebKitCSSMatrix(style.transform);
        let rectTile = tile.getBoundingClientRect();
        let rectCell = cell.getBoundingClientRect();

        tile.removeEventListener('touchmove', touchMove);
        document.removeEventListener('mousemove', mouseMove);

        tile.removeEventListener('touchend', endMove);
        tile.removeEventListener('touchcancel', endMove);
        document.removeEventListener('mouseup', endMove);
        // tile.removeEventListener('mouseleave', endMove);

        // tile.addEventListener('transitionend', (e) => {
        //     e.currentTarget.classList.remove('swap');
        // }, {once: true});

        tile.addEventListener('transitionend', swapEnd);

        // let cell = document.querySelector(`#${tile.id.replace('t', 'c')}`);
        // let style = window.getComputedStyle(cell);
        // let matrix = new WebKitCSSMatrix(style.transform);

        // tile.style.left = cell.offsetLeft + 'px'; //
        // tile.style.top = cell.offsetTop + 'px'; //
        // tile.style.transform = '';


        tile.style.transform = `translate(${Math.round(matrix.m41 - (rectTile.left - rectCell.left))}px, ${Math.round(matrix.m42 - (rectTile.top - rectCell.top))}px)`;


        // tile.style.transform = `translate(${matrix.m41}px, ${matrix.m42}px`;

        tile.classList.remove('move');

        tile.classList.add('swap'); //


        // enableTouch(); //

        // setTimeout(enableTouch, 50, tile); //

        // dragging = false;

        // return;
    });
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
        // if (touchScreen()) {
            tile.addEventListener('touchstart', startMove);
        // } else {
            tile.addEventListener('mousedown', startMove);
        // }
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


    // setTimeout(preview, 2000);

}

window.onload = () => document.fonts.ready.then(() => init());
