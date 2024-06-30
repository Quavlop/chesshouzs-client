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
            if (pawnStraightMovementValidator(position, {row, col}, newState[row][col]) || pawnKillMovementValidator(position, {row, col}, newState[row][col])){
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
            if (kingMovementValidator(position, {row, col}, newState[row][col])){
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
            if (knightShapeMovementValidator(position, {row, col}, newState[row][col])){
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
            if (diagonalMovementValidator(position, {row, col}, newState[row][col]) || straightMovementValidator(position, {row, col}, newState[row][col])){
                newState[row][col].validMove = true
            }
        }
    }

    return newState
    
}
const bishopMovement = (position, state) => {
    const boardSize = state.length

    var newState = state.map(row => row.slice());
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            newState[row][col].validMove = false
            if (diagonalMovementValidator(position, {row, col}, newState[row][col])){
                newState[row][col].validMove = true
            }
        }
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
        newState[row][position.col].validMove = true
        if (newState[row][position.col].characterColor && newState[row][position.col].characterColor != position.characterColor){
            break
        }
    }

    // to down
    for (let row = position.row; row < boardSize; row++){
        newState[row][position.col].validMove = true
        if (newState[row][position.col].characterColor && newState[row][position.col].characterColor != position.characterColor){
            break
        }
    }

    // to left
    for (let col = position.col; col >= 0; col--){
        newState[position.row][col].validMove = true
        if (newState[position.row][col].characterColor && newState[position.row][col].characterColor != position.characterColor){
            break
        }
    }

    // to right
    for (let col = position.col; col < boardSize; col++){
        newState[position.row][col].validMove = true
        if (newState[position.row][col].characterColor && newState[position.row][col].characterColor != position.characterColor){
            break
        }
    }



    // to right 

    // to up 

    // to down

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

const pawnStraightMovementValidator = (characterPosition, clickablePosition, status) => {
    var step = 1
    if (status.inDefaultPosition){
        step = 2
    }
    const diff = characterPosition.row - clickablePosition.row 
    return characterPosition.col == clickablePosition.col && diff <= step && diff > 0
}

const pawnKillMovementValidator = (characterPosition, clickablePosition, status) => {
    return characterPosition.row - clickablePosition.row == 1 && Math.abs(characterPosition.col - clickablePosition.col) == 1 && status?.character != "."
}

const straightMoveBlockHandler = (characterPosition, clickablePosition, status) => {
    // if same color 
    if (status.character.toLowerCase() == status.character){
        
    }
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
