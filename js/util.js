function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getEmptyCellsIdx(board){
    var emptyCells  = []

    for(var i =0 ; i< board.length;i++){
        var currRow = board[i]
        for(var j = 0; j < currRow.length;j++){
            var currCell = currRow[j]
            if(currCell.type === 'FLOOR' && currCell.gameElement === null){
                var emptyIdx = {i,j}
                emptyCells.push(emptyIdx)
            }
        }
    }
    return emptyCells
}

function getEmptyCellIdx(board) {
    	var emptyCellsIdx = getEmptyCellsIdx(board)
    	var rndIdx = getRandomInt(0, emptyCellsIdx.length)
    	var emptyCellIdx = emptyCellsIdx[rndIdx]
    	return emptyCellIdx
    }
    

function getRandomInt(min, max) {

    var randomNum = (Math.random()) * (max - min) + min
    randomNum = Math.floor(randomNum)
    return randomNum
}
