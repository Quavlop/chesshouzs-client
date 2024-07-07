import constants from "@/config/constants/game";
import { LinkedList, Node } from "./linked_list";

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
            if (kingMovementValidator(position, {row, col}, newState[row][col]) && (!newState[row][col].characterColor || position.characterColor != newState[row][col].characterColor) && !kingUnsafePositionHandler(position.characterColor, {row, col}, state)){
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

    var disableBottomToUpRightMove = validateDisableBottomToUpRightDiagonalMovement(boardSize, position, newState)
    var disableUpToBottomRightMove = validateDisableDownToRightDiagonalMovement(boardSize, position, newState)

    // top-left 
    if (!disableUpToBottomRightMove){
        var rowCtr = position.row
        var colCtr = position.col 
        while (rowCtr > 0 && colCtr > 0){
            if (newState[rowCtr-1][colCtr-1].characterColor && newState[rowCtr-1][colCtr-1].characterColor == position.characterColor && position.row != rowCtr-1 && position.col != colCtr-1) break
            newState[--rowCtr][--colCtr].validMove = true 
            if (newState[rowCtr][colCtr].characterColor && newState[rowCtr][colCtr].characterColor != position.characterColor) break
        }
    }
    
    // top-right 
    if (!disableBottomToUpRightMove){
        rowCtr = position.row
        colCtr = position.col 
        while (rowCtr > 0 && colCtr < boardSize - 1){
            if (newState[rowCtr-1][colCtr+1].characterColor && newState[rowCtr-1][colCtr+1].characterColor == position.characterColor && position.row != rowCtr-1 && position.col != colCtr+1) break
            newState[--rowCtr][++colCtr].validMove = true
            if (newState[rowCtr][colCtr].characterColor && newState[rowCtr][colCtr].characterColor != position.characterColor) break
        }
    }


    // bottom-left 
    if (!disableBottomToUpRightMove){
        rowCtr = position.row
        colCtr = position.col 
        while (rowCtr < boardSize - 1 && colCtr > 0){
            if (newState[rowCtr+1][colCtr-1].characterColor && newState[rowCtr+1][colCtr-1].characterColor == position.characterColor && position.row != rowCtr+1 && position.col != colCtr-1) break
            newState[++rowCtr][--colCtr].validMove = true
            if (newState[rowCtr][colCtr].characterColor && newState[rowCtr][colCtr].characterColor != position.characterColor) break
        }
    }
    
    if (!disableUpToBottomRightMove){
        // bottom-right
        rowCtr = position.row
        colCtr = position.col 
        while (rowCtr < boardSize - 1 && colCtr < boardSize - 1){
            if (newState[rowCtr+1][colCtr+1].characterColor && newState[rowCtr+1][colCtr+1].characterColor == position.characterColor && position.row != rowCtr+1 && position.col != colCtr+1) break
            newState[++rowCtr][++colCtr].validMove = true
            if (newState[rowCtr][colCtr].characterColor && newState[rowCtr][colCtr].characterColor != position.characterColor) break
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

   
    var disableHorizontalMove = validateDisableHorizontalMovement(boardSize, position, newState)
    var disableVerticalMove = validateDisableVerticalMovement(boardSize, position, newState)
    

    // check if there's any horizontal attacker

    if (!disableVerticalMove){
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
    }


    if (!disableHorizontalMove){
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

const kingUnsafePositionHandler = (kingColor, moveCandidate, state) => {
    // only trigger on kingMovement function
    const boardSize = state.length

    // give ineligible for king flag for each square if under attack
    var newState = state.map(row => row.slice());
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (!newState[row][col].characterColor || newState[row][col].characterColor == kingColor){
                continue 
            }

            if (newState[row][col].character == constants.CHARACTER_PAWN || newState[row][col].character == constants.CHARACTER_PAWN.toUpperCase()){
                if (!pawnKillMovementValidator({row, col, characterColor : kingColor == "BLACK" ? "WHITE" : "BLACK"}, {row : moveCandidate.row, col : moveCandidate.col}, newState)){
                    continue
                }
                return true
            } else if (newState[row][col].character == constants.CHARACTER_BISHOP || newState[row][col].character == constants.CHARACTER_BISHOP.toUpperCase()){
                if (!diagonalMovementValidator({row, col, characterColor : kingColor == "BLACK" ? "WHITE" : "BLACK"}, {row : moveCandidate.row, col : moveCandidate.col}, newState)){
                    continue
                }

                // diagonal move handler 

                if (moveCandidate.col > col && moveCandidate.row < row){
                    // bishop center, target on top - right 
                    var iRow = row 
                    var iCol = col
                    while (iRow >= moveCandidate.row && iCol <= moveCandidate.col){
                        if (iRow == row || iCol == col) {
                            iRow-- 
                            iCol++
                            continue
                        }
                        if (newState[iRow][iCol].characterColor && newState[iRow][iCol].characterColor != newState[row][col].characterColor) {
                            return false
                        }
                        iRow--
                        iCol++
                    }
                    return true
                } else if (moveCandidate.col > col && moveCandidate.row > row){
                    // bishop center, target on bottom - right
                    var iRow = row 
                    var iCol = col
                    while (iRow <= moveCandidate.row && iCol <= moveCandidate.col){
                        if (iRow == row || iCol == col) {
                            iRow++ 
                            iCol++
                            continue
                        }
                        if (newState[iRow][iCol].characterColor && newState[iRow][iCol].characterColor != newState[row][col].characterColor) {
                            return false
                        }
                        iRow++ 
                        iCol++
                    }
                    return true
                } else if (moveCandidate.col < col && moveCandidate.row < row) {
                    // bishop center, target on top - left
                    var iRow = row 
                    var iCol = col
                    while (iRow >= moveCandidate.row && iCol >= moveCandidate.col){
                        if (iRow == row || iCol == col) {
                            iRow-- 
                            iCol--
                            continue
                        }
                        if (newState[iRow][iCol].characterColor && newState[iRow][iCol].characterColor != newState[row][col].characterColor) {
                            return false
                        }
                        iRow-- 
                        iCol--
                    }
                    return true
                } else {
                    // bishop center, target on bottom - left
                    var iRow = row 
                    var iCol = col
                    while (iRow <= moveCandidate.row && iCol >= moveCandidate.col){
                        if (iRow == row || iCol == col) {
                            iRow++ 
                            iCol--
                            continue
                        }
                        if (newState[iRow][iCol].characterColor && newState[iRow][iCol].characterColor != newState[row][col].characterColor) {
                            return false
                        }
                        iRow++ 
                        iCol--
                    }
                    return true
                }


            } else if (newState[row][col].character == constants.CHARACTER_ROOK || newState[row][col].character == constants.CHARACTER_ROOK.toUpperCase()) {
                if (!straightMovementValidator({row, col, characterColor : kingColor == "BLACK" ? "WHITE" : "BLACK"}, {row : moveCandidate.row, col : moveCandidate.col}, newState)){
                    continue
                }

                // straight move handler
                if (moveCandidate.row == row){
                    if (col > moveCandidate.col){ // if rook on the right, king on the left then invert the direction 
                        for (let iCol = col; iCol >= moveCandidate.col; iCol--){
                            if (iCol == col) continue
                            if (newState[row][iCol].characterColor && newState[row][iCol].characterColor != newState[row][col].characterColor){
                                return false
                            }
                        } 
                        return true
                    } else { // rook on left, king on right
                        for (let iCol = col; iCol <= moveCandidate.col; iCol++){
                            if (iCol == col) continue
                            if (newState[row][iCol].characterColor && newState[row][iCol].characterColor != newState[row][col].characterColor){
                                return false
                            }
                        } 
                        return true
                    }
                } else if (moveCandidate.col == col){
                    if (row < moveCandidate.row){ // rook on top, king on bottom
                        for (let iRow = row; iRow <= moveCandidate.row; iRow++){
                            if (iRow == row) continue
                            if (newState[iRow][col].characterColor && newState[iRow][col].characterColor != newState[row][col].characterColor){
                                return false
                            }
                        } 
                        return true
                    } else { // rook on bottom, king on top
                        for (let iRow = row; iRow >= moveCandidate.row; iRow--){
                            if (iRow == row) continue
                            if (newState[iRow][col].characterColor && newState[iRow][col].characterColor != newState[row][col].characterColor){
                                return false
                            }
                        } 
                        return true
                    }
                }

            } else if (newState[row][col].character == constants.CHARACTER_QUEEN || newState[row][col].character == constants.CHARACTER_QUEEN.toUpperCase()) {
                if (!straightMovementValidator({row, col, characterColor : kingColor == "BLACK" ? "WHITE" : "BLACK"}, {row : moveCandidate.row, col : moveCandidate.col}, newState) && !diagonalMovementValidator({row, col, characterColor : kingColor == "BLACK" ? "WHITE" : "BLACK"}, {row : moveCandidate.row, col : moveCandidate.col}, newState)){
                    continue
                }

                   // straight move handler
                   if (moveCandidate.row == row){
                    if (col > moveCandidate.col){ // if rook on the right, king on the left then invert the direction 
                        for (let iCol = col; iCol >= moveCandidate.col; iCol--){
                            if (iCol == col) continue
                            if (newState[row][iCol].characterColor && newState[row][iCol].characterColor != newState[row][col].characterColor){
                                return false
                            }
                        } 
                        return true
                    } else { // rook on left, king on right
                        for (let iCol = col; iCol <= moveCandidate.col; iCol++){
                            if (iCol == col) continue
                            if (newState[row][iCol].characterColor && newState[row][iCol].characterColor != newState[row][col].characterColor){
                                return false
                            }
                        } 
                        return true
                    }
                } else if (moveCandidate.col == col){
                    if (row < moveCandidate.row){ // rook on top, king on bottom
                        for (let iRow = row; iRow <= moveCandidate.row; iRow++){
                            if (iRow == row) continue
                            if (newState[iRow][col].characterColor && newState[iRow][col].characterColor != newState[row][col].characterColor){
                                return false
                            }
                        } 
                        return true
                    } else { // rook on bottom, king on top
                        for (let iRow = row; iRow >= moveCandidate.row; iRow--){
                            if (iRow == row) continue
                            if (newState[iRow][col].characterColor && newState[iRow][col].characterColor != newState[row][col].characterColor){
                                return false
                            }
                        } 
                        return true
                    }
                }


                                 // diagonal move handler 

                if (moveCandidate.col > col && moveCandidate.row < row){
                    // bishop center, target on top - right 
                    var iRow = row 
                    var iCol = col
                    while (iRow >= moveCandidate.row && iCol <= moveCandidate.col){
                        if (iRow == row || iCol == col) {
                            iRow-- 
                            iCol++
                            continue
                        }
                        if (newState[iRow][iCol].characterColor && newState[iRow][iCol].characterColor != newState[row][col].characterColor) {
                            return false
                        }
                        iRow--
                        iCol++
                    }
                    return true
                } else if (moveCandidate.col > col && moveCandidate.row > row){
                    // bishop center, target on bottom - right
                    var iRow = row 
                    var iCol = col
                    while (iRow <= moveCandidate.row && iCol <= moveCandidate.col){
                        if (iRow == row || iCol == col) {
                            iRow++ 
                            iCol++
                            continue
                        }
                        if (newState[iRow][iCol].characterColor && newState[iRow][iCol].characterColor != newState[row][col].characterColor) {
                            return false
                        }
                        iRow++ 
                        iCol++
                    }
                    return true
                } else if (moveCandidate.col < col && moveCandidate.row < row) {
                    // bishop center, target on top - left
                    var iRow = row 
                    var iCol = col
                    while (iRow >= moveCandidate.row && iCol >= moveCandidate.col){
                        if (iRow == row || iCol == col) {
                            iRow-- 
                            iCol--
                            continue
                        }
                        if (newState[iRow][iCol].characterColor && newState[iRow][iCol].characterColor != newState[row][col].characterColor) {
                            return false
                        }
                        iRow-- 
                        iCol--
                    }
                    return true
                } else {
                    // bishop center, target on bottom - left
                    var iRow = row 
                    var iCol = col
                    while (iRow <= moveCandidate.row && iCol >= moveCandidate.col){
                        if (iRow == row || iCol == col) {
                            iRow++ 
                            iCol--
                            continue
                        }
                        if (newState[iRow][iCol].characterColor && newState[iRow][iCol].characterColor != newState[row][col].characterColor) {
                            return false
                        }
                        iRow++ 
                        iCol--
                    }
                    return true
                }
            
            } else if (newState[row][col].character == constants.CHARACTER_KING || newState[row][col].character == constants.CHARACTER_KING.toUpperCase()) {
                console.log(moveCandidate, {row, col}, Math.abs(moveCandidate.row-row), Math.abs(moveCandidate.col - col))
                if (Math.abs(moveCandidate.col - col) <= 1 && Math.abs(moveCandidate.row - row) <= 1){
                    return true
                } 
            } else if (newState[row][col].character == constants.CHARACTER_KNIGHT || newState[row][col].character == constants.CHARACTER_KNIGHT.toUpperCase()){
                if (!knightShapeMovementValidator({row, col, characterColor : kingColor == "BLACK" ? "WHITE" : "BLACK"}, {row : moveCandidate.row, col : moveCandidate.col}, newState) && !diagonalMovementValidator({row, col, characterColor : kingColor == "BLACK" ? "WHITE" : "BLACK"}, {row : moveCandidate.row, col : moveCandidate.col}, newState)){
                    continue
                }
                return true
            }
            

        }
    }

    return false
}


const validateDisableHorizontalMovement = (boardSize, position, newState) => {
    var charLineList = new LinkedList()
    var kingNode = null

    var possibleAttackers = [
        constants.CHARACTER_QUEEN, 
        constants.CHARACTER_QUEEN.toUpperCase(), 
        constants.CHARACTER_ROOK, 
        constants.CHARACTER_ROOK.toUpperCase(), 
    ]


    
    // check if there's any vertical attacker to disable horizontal movement
    // check if king is same column


    // pass boardSize, col, newState, posibleAttackers 
    for (let row = 0; row < boardSize; row++){ // vertical
        if (newState[row][position.col].characterColor){

            var node = new Node({
                character : newState[row][position.col].character,
                characterColor : newState[row][position.col].characterColor, 
                row, 
                col : position.col
            })
            charLineList.append(node)
            if (
                (newState[row][position.col].character == constants.CHARACTER_KING || newState[row][position.col].character == constants.CHARACTER_KING.toUpperCase()) 
                && position.characterColor == newState[row][position.col].characterColor){
                kingNode = node
            }
        }
    }  
    if (kingNode){
        if (!kingNode.prev){ // king is on left-side edge
            if (kingNode.next && kingNode.next.data.row == position.row){
                if (kingNode.next.next && possibleAttackers.includes(kingNode.next.next.data.character)){
                    return true
                }
            }
        }  else if (!kingNode.next){ // king is on right-side edge
            if (kingNode.prev && kingNode.prev.data.row == position.row){
                if (Boolean(kingNode.prev.prev) && possibleAttackers.includes(kingNode.prev.prev.data.character)){
                    return true
                }
            }
        } else { // in between
            if (kingNode.next && kingNode.next.data.row == position.row){
                if (kingNode.next.next && possibleAttackers.includes(kingNode.next.next.data.character)){
                    return true
                }
            }
            if (kingNode.prev && kingNode.prev.data.row == position.row){
                if (kingNode.prev.prev && possibleAttackers.includes(kingNode.prev.prev.data.character)){
                    return true
                }
            }
        }
    
    }

    return false
}

const validateDisableVerticalMovement = (boardSize, position, newState) => {
    var charLineList = new LinkedList()
    var kingNode = null

    var possibleAttackers = [
        constants.CHARACTER_QUEEN, 
        constants.CHARACTER_QUEEN.toUpperCase(), 
        constants.CHARACTER_ROOK, 
        constants.CHARACTER_ROOK.toUpperCase(), 
    ]


    
    // check if there's any vertical attacker to disable horizontal movement
    // check if king is same column


    // pass boardSize, col, newState, posibleAttackers 
    for (let col = 0; col < boardSize; col++){ // vertical
        if (newState[position.row][col].characterColor){

            var node = new Node({
                character : newState[position.row][col].character,
                characterColor : newState[position.row][col].characterColor, 
                row : position.row,
                col
            })
            charLineList.append(node)
            if (
                (newState[position.row][col].character == constants.CHARACTER_KING || newState[position.row][col].character == constants.CHARACTER_KING.toUpperCase()) 
                && position.characterColor == newState[position.row][col].characterColor){
                kingNode = node
            }
        }
    }  
    if (kingNode){
        if (!kingNode.prev){ // king is on left-side edge 
            if (kingNode.next && kingNode.next.data.col == position.col){
                if (kingNode.next.next && possibleAttackers.includes(kingNode.next.next.data.character)){
                    return true
                }
            }
        }  else if (!kingNode.next){ // king is on right-side edge
            if (kingNode.prev && kingNode.prev.data.col == position.col){
                if (Boolean(kingNode.prev.prev) && possibleAttackers.includes(kingNode.prev.prev.data.character)){
                    return true
                }
            }
        } else { // in between
            if (kingNode.next && kingNode.next.data.col == position.col){
                if (kingNode.next.next && possibleAttackers.includes(kingNode.next.next.data.character)){
                    return true
                }
            }
            if (kingNode.prev && kingNode.prev.data.col == position.col){
                if (kingNode.prev.prev && possibleAttackers.includes(kingNode.prev.prev.data.character)){
                    return true
                }
            }
        }
    
    }

    return false
}

const validateDisableBottomToUpRightDiagonalMovement = (boardSize, position, newState) => {
    var charLineList = new LinkedList()
    var kingNode = null

    var possibleAttackers = [
        constants.CHARACTER_QUEEN, 
        constants.CHARACTER_QUEEN.toUpperCase(), 
        constants.CHARACTER_BISHOP, 
        constants.CHARACTER_BISHOP.toUpperCase(), 
    ] 

    var tempRow = position.row 
    var tempCol = position.col 

    // make the start point at top left
    while (tempCol > 0 && tempRow > 0){
        tempRow--
        tempCol--
    }

    // go to bottom right
    while (tempRow < boardSize && tempCol < boardSize){
        if (newState[tempRow][tempCol].characterColor){

            var node = new Node({
                character : newState[tempRow][tempCol].character,
                characterColor : newState[tempRow][tempCol].characterColor, 
                row : tempRow,
                col : tempCol
            })
            charLineList.append(node)
            if (
                (newState[tempRow][tempCol].character == constants.CHARACTER_KING || newState[tempRow][tempCol].character == constants.CHARACTER_KING.toUpperCase()) 
                && position.characterColor == newState[tempRow][tempCol].characterColor){
                kingNode = node
            }
        } 
        tempRow++
        tempCol++
    } 
    console.log(kingNode)
    console.log(charLineList)

    if (kingNode){
        if (!kingNode.prev){ // king is on left-side edge 
            if (kingNode.next && kingNode.next.data.col == position.col && kingNode.next.data.row == position.row){
                if (kingNode.next.next && possibleAttackers.includes(kingNode.next.next.data.character)){
                    return true
                }
            }
        }  else if (!kingNode.next){ // king is on right-side edge
            if (kingNode.prev && kingNode.prev.data.col == position.col && kingNode.prev.data.row == position.row){
                if (Boolean(kingNode.prev.prev) && possibleAttackers.includes(kingNode.prev.prev.data.character)){
                    return true
                }
            }
        } else { // in between
            if (kingNode.next && kingNode.next.data.col == position.col && kingNode.next.data.row == position.row){
                if (kingNode.next.next && possibleAttackers.includes(kingNode.next.next.data.character)){
                    return true
                }
            }
            if (kingNode.prev && kingNode.prev.data.col == position.col && kingNode.prev.data.row == position.row){
                if (kingNode.prev.prev && possibleAttackers.includes(kingNode.prev.prev.data.character)){
                    return true
                }
            }
        }
    
    }
    return false
}

const validateDisableDownToRightDiagonalMovement = (boardSize, position, newState) => {
    var charLineList = new LinkedList()
    var kingNode = null

    var possibleAttackers = [
        constants.CHARACTER_QUEEN, 
        constants.CHARACTER_QUEEN.toUpperCase(), 
        constants.CHARACTER_BISHOP, 
        constants.CHARACTER_BISHOP.toUpperCase(), 
    ] 

    var tempRow = position.row 
    var tempCol = position.col 

    // make the start point at bottom left
    while (tempCol > 0 && tempRow < boardSize - 1){
        tempRow++
        tempCol--
    }

    // go to top right
    while (tempRow > 0 && tempCol < boardSize){
        if (newState[tempRow][tempCol].characterColor){

            var node = new Node({
                character : newState[tempRow][tempCol].character,
                characterColor : newState[tempRow][tempCol].characterColor, 
                row : tempRow,
                col : tempCol
            })
            charLineList.append(node)
            if (
                (newState[tempRow][tempCol].character == constants.CHARACTER_KING || newState[tempRow][tempCol].character == constants.CHARACTER_KING.toUpperCase()) 
                && position.characterColor == newState[tempRow][tempCol].characterColor){
                kingNode = node
            }
        } 
        tempRow--
        tempCol++
    } 
    console.log(kingNode)
    console.log(charLineList)

    if (kingNode){
        if (!kingNode.prev){ // king is on left-side edge 
            if (kingNode.next && kingNode.next.data.col == position.col && kingNode.next.data.row == position.row){
                if (kingNode.next.next && possibleAttackers.includes(kingNode.next.next.data.character)){
                    return true
                }
            }
        }  else if (!kingNode.next){ // king is on right-side edge
            if (kingNode.prev && kingNode.prev.data.col == position.col && kingNode.prev.data.row == position.row){
                if (Boolean(kingNode.prev.prev) && possibleAttackers.includes(kingNode.prev.prev.data.character)){
                    return true
                }
            }
        } else { // in between
            if (kingNode.next && kingNode.next.data.col == position.col && kingNode.next.data.row == position.row){
                if (kingNode.next.next && possibleAttackers.includes(kingNode.next.next.data.character)){
                    return true
                }
            }
            if (kingNode.prev && kingNode.prev.data.col == position.col && kingNode.prev.data.row == position.row){
                if (kingNode.prev.prev && possibleAttackers.includes(kingNode.prev.prev.data.character)){
                    return true
                }
            }
        }
    
    }
    return false
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
