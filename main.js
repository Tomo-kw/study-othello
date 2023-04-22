// 盤面の縦横数
const BOARD_SIZE = 8;
// 打ち手の状態：初期値は黒が先手
let isBlackTurn = true;
window.onload = () => {
    gameStart()
};

const gameStart = () => {
    isBlackTurn = true;
    const board = createBoard();

    setInitialBoard(board);
    createBoardHtml(board);
    displayPlayer(isBlackTurn);
}

const createBoard = () => {
    const board = [];

    for (let y = 0; y < BOARD_SIZE; y++) {
        const row = [];
        for (let x = 0; x < BOARD_SIZE; x++) {
            row.push({
                x,
                y,
                isStone: false,
                isBlack: false,
                isWhite: false,
                element: null,
            })
        }
        board.push(row);
    }

    return board;
}

// 石の初期値を設定する
const setInitialBoard = (board) => {
    // 画面中央に黒2 * 白2石の石セット
    // 黒
    board[3][4].isBlack = true;
    board[3][4].isStone = true;
    board[4][3].isBlack = true;
    board[4][3].isStone = true;
    // 白
    board[3][3].isWhite = true;
    board[3][3].isStone = true;
    board[4][4].isWhite = true;
    board[4][4].isStone = true;
}

// 盤面をHTMLで生成
const createBoardHtml = (board) => {
    const tableElement = document.getElementById('table');

    for (let y = 0; y < BOARD_SIZE; y++) {
        const trElement = document.createElement('tr');

        for (let x = 0; x < BOARD_SIZE; x++) {
            let tdElement = document.createElement('td');
            board[y][x].element = tdElement
            trElement.appendChild(setCellContent(x, y, tdElement, board));
            trElement.appendChild(setClickEvent(x, y, tdElement, board));
        }
        tableElement.appendChild(trElement);
    }
}

// プレイヤーを画面に表示する
const displayPlayer = (isBlackTurn) => {
    const divElement = document.getElementById('turn');
    divElement.innerText = isBlackTurn ? 'あなたの番 【黒】' : '相手の番 【白】';
}

// 石の初期値状態をセット
const setCellContent = (x, y, tdElement, board) => {
    if (!board[y][x].isStone) {
        tdElement.innerText = null;
    } else if (board[y][x].isBlack) {
        tdElement.innerText = '●';
    } else {
        tdElement.innerText = '🔘';
    }

    return tdElement;
}

const setClickEvent  = (x, y, tdElement, board) => {
    tdElement.onclick = () => {
        // 石を置けるかどうかのチェック
        if (!canPlaceStone(x, y, board, isBlackTurn)) {
            return;
        }

        changeStoneColor(x, y, board, isBlackTurn);
        // 全てのセルが埋まっている場合ゲーム終了
        if (isBoardFull(board)) {
            gameEnd(board);
            return;
        }
        // 打ち手の交代
        isBlackTurn = !isBlackTurn;
        // 打つ場所があるか？ない場合はプレイヤー切り替え
        if (!checkNextPlayerCanPlaceStone(board, isBlackTurn)) {
            alert(isBlackTurn ? '黒は打てないため白のターンになります' : '白は打てないため黒のターンになります');
            isBlackTurn = !isBlackTurn;
        }

        displayPlayer(isBlackTurn)
    }

    return tdElement;
}

// クリックした箇所に石がおけるかどうか
const canPlaceStone = (x, y, board, turnIsBlack) => {
    // 既に石が置いてある場合は置けない
    if (board[y][x].isStone) {
        return false;
    }
    const myColor = turnIsBlack ? 'isBlack' : 'isWhite';
    const opponentColor = turnIsBlack ? 'isWhite' : 'isBlack';

    const adjacentCellXY = [-1, 0, 1];

    for (let i = 0; i < adjacentCellXY.length; i++) {
        for (let j = 0; j < adjacentCellXY.length; j++) {
            const y2  = adjacentCellXY[i];
            const x2  = adjacentCellXY[j];

            // 自身のセルは何もしない
            if (y2 === 0 && x2 === 0) {
                continue;
            }

            // チェックする方向に相手の石があるかどうか
            let hasOpponentStone = false;

            // チェックするセルの座標
            let y3 = y + y2;
            let x3 = x + x2;

            // 配列のインデックスの範囲を超えるまでループ処理
            while(y3 >= 0 && y3 < BOARD_SIZE && x3 >= 0 && x3 < BOARD_SIZE) {
                if (board[y3][x3].isStone) {
                    if (board[y3][x3][opponentColor]) {
                        hasOpponentStone = true;
                    } else if (board[y3][x3][myColor]) {
                        if (hasOpponentStone) {
                            return true;
                        }
                        break;
                    }
                } else {
                    break;
                }

                y3 += y2;
                x3 += x2;
            }
        }
    }
    return false;
}

// 石の色を変更する処理
const changeStoneColor = (x, y, board, turnIsBlack) => {
    const myColor = turnIsBlack ? 'isBlack' : 'isWhite';
    const opponentColor = turnIsBlack ? 'isWhite' : 'isBlack';

    let adjacentCellXY = [-1, 0, 1];

    for (let i = 0; i < adjacentCellXY.length; i++) {
        for (let j = 0; j < adjacentCellXY.length; j++) {
            const y2  = adjacentCellXY[i]
            const x2  = adjacentCellXY[j]

            // 自身のセルは何もしない
            if (y2 === 0 && x2 === 0) {
                continue;
            }

            // クリックしたセルの周りに相手の石があるかどうか
            let hasOpponentStone = false;

            // チェックするセルの座標
            let y3 = y + y2;
            let x3 = x + x2;

            // インデック内ループ
            while(y3 >= 0 && y3 < BOARD_SIZE && x3 >= 0 && x3 < BOARD_SIZE) {
                if (board[y3][x3].isStone) {
                    if (board[y3][x3][opponentColor]) {
                        hasOpponentStone = true;
                    } else if (board[y3][x3][myColor]) {
                        if (hasOpponentStone) {
                            let y4 = y + y2;
                            let x4 = x + x2;

                            while (y4 !== y3 || x4 !== x3) {
                                board[y4][x4][myColor] = true;
                                board[y4][x4][opponentColor] = false;
                                board[y4][x4].element.innerText = turnIsBlack ? '●' : '🔘';

                                y4 += y2;
                                x4 += x2;
                            }
                        }
                        break;
                    }
                } else {
                    break;
                }

                y3 += y2;
                x3 += x2;
            }
        }
    }

    // 置いた石の状態を変更する
    board[y][x][myColor] = true
    board[y][x][opponentColor] = false
    board[y][x].isStone = true;
    board[y][x].element.innerText = turnIsBlack ? '●' : '🔘';
}

// プレイヤーが切り替わった際に盤面に石を置く場所があるか
const checkNextPlayerCanPlaceStone = (board, isBlackTurn) => {
    // 配列内のいずれかの要素が条件に合致しているかを判定
    return board.some((row) => row.some((cell) => !cell.isStone &&
        canPlaceStone(cell.x , cell.y, board, isBlackTurn)))
}

// 全てのセルが埋まっているかどうかのチェック
const isBoardFull = (board) => {
    return !board.some((row) => row.some((cell) => !cell.isStone))
}

const countStones = (board) => {
    let blackStones = 0;
    let whiteStones = 0;

    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            if (board[y][x].isBlack) {
                blackStones++;
                continue;
            }
            if (board[y][x].isWhite) {
                whiteStones++;
            }
        }
    }
    return {blackStones, whiteStones};
}

const resetGame = () => {
    document.getElementById('table').innerText = '';
    document.getElementById('result').innerText = '';
    document.getElementById('winner').innerText = '';

    gameStart();
}

const gameEnd = (board) => {
    const {blackStones, whiteStones} = countStones(board);

    displayStones(blackStones, whiteStones);
    displayWinner(blackStones, whiteStones);
}

const displayStones = (blackStones, whiteStones) => {
    const resultElement =  document.getElementById('result');

    resultElement.innerText = `黒：${blackStones}枚  白：${whiteStones}枚`;
}

const displayWinner = (blackStones, whiteStones) => {
    const winnerElement =  document.getElementById('winner');

    if (blackStones > whiteStones) {
        winnerElement.innerText = 'ゲーム終了！黒の勝利！！！';
    } else if (blackStones < whiteStones) {
        winnerElement.innerText = 'ゲーム終了！白の勝利！！！';
    } else {
        winnerElement.innerText = 'ゲーム終了！引き分け！！！';
    }
}

