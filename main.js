// 盤面の縦横数
const BOARD_LENGTH = 8;
// 確認用
// const BOARD_LENGTH = 4;
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

    for (let y = 0; y < BOARD_LENGTH; y++) {
        const row = [];

        for (let x = 0; x < BOARD_LENGTH; x++) {
            row.push({
                x,
                y,
                stoneStatus: null,
                element: null,
            })
        }
        board.push(row);
    }

    return board;
}

// 石の初期値を設定する,冗長
const setInitialBoard = (board) => {
    // 画面中央に黒2 * 白2石の石セット
    board[3][4].stoneStatus = 'black';
    board[4][3].stoneStatus = 'black';
    board[3][3].stoneStatus = 'white';
    board[4][4].stoneStatus = 'white';

    // 4*4用
    // board[1][2].stoneStatus = 'black';
    // board[2][1].stoneStatus = 'black';
    // board[1][1].stoneStatus = 'white';
    // board[2][2].stoneStatus = 'white';
}

// 盤面をHTMLで生成
const createBoardHtml = (board) => {
    const tableElement = document.getElementById('table');

    for (let y = 0; y < BOARD_LENGTH; y++) {
        const trElement = document.createElement('tr');

        for (let x = 0; x < BOARD_LENGTH; x++) {
            let tdElement = document.createElement('td');

            setCellContent(tdElement, board, x, y);
            setClickEvent(tdElement, board, x, y);

            board[y][x].element = tdElement
            trElement.appendChild(tdElement);
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
const setCellContent = (tdElement, board, x, y) => {
    if (board[y][x].stoneStatus === null) {
        tdElement.innerText = null;
    } else if (board[y][x].stoneStatus === 'black') {
        tdElement.innerText = '●';
    } else {
        tdElement.innerText = '🔘';
    }
}

const setClickEvent  = (tdElement, board, x, y) => {
    tdElement.onclick = () => {
        // 石を置けるかどうかのチェック
        if (!canPlaceStone(board, isBlackTurn, x, y)) {
            return;
        }

        changeStoneColor(board, isBlackTurn, x, y);
        // 全てのセルが埋まっている場合ゲーム終了
        if (isBoardFull(board)) {
            gameEnd(board);
            return;
        }
        // 打つ場所があるか？ない場合はプレイヤー切り替え
        if (!checkNextPlayerCanPlaceStone(board, !isBlackTurn)) {
            alert(!isBlackTurn ? '黒は打てないため白のターンになります' : '白は打てないため黒のターンになります');
        } else {
            isBlackTurn = !isBlackTurn;
        }

        displayPlayer(isBlackTurn)
    }
}

// クリックした箇所に石がおけるかどうか
const canPlaceStone = (board, turnIsBlack, x, y) => {
    // 既に石が置いてある場合は置けない
    if (board[y][x].stoneStatus) {
        return false;
    }

    const myColor = turnIsBlack ? 'black' : 'white';
    const opponentColor = turnIsBlack ? 'white' : 'black';

    const adjacentCellXY = [-1, 0, 1];

    for (let i = 0; i < adjacentCellXY.length; i++) {
        for (let j = 0; j < adjacentCellXY.length; j++) {
            const dy  = adjacentCellXY[i]
            const dx  = adjacentCellXY[j]

            // 自身のセルは何もしない
            if (dy === 0 && dx === 0) {
                continue;
            }

            // チェックする方向に相手の石があるかどうか
            let hasOpponentStone = false;

            // チェックするセルの座標
            let y2 = y + dy;
            let x2 = x + dx;

            // 配列のインデックスの範囲を超えるまでループ処理
            while(y2 >= 0 && y2 < BOARD_LENGTH && x2 >= 0 && x2 < BOARD_LENGTH) {
                // 石がない場合
                if (!board[y2][x2].stoneStatus) {
                    break;
                }
                // 石の色を確認
                if (board[y2][x2].stoneStatus === opponentColor) {
                    hasOpponentStone = true;
                } else if (board[y2][x2].stoneStatus === myColor && hasOpponentStone) {
                    return true;
                } else {
                    break;
                }

                y2 += dy;
                x2 += dx;
            }
        }
    }
    return false;
}

// 石の色を変更する処理
const changeStoneColor = (board, turnIsBlack, x, y) => {
    const myColor = turnIsBlack ? 'black' : 'white';
    const opponentColor = turnIsBlack ? 'white' : 'black';

    let adjacentCellXY = [-1, 0, 1];

    for (let i = 0; i < adjacentCellXY.length; i++) {
        for (let j = 0; j < adjacentCellXY.length; j++) {
            const dy  = adjacentCellXY[i]
            const dx  = adjacentCellXY[j]

            // 自身のセルは何もしない
            if (dy === 0 && dx === 0) {
                continue;
            }

            // クリックしたセルの周りに相手の石があるかどうか
            let hasOpponentStone = false;

            // チェックするセルの座標
            let y2 = y + dy;
            let x2 = x + dx;

            // 配列のインデックスの範囲を超えるまでループ処理
            while(y2 >= 0 && y2 < BOARD_LENGTH && x2 >= 0 && x2 < BOARD_LENGTH) {
                // 石がない場合
                if (!board[y2][x2].stoneStatus) {
                    break;
                }
                // 石の色を確認
                if (board[y2][x2].stoneStatus === opponentColor) {
                    hasOpponentStone = true;
                } else if (board[y2][x2].stoneStatus === myColor && hasOpponentStone) {
                    let y3 = y + dy;
                    let x3 = x + dx;

                    while (y3 !== y2 || x3 !== x2) {
                        board[y3][x3].stoneStatus = myColor;
                        board[y3][x3].element.innerText = turnIsBlack ? '●' : '🔘';

                        y3 += dy;
                        x3 += dx;
                    }
                } else {
                    break;
                }

                y2 += dy;
                x2 += dx;
            }
        }
    }

    // 置いた石の状態を変更する
    board[y][x].stoneStatus = myColor;
    board[y][x].element.innerText = turnIsBlack ? '●' : '🔘';
}

// プレイヤーが切り替わった際に盤面に石を置く場所があるか
const checkNextPlayerCanPlaceStone = (board, isBlackTurn) => {
    // 配列内のいずれかの要素が条件に合致しているかを判定
    return board.some((row) => row.some((cell) => !cell.stoneStatus &&
        canPlaceStone(board, isBlackTurn, cell.x , cell.y)))
}

// 全てのセルが埋まっているかどうかのチェック
const isBoardFull = (board) => {
    return !board.some((row) => row.some((cell) => !cell.stoneStatus))
}

const countStones = (board) => {
    let blackStones = 0;
    let whiteStones = 0;

    for (let y = 0; y < BOARD_LENGTH; y++) {
        for (let x = 0; x < BOARD_LENGTH; x++) {
            if (board[y][x].stoneStatus === 'black') {
                blackStones++;
            } else if (board[y][x].stoneStatus === 'white') {
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

