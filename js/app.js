'use strict'
var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE'

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';
var GLUE_IMG = '<img src="img/glue.png" />'

var gBoard;
var gGamerPos;
var gBallsCounter;
var gIsOnGlue = false
var gIntervals

function initGame() {
	gIntervals = []
	gBallsCounter = 2
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);
	startIntervals(gBoard)
}


function buildBoard() {

	var board = createMat(10, 12)
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {

			var cell = { type: FLOOR, gameElement: null };

			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}
			board[i][j] = cell;
		}
	}
	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	board[0][6].type = FLOOR
	board[i - 1][6].type = FLOOR
	board[5][0].type = FLOOR
	board[5][j - 1].type = FLOOR

	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];
			var cellClass = getClassName({ i: i, j: j })
			cellClass += (currCell.type === FLOOR) ? ' floor' : ' wall';
			strHTML += '\t<td class="cell ' + cellClass +
				'"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}
			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	if (gIsOnGlue) return

	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {
		if (i < 0) i = gBoard.length - 1
		else if (j < 0) j = gBoard[0].length - 1
		else if (i === gBoard.length) i = 0
		else if (j === gBoard[0].length) j = 0

		var targetCell = gBoard[i][j];
		if (targetCell.type === WALL) return;

		if (targetCell.gameElement === BALL) {
			gBallsCounter--
			if (gBallsCounter === 0) {
				gameOver()
			}
		} else if (targetCell.gameElement === GLUE) {
			gIsOnGlue = true
			setTimeout(() => {
				gIsOnGlue = false
			}, 3000)
		}

		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		renderCell(gGamerPos, '');

		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		renderCell(gGamerPos, GAMER_IMG);
	}
}


function addBall(board) {
	var emptyCellIdx = getEmptyCellIdx(board)
	board[emptyCellIdx.i][emptyCellIdx.j].gameElement = BALL
	renderCell(emptyCellIdx, BALL_IMG)
	gBallsCounter++
}

function addGlue(board) {
	var emptyCellIdx = getEmptyCellIdx(board)
	board[emptyCellIdx.i][emptyCellIdx.j].gameElement = GLUE
	renderCell(emptyCellIdx, GLUE_IMG)
	setTimeout(function removeGlue() {
		if (board[emptyCellIdx.i][emptyCellIdx.j].gameElement === GLUE) {
			board[emptyCellIdx.i][emptyCellIdx.j].gameElement = null
			renderCell(emptyCellIdx, '')
		}
	}, 3000)

}


function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;

	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;
	}
}


function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}


function startIntervals(board) {
	
	var ballInterval = setInterval(() => {
		addBall(board)
	}, 2500)

	var glueInterval = setInterval(() => {
		addGlue(board)
	}, 5000)

	gIntervals.push(ballInterval, glueInterval)

}

function gameOver() {
	for (var i = 0; i < gIntervals.length; i++) {
		clearInterval(gIntervals[i])
	}
	console.log('game over');
}

