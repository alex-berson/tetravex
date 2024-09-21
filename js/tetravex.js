let size = 4;

const showBoard = () => document.body.style.opacity = 1;

const shuffle = ([...arr]) => arr.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1]);

const setBoardSize = () => {

    let minSide = screen.height > screen.width ? screen.width : window.innerHeight;
    let cssBoardSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 100;
    let boardSize = Math.ceil(minSide * cssBoardSize / size) * size;

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
}

const setHeaderColors = () => {

    let colors = shuffle([0,1,2,3,4,5,6,7]);
    let chars = document.querySelectorAll('.char');
    
    for (let char of chars) {
        char.style.color = `var(--color${colors.shift()})`;
    }
}

const getSingleTriangles = () => {

    let triangles = [];

    for (let i = 0; i < size; i++) {
        triangles.push(i * 4);
        triangles.push((size - 1) * size * 4 + 2 + i * 4);
        triangles.push(3 + i * size * 4);
        triangles.push(size * 4 - 3 + i * size * 4);
    }

    return triangles;
}

const getDoubleTriangles = () => {

    let triangles = [];

    for (let i = 0; i < size - 1; i++) {
        for (let j = 0; j < size; j++) {
            triangles.push([2 + j * 4 + i * size * 4, size * 4 + j * 4 + i * size * 4]);
            triangles.push([1 + j * 4 * size + i * 4, 7 + j * 4 * size + i * 4]);
        }
    }

    return triangles;
}

const setTilesColors = () => {

    let triangles = [];
    let singles = getSingleTriangles();
    let doubles = getDoubleTriangles();
    let colors = [0,1,2,3,4,5,6,7,8,9];
    let tiles = document.querySelectorAll('.tile');
    let colorsLength = singles.length + doubles.length;

    for (let i = 0; i < Math.trunc(colorsLength / colors.length); i++) {
        colors = colors.concat(colors);
    }

    colors = shuffle(colors.concat(shuffle(colors).slice(0, Math.trunc(colorsLength % colors.length))));

    for (let single of singles) {

        let color = colors.shift();

        triangles[single] = color;
    }

    for (let double of doubles) {

        let color = colors.shift();

        triangles[double[0]] = color;
        triangles[double[1]] = color;
    }

    for (let [i, tile] of tiles.entries()) {
        tile.style.borderColor = `var(--color${triangles[i * 4]}) var(--color${triangles[i * 4 + 1]}) 
                                  var(--color${triangles[i * 4 + 2]}) var(--color${triangles[i * 4 + 3]})`;
    }
}

const shuffleTiles = () => {

    const wellShuffled = (arr) => {

        let n = Math.sqrt(arr.length);
    
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == i) return false;
        }
    
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - 1; j++) {
                if (arr[i * n + j + 1] - arr[i * n + j] == 1) return false;
                if (arr[i + j * n + n] - arr[i + j * n] == n) return false;
            }
        }
    
        return true;
    }

    let cells = document.querySelectorAll('.cell');
    let tiles = document.querySelectorAll('.tile');
    let tilesOrder = Array.from({length: size ** 2}, (_, i) => i);

    do {
        tilesOrder = shuffle(tilesOrder);
    } while (!wellShuffled(tilesOrder));

    tilesOrder.forEach((pos, i) => {

        let rectTile = tiles[pos].getBoundingClientRect();
        let rectCell = cells[i].getBoundingClientRect();
        let offsetLeft = rectCell.left - rectTile.left;
        let offsetTop = rectCell.top - rectTile.top;

        tiles[pos].id = `t${i + 1}`;

        tiles[pos].style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
    });
}

const startMove = (e) => {
    
    let tile = e.currentTarget;

    if (gameOver()) return;

    tile.classList.add('move');

    if (e.type == 'touchstart') {

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

    tile.addEventListener('touchend', endMove);
    tile.addEventListener('touchcancel', endMove);
    document.addEventListener('mouseup', endMove);
}

const touchMove = (e) => {

    let tile = e.currentTarget;
    let style = window.getComputedStyle(tile);
    let matrix = new DOMMatrix(style.transform);
    let n = 0;
    
    while (e.currentTarget != e.touches[n].target) n++;

    let dx = e.touches[n].clientX - tile.dataset.x;
    let dy = e.touches[n].clientY - tile.dataset.y;

    tile.dataset.x = e.touches[n].clientX;
    tile.dataset.y = e.touches[n].clientY;
    
    tile.style.transform = `translate(${matrix.m41 + dx}px, ${matrix.m42 + dy}px)`;
}

const mouseMove = (e) => {

    let tiles = document.querySelectorAll('.move');

    if (tiles.length > 1) {
        returnTile();
        return;
    }

    let tile = tiles[0];
    let style = window.getComputedStyle(tile);
    let matrix = new DOMMatrix(style.transform);
    let dx = e.clientX - tile.dataset.x;
    let dy = e.clientY - tile.dataset.y;

    tile.dataset.x = e.clientX;
    tile.dataset.y = e.clientY;

    tile.style.transform = `translate(${matrix.m41 + dx}px, ${matrix.m42 + dy}px)`;
}

const getSwappedTile = (movingTile) => {

    let tiles = document.querySelectorAll('.tile');
    let rectTile = movingTile.getBoundingClientRect();
    let ox = rectTile.left + rectTile.width / 2;
    let oy = rectTile.top + rectTile.height / 2;

    for (let tile of tiles) {

        if (tile == movingTile || tile.classList.contains('swap')) continue;

        let rectTile = tile.getBoundingClientRect();

        if (ox >= rectTile.left && ox <= rectTile.right && oy >= rectTile.top && oy <= rectTile.bottom) {
            return tile;
        }
    }
}

const endMove = (e) => {

    let el = e.currentTarget;
    let tile = el != document ? el : document.querySelector('.move');
    let cell1 = document.querySelector(`#${tile.id.replace('t', 'c')}`);
    let style = window.getComputedStyle(tile);
    let matrix1 = new DOMMatrix(style.transform);
    let event = new Event('transitionend');
    let tileSwap = getSwappedTile(tile);
    let rectTile = tile.getBoundingClientRect();
    let rectCell1 = cell1.getBoundingClientRect();

    tile.classList.add('swap');
    tile.classList.remove('move');

    tile.removeEventListener('touchmove', touchMove);
    document.removeEventListener('mousemove', mouseMove);

    tile.removeEventListener('touchend', endMove);
    tile.removeEventListener('touchcancel', endMove);
    document.removeEventListener('mouseup', endMove);

    tile.addEventListener('transitionend', () => tile.classList.remove('swap'), {once: true});

    if (tileSwap) {

        let cell2 = document.querySelector(`#${tileSwap.id.replace('t', 'c')}`);
        let rectCell2 = cell2.getBoundingClientRect();
        let style = window.getComputedStyle(tileSwap);
        let matrix2 = new DOMMatrix(style.transform);
        let offsetLeft = rectCell1.left - rectCell2.left;
        let offsetTop = rectCell1.top - rectCell2.top;
        let tempID = tile.id;
        
        tile.id = tileSwap.id;
        tileSwap.id = tempID;

        tileSwap.classList.add('swap');

        tileSwap.addEventListener('transitionend', () => tileSwap.classList.remove('swap'), {once: true});

        tile.style.transform = `translate(${matrix1.m41 - (rectTile.left - rectCell1.left) - offsetLeft}px,
                                          ${matrix1.m42 - (rectTile.top - rectCell1.top) - offsetTop}px)`;
        tileSwap.style.transform = `translate(${matrix2.m41 + offsetLeft}px, ${matrix2.m42 + offsetTop}px)`;

        if (gameOver()) {
            tileSwap.addEventListener('transitionend', freezeBoard, {once: true});
            return;
        }
        return;
    }

    tile.style.transform = `translate(${matrix1.m41 - (rectTile.left - rectCell1.left)}px,
                                      ${matrix1.m42 - (rectTile.top - rectCell1.top)}px)`;

    if (tile.dataset.x0 == tile.dataset.x && tile.dataset.y0 == tile.dataset.y) {
        tile.dispatchEvent(event);
    }
}

const returnTile = () => {

    let tiles = document.querySelectorAll('.move');

    tiles.forEach(tile => {

        let cell = document.querySelector(`#${tile.id.replace('t', 'c')}`);
        let style = window.getComputedStyle(tile);
        let matrix = new DOMMatrix(style.transform);
        let rectTile = tile.getBoundingClientRect();
        let rectCell = cell.getBoundingClientRect();

        tile.classList.remove('move');

        tile.removeEventListener('touchmove', touchMove);
        document.removeEventListener('mousemove', mouseMove);
        tile.removeEventListener('touchend', endMove);
        tile.removeEventListener('touchcancel', endMove);
        document.removeEventListener('mouseup', endMove);

        tile.style.transform = `translate(${matrix.m41 - (rectTile.left - rectCell.left)}px,
                                          ${matrix.m42 - (rectTile.top - rectCell.top)}px)`;
    });
}

const gameOver = () => {

    let colors = [];
    let doubles = getDoubleTriangles();
    let tiles = document.querySelectorAll('.tile');

    tiles.forEach(tile => {

        let id = Number(tile.id.substring(1));
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

    return true;
}

const freezeBoard = () => {

    let board = document.querySelector('.board');
    let tiles = document.querySelectorAll('.tile');

    board.addEventListener('touchstart', newGame);
    board.addEventListener('mousedown', newGame);
    board.classList.add('win-board');
    tiles.forEach(tile => tile.classList.add('win-tile'));
}

const newGame = () => {

    let board = document.querySelector('.board');
    let tiles = document.querySelectorAll('.tile');

    board.removeEventListener('touchstart', newGame);
    board.removeEventListener('mousedown', newGame);
    board.classList.remove('win-board');

    tiles.forEach((tile, i) => {
        tile.classList.remove('win-tile');
        tile.id = `t${i + 1}`;
        tile.style.removeProperty('transform');
    });
    
    setHeaderColors();
    setTilesColors();
    shuffleTiles();
}

const enableTouch = () => {

    let tiles = document.querySelectorAll('.tile');

    tiles.forEach((tile) => {
        tile.addEventListener('touchstart', startMove);
        tile.addEventListener('mousedown', startMove);
    });

    window.addEventListener('orientationchange', returnTile);
}

const disableTapZoom = () => {
    
    const preventDefault = (e) => e.preventDefault();

    document.body.addEventListener('touchstart', preventDefault, {passive: false});
    document.body.addEventListener('mousedown', preventDefault, {passive: false});
}

const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
}

const init = () => {
    registerServiceWorker();
    disableTapZoom();
    setBoardSize();
    setHeaderColors();
    setTilesColors();
    shuffleTiles();
    showBoard();
    enableTouch();
}

window.onload = () => document.fonts.ready.then(init);