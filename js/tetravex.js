const size = getComputedStyle(document.documentElement).getPropertyValue('--size');

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

const touchScreen = () => matchMedia('(hover: none)').matches;

const showBoard = () => document.querySelector('body').style.opacity = 1;

const shuffle = ([...arr]) => arr.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1]);

const setBoardSize = () => {

    let boardSize;

    if (screen.height > screen.width) {
        boardSize = Math.ceil(screen.width * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / (size * 2)) * (size * 2);
    } else {
        boardSize = Math.ceil(window.innerHeight * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / (size * 2)) * (size * 2);
    }

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
}

const headerColors = () => {

    const chars = document.querySelectorAll('.char');
    let colors = [0,1,2,3,4,5,6,7];

    colors = shuffle(colors);
    
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

    const singles = singleTriangles();
    const doubles = doubleTriangles();
    const colorsLength = singles.length + doubles.length;
    const tiles = document.querySelectorAll('.tile');

    let triangles = [];
    let colors = [0,1,2,3,4,5,6,7,8,9];

    for (let i = 0; i < Math.floor(colorsLength / colors.length); i++) {
        colors  = colors.concat(colors);
    }

    colors = shuffle(colors.concat(shuffle(colors).slice(0,Math.floor(colorsLength % colors.length))));

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
        tile.style.borderColor = `var(--color${triangles[i * 4]}) var(--color${triangles[i * 4 + 1]}) var(--color${triangles[i * 4 + 2]}) var(--color${triangles[i * 4 + 3]})`
    }
}

const wellShuffled = (arr) => {

    const n = Math.sqrt(arr.length);

    for (let i = 0; i < arr.length; i++){
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

const shuffleTiles = () => {

    const cells = document.querySelectorAll('.cell');
    const tiles = document.querySelectorAll('.tile');
    let tilesOrder = Array.from({length: size * size}, (_, i) => i);

    do {
        tilesOrder = shuffle(tilesOrder);
    } while(!wellShuffled(tilesOrder));

    tilesOrder.forEach((pos, i) => {
        tiles[pos].id = `t${i + 1}`;
        tiles[pos].style.top = `${cells[i].offsetTop}px`;
        tiles[pos].style.left = `${cells[i].offsetLeft}px`;
    });

}

const startMove = (e) => {
    
    const tile = e.currentTarget;

    if (win()) return;

    tile.classList.add('move');

    if (e.type === 'touchstart') {

        let n = 0;

        while (e.currentTarget != e.touches[n].target) n++;

        tile.dataset.x0 = tile.dataset.x = e.touches[n].clientX;
        tile.dataset.y0 = tile.dataset.y = e.touches[n].clientY;

        tile.addEventListener('touchmove', touchMove);

    } else {

        const tiles = document.querySelectorAll('.move');

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
    let matrix = new WebKitCSSMatrix(style.transform);

    let n = 0;
    
    while (e.currentTarget != e.touches[n].target) n++;

    let dx = e.touches[n].clientX - tile.dataset.x;
    let dy = e.touches[n].clientY - tile.dataset.y;

    tile.dataset.x = e.touches[n].clientX;
    tile.dataset.y = e.touches[n].clientY;
    
    tile.style.transform = `translate(${matrix.m41 + dx}px, ${matrix.m42 + dy}px)`;
}

const mouseMove = (e) => {

    const tiles = document.querySelectorAll('.move');

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

    document.querySelector('.board').removeEventListener('touchstart', reset);
    document.querySelector('.board').removeEventListener('mousedown', reset);
    document.querySelector('.board').classList.remove('win-board');

    document.querySelectorAll('.tile').forEach((tile, index) => {
        tile.classList.remove('win-tile');
        tile.id = `t${index + 1}`;
        tile.style.transform = '';
    });
    
    headerColors();
    tilesColors();
    shuffleTiles();
}

const freezeBoard = (e) => {

    let tile = e.currentTarget;

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

        if (tile == movingTile || tile.classList.contains('swap')) continue;

        const rectTile = tile.getBoundingClientRect();

        if (ox >= rectTile.left && ox <= rectTile.right && oy >= rectTile.top && oy <= rectTile.bottom) {
            return tile;
        }
    }
}

const swapID = (tile1, tile2) => {

    let tempID = tile1.id;
    tile1.id = tile2.id;
    tile2.id = tempID;
}

const endMove = (e) => {

    const el = e.currentTarget;
    let tile = el != document ? el : document.querySelector('.move');
    let cell1 = document.querySelector(`#${tile.id.replace('t', 'c')}`);
    let style = window.getComputedStyle(tile);
    let matrix1 = new WebKitCSSMatrix(style.transform);
    let event = new Event('transitionend');
    let tileSwap = swappedTile(tile);
    let rectTile = tile.getBoundingClientRect();
    let rectCell1 = cell1.getBoundingClientRect();

    tile.classList.add('swap');
    tile.classList.remove('move');

    tile.removeEventListener('touchmove', touchMove);
    document.removeEventListener('mousemove', mouseMove);

    tile.removeEventListener('touchend', endMove);
    tile.removeEventListener('touchcancel', endMove);
    document.removeEventListener('mouseup', endMove);
    tile.addEventListener('transitionend', swapEnd);


    if (tileSwap) {

        let cell2 = document.querySelector(`#${tileSwap.id.replace('t', 'c')}`);
        let style = window.getComputedStyle(tileSwap);
        let matrix2 = new WebKitCSSMatrix(style.transform);
        let offsetLeft =  cell1.offsetLeft - cell2.offsetLeft;
        let offsetTop = cell1.offsetTop - cell2.offsetTop;

        tileSwap.classList.add('swap');
        tileSwap.addEventListener('transitionend', swapEnd);

        swapID(tile, tileSwap);

        tile.style.transform = `translate(${Math.round(matrix1.m41 - (rectTile.left - rectCell1.left) - offsetLeft)}px, ${Math.round(matrix1.m42 - (rectTile.top - rectCell1.top) - offsetTop)}px)`;
        tileSwap.style.transform = `translate(${Math.round(matrix2.m41 + offsetLeft)}px, ${Math.round(matrix2.m42 + offsetTop)}px)`;

        if (win()) {
            tileSwap.addEventListener('transitionend', freezeBoard);
            return;
        }
        return;
    }

    tile.style.transform = `translate(${Math.round(matrix1.m41 - (rectTile.left - rectCell1.left))}px, ${Math.round(matrix1.m42 - (rectTile.top - rectCell1.top))}px)`;

    if (tile.dataset.x0 == tile.dataset.x && tile.dataset.y0 == tile.dataset.y) tile.dispatchEvent(event);
}

const returnTile = () => {
            
    document.querySelectorAll('.move').forEach(tile => {

        let cell = document.querySelector(`#${tile.id.replace('t', 'c')}`);
        let style = window.getComputedStyle(tile);
        let matrix = new WebKitCSSMatrix(style.transform);
        let rectTile = tile.getBoundingClientRect();
        let rectCell = cell.getBoundingClientRect();

        tile.classList.remove('move');

        tile.removeEventListener('touchmove', touchMove);
        document.removeEventListener('mousemove', mouseMove);
        tile.removeEventListener('touchend', endMove);
        tile.removeEventListener('touchcancel', endMove);
        document.removeEventListener('mouseup', endMove);

        tile.style.transform = `translate(${Math.round(matrix.m41 - (rectTile.left - rectCell.left))}px, ${Math.round(matrix.m42 - (rectTile.top - rectCell.top))}px)`;
    });
}

const enableTouch = () => {
    document.querySelectorAll('.tile').forEach((tile) => {
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

const init = () => {

    disableTapZoom();
    setBoardSize();
    headerColors();
    tilesColors();
    shuffleTiles();
    showBoard();
    setTimeout(enableTouch, 500);
}

window.onload = document.fonts.ready.then(init());
