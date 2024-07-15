import constants from "@/config/constants/game"
import { 
    kingMovement, 
    pawnMovement, 
    bishopMovement, 
    queenMovement, 
    knightMovement, 
    rookMovement,
    noMovement,
    checkKingHorizontalAttacker, 
    checkKingVerticalAttacker, 
    checkKingBottomToUpRightDiagonalAttacker,
    checkKingDownToBottomRightDiagonalAttacker,
    checkKnightAttacker, 
    checkPawnAttackers,
} from "./movement"
import { mergeMaps } from "./util"

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

const isKingInCheck = (kingPosition, state, player) => {    
    const invalidHorizontalMoves = checkKingHorizontalAttacker(15, kingPosition, state, player)
    const invalidVerticalMoves = checkKingVerticalAttacker(15, kingPosition, state, player)
    const invalidBottomToUpRightDiagonalMoves = checkKingBottomToUpRightDiagonalAttacker(15, kingPosition, state, player)
    const invalidUpToDownRightDiagonalMoves = checkKingDownToBottomRightDiagonalAttacker(15, kingPosition, state, player)
    const invalidMovesCausedByKnight = checkKnightAttacker(15, kingPosition, state, player)
    const invalidMovesCausedByPawn = checkPawnAttackers(15, kingPosition, state, player)

    const invalidMoves = mergeMaps(invalidHorizontalMoves, invalidVerticalMoves, invalidBottomToUpRightDiagonalMoves, invalidUpToDownRightDiagonalMoves, invalidMovesCausedByKnight, invalidMovesCausedByPawn)
    return invalidMoves.size > 0
}

const boardCellColorHandler = (clickCoordinate, target, defaultColor) => {
   if (target.movable) return "yellow"
   return clickCoordinate.row == target.row && clickCoordinate.col == target.col ? "red" : defaultColor
}


export {
    isKingInCheck,
    generateNewNotationState,
    handleMovement,
    getPieceMovementAlgorithm,
    transformBoard, 
    boardCellColorHandler
}