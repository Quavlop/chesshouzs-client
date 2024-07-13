import constants from "@/config/constants/game"
import { kingMovement, pawnMovement, bishopMovement, queenMovement, knightMovement, rookMovement, noMovement } from "./movement"

const generateNewNotationState = (state) => {
    var notation = ""
    const boardSize = state.length

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            notation += state[row][col].character 
        }
        notation += "|"
    } 

    return notation
}

const handleMovement = (piece, position, state) => {
    const movement = getPieceMovementAlgorithm()   

    var pieceChar = piece.toLowerCase()
    if (piece != "p" && piece != 'P'){
        pieceChar = piece.toLowerCase()
    }
    const handler = movement.get(pieceChar) 
    return handler({...position, pieceChar}, state)
}


const getPieceMovementAlgorithm = () => {
    const map = new Map()

    map.set(".", noMovement)
    map.set(constants.CHARACTER_PAWN, pawnMovement)
    map.set(constants.CHARACTER_BISHOP, bishopMovement)
    map.set(constants.CHARACTER_KING, kingMovement)
    map.set(constants.CHARACTER_QUEEN, queenMovement)
    map.set(constants.CHARACTER_KNIGHT, knightMovement)
    map.set(constants.CHARACTER_ROOK, rookMovement)

    return map
}

const transformBoard = (state) => {
    var len = state.length

    var newState = state.map(row => row.slice());

    for (let row = 0; row < len / 2; row++){
        for (let col = 0; col < len; col++){
            var temp = newState[row][col]
            newState[row][col] = newState[len-row-1][len-col-1]
            newState[len-row-1][len-col-1] = temp
        }
    }

    return newState
}

const boardCellColorHandler = (clickCoordinate, target, defaultColor) => {
   if (target.movable) return "yellow"
   return clickCoordinate.row == target.row && clickCoordinate.col == target.col ? "red" : defaultColor
}


export {
    generateNewNotationState,
    handleMovement,
    getPieceMovementAlgorithm,
    transformBoard, 
    boardCellColorHandler
}