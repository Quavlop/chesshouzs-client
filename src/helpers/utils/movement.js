const noMovement = (position, state) => {
    const boardSize = state.length

    var newState = state.map(row => row.slice());
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            newState[row][col].validMove = false
        }
    }

    return newState     
}

const pawnMovement = (position, state) => {
    const boardSize = state.length

    var newState = state.map(row => row.slice());
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            newState[row][col].validMove = false
            if ((pawnStraightMovementValidator(position, {row, col}, newState[row][col], newState) || pawnKillMovementValidator(position, {row, col}, newState[row][col])) && (!newState[row][col].characterColor || position.characterColor != newState[row][col].characterColor)){
                newState[row][col].validMove = true
            }
        }
    }

    return newState    
}
const kingMovement = (position, state) => {
    const boardSize = state.length

    var newState = state.map(row => row.slice());
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            newState[row][col].validMove = false
            if (kingMovementValidator(position, {row, col}, newState[row][col]) && (!newState[row][col].characterColor || position.characterColor != newState[row][col].characterColor)){
                newState[row][col].validMove = true
            }
        }
    }

    return newState
}
const knightMovement = (position, state) => {
    const boardSize = state.length

    var newState = state.map(row => row.slice());
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            newState[row][col].validMove = false
            if (knightShapeMovementValidator(position, {row, col}, newState[row][col]) && (!newState[row][col].characterColor || position.characterColor != newState[row][col].characterColor)){
                newState[row][col].validMove = true
            }
        }
    }

    return newState
}
const queenMovement = (position, state) => {
    const boardSize = state.length

    var newState = state.map(row => row.slice());
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            newState[row][col].validMove = false
        }
    } 

    // to up
    for (let row = position.row; row >= 0; row--){
        if (row == position.row) continue
        newState[row][position.col].validMove = true
        if (newState[row][position.col].characterColor && newState[row][position.col].characterColor != position.characterColor){
            break
        } else if (newState[row][position.col].characterColor){
            newState[row][position.col].validMove = false
            break
        } 
    }

    // to down
    for (let row = position.row; row < boardSize; row++){
        if (row == position.row) continue
        newState[row][position.col].validMove = true
        if (newState[row][position.col].characterColor && newState[row][position.col].characterColor != position.characterColor){
            break
        } else if (newState[row][position.col].characterColor){
            newState[row][position.col].validMove = false
            break
        }
    }

    // to left
    for (let col = position.col; col >= 0; col--){
        if (col == position.col) continue
        newState[position.row][col].validMove = true
        if (newState[position.row][col].characterColor && newState[position.row][col].characterColor != position.characterColor){
            break
        } else if (newState[position.row][col].characterColor){
            newState[position.row][col].validMove = false
            break
        } 
    }

    // to right
    for (let col = position.col; col < boardSize; col++){
        if (col == position.col) continue
        newState[position.row][col].validMove = true
        if (newState[position.row][col].characterColor && newState[position.row][col].characterColor != position.characterColor){
            break
        } else if (newState[position.row][col].characterColor){
            newState[position.row][col].validMove = false
            break
        } 
    }

    // top-left 
    var rowCtr = position.row
    var colCtr = position.col 
    while (rowCtr > 0 && colCtr > 0){
        if (newState[rowCtr-1][colCtr-1].characterColor && newState[rowCtr-1][colCtr-1].characterColor == position.characterColor && position.row != rowCtr-1 && position.col != colCtr-1) break
        newState[--rowCtr][--colCtr].validMove = true 
        if (newState[rowCtr][colCtr].characterColor && newState[rowCtr][colCtr].characterColor != position.characterColor) break
    }
    
    // top-right 
    rowCtr = position.row
    colCtr = position.col 
    while (rowCtr > 0 && colCtr < boardSize - 1){
        if (newState[rowCtr-1][colCtr+1].characterColor && newState[rowCtr-1][colCtr+1].characterColor == position.characterColor && position.row != rowCtr-1 && position.col != colCtr+1) break
        newState[--rowCtr][++colCtr].validMove = true
        if (newState[rowCtr][colCtr].characterColor && newState[rowCtr][colCtr].characterColor != position.characterColor) break
    }

    // bottom-left 
    rowCtr = position.row
    colCtr = position.col 
    while (rowCtr < boardSize - 1 && colCtr > 0){
        if (newState[rowCtr+1][colCtr-1].characterColor && newState[rowCtr+1][colCtr-1].characterColor == position.characterColor && position.row != rowCtr+1 && position.col != colCtr-1) break
        newState[++rowCtr][--colCtr].validMove = true
        if (newState[rowCtr][colCtr].characterColor && newState[rowCtr][colCtr].characterColor != position.characterColor) break
    }
    
    // bottom-right
    rowCtr = position.row
    colCtr = position.col 
    while (rowCtr < boardSize - 1 && colCtr < boardSize - 1){
        if (newState[rowCtr+1][colCtr+1].characterColor && newState[rowCtr+1][colCtr+1].characterColor == position.characterColor && position.row != rowCtr+1 && position.col != colCtr+1) break
        newState[++rowCtr][++colCtr].validMove = true
        if (newState[rowCtr][colCtr].characterColor && newState[rowCtr][colCtr].characterColor != position.characterColor) break
    }

      return newState
    
}
const bishopMovement = (position, state) => {
    const boardSize = state.length

    var newState = state.map(row => row.slice());
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            newState[row][col].validMove = false
        }
    }

    // top-left 
    var rowCtr = position.row
    var colCtr = position.col 
    while (rowCtr > 0 && colCtr > 0){
        if (newState[rowCtr-1][colCtr-1].characterColor && newState[rowCtr-1][colCtr-1].characterColor == position.characterColor && position.row != rowCtr-1 && position.col != colCtr-1) break
        newState[--rowCtr][--colCtr].validMove = true 
        if (newState[rowCtr][colCtr].characterColor && newState[rowCtr][colCtr].characterColor != position.characterColor) break
    }
    
    // top-right 
    rowCtr = position.row
    colCtr = position.col 
    while (rowCtr > 0 && colCtr < boardSize - 1){
        if (newState[rowCtr-1][colCtr+1].characterColor && newState[rowCtr-1][colCtr+1].characterColor == position.characterColor && position.row != rowCtr-1 && position.col != colCtr+1) break
        newState[--rowCtr][++colCtr].validMove = true
        if (newState[rowCtr][colCtr].characterColor && newState[rowCtr][colCtr].characterColor != position.characterColor) break
    }

    // bottom-left 
    rowCtr = position.row
    colCtr = position.col 
    while (rowCtr < boardSize - 1 && colCtr > 0){
        if (newState[rowCtr+1][colCtr-1].characterColor && newState[rowCtr+1][colCtr-1].characterColor == position.characterColor && position.row != rowCtr+1 && position.col != colCtr-1) break
        newState[++rowCtr][--colCtr].validMove = true
        if (newState[rowCtr][colCtr].characterColor && newState[rowCtr][colCtr].characterColor != position.characterColor) break
    }
    
    // bottom-right
    rowCtr = position.row
    colCtr = position.col 
    while (rowCtr < boardSize - 1 && colCtr < boardSize - 1){
        if (newState[rowCtr+1][colCtr+1].characterColor && newState[rowCtr+1][colCtr+1].characterColor == position.characterColor && position.row != rowCtr+1 && position.col != colCtr+1) break
        newState[++rowCtr][++colCtr].validMove = true
        if (newState[rowCtr][colCtr].characterColor && newState[rowCtr][colCtr].characterColor != position.characterColor) break
    }

    return newState
}
const rookMovement = (position, state) => {
    const boardSize = state.length

    var newState = state.map(row => row.slice());
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            newState[row][col].validMove = false
        }
    } 

    // to up
    for (let row = position.row; row >= 0; row--){
        if (row == position.row) continue
        newState[row][position.col].validMove = true
        if (newState[row][position.col].characterColor && newState[row][position.col].characterColor != position.characterColor){
            break
        } else if (newState[row][position.col].characterColor){
            newState[row][position.col].validMove = false
            break
        } 
    }

    // to down
    for (let row = position.row; row < boardSize; row++){
        if (row == position.row) continue
        newState[row][position.col].validMove = true
        if (newState[row][position.col].characterColor && newState[row][position.col].characterColor != position.characterColor){
            break
        } else if (newState[row][position.col].characterColor){
            newState[row][position.col].validMove = false
            break
        }
    }

    // to left
    for (let col = position.col; col >= 0; col--){
        if (col == position.col) continue
        newState[position.row][col].validMove = true
        if (newState[position.row][col].characterColor && newState[position.row][col].characterColor != position.characterColor){
            break
        } else if (newState[position.row][col].characterColor){
            newState[position.row][col].validMove = false
            break
        } 
    }

    // to right
    for (let col = position.col; col < boardSize; col++){
        if (col == position.col) continue
        newState[position.row][col].validMove = true
        if (newState[position.row][col].characterColor && newState[position.row][col].characterColor != position.characterColor){
            break
        } else if (newState[position.row][col].characterColor){
            newState[position.row][col].validMove = false
            break
        } 
    }

    return newState
}


const diagonalMovementValidator = (characterPosition, clickablePosition, status) => {
    const rowDiff = Math.abs(characterPosition.row - clickablePosition.row)
    const colDiff = Math.abs(characterPosition.col - clickablePosition.col)
    return rowDiff == colDiff && rowDiff && colDiff
}

const straightMovementValidator = (characterPosition, clickablePosition, status) => {
    return characterPosition.row == clickablePosition.row ^ characterPosition.col == clickablePosition.col
}

const knightShapeMovementValidator = (characterPosition, clickablePosition, status) => {
    return  (Math.abs(characterPosition.row - clickablePosition.row) == 2)  && Math.abs(characterPosition.col - clickablePosition.col) == 1
            || 
        (Math.abs(characterPosition.col - clickablePosition.col) == 2) && Math.abs(characterPosition.row - clickablePosition.row) == 1
}

const kingMovementValidator = (characterPosition, clickablePosition, status) => {
    return (diagonalMovementValidator(characterPosition, clickablePosition, status) || straightMovementValidator(characterPosition, clickablePosition, status))
        && (Math.abs(characterPosition.col - clickablePosition.col) == 1 || Math.abs(characterPosition.row - clickablePosition.row) == 1)
}

const pawnStraightMovementValidator = (characterPosition, clickablePosition, status, state) => {
    var step = 1
    if (status.inDefaultPosition){
        step = 2
    }
    const diff = characterPosition.row - clickablePosition.row 
    if (characterPosition.characterColor == "WHITE"){  
        if (diff == step && status.inDefaultPosition) {
            if (!pawnStraightMovementValidator(characterPosition, {...clickablePosition, row : clickablePosition.row + 1}, {
                ...status, 
                characterColor : state[clickablePosition.row+1][clickablePosition.col].characterColor
            }, state)){
                return false
            }
        }
        return characterPosition.col == clickablePosition.col && diff <= step && diff > 0 && !status.characterColor
    }
    
    if (-diff == step && status.inDefaultPosition) {
        if (!pawnStraightMovementValidator(characterPosition, {...clickablePosition, row : clickablePosition.row - 1}, {
            ...status, 
            characterColor : state[clickablePosition.row-1][clickablePosition.col].characterColor
        }, state)){
            return false
        }
    }

    return characterPosition.col == clickablePosition.col && -diff <= step && diff < 0 && !status.characterColor
}

const pawnKillMovementValidator = (characterPosition, clickablePosition, status) => {
    if (characterPosition.characterColor == "WHITE"){
        return characterPosition.row - clickablePosition.row == 1 && Math.abs(characterPosition.col - clickablePosition.col) == 1 && status?.character != "."
    }
    return characterPosition.row - clickablePosition.row == -1 && Math.abs(characterPosition.col - clickablePosition.col) == 1 && status?.character != "."
}


export {
    noMovement,
    pawnMovement,
    kingMovement,  
    knightMovement,
    queenMovement, 
    bishopMovement, 
    rookMovement
}
