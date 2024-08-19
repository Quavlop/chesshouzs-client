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
    evolvedPawnMovement,
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

const handleMovement = (piece, position, state, playerColor) => {
    const movement = getPieceMovementAlgorithm()   

    var pieceChar = piece.toLowerCase()
    if (piece != "p" && piece != 'P'){
        pieceChar = piece.toLowerCase()
    }

    if (position.characterColor != playerColor && !position.validMove){
        pieceChar = "."
    }

    const handler = movement.get(pieceChar) 
    return handler({...position, pieceChar}, state, playerColor)
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

    // special characters 
    map.set(constants.CHARACTER_EVOLVED_PAWN, evolvedPawnMovement)

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

const invalidKingUnderAttackMoves = (kingPosition, state, player) => {    
    const invalidHorizontalMoves = checkKingHorizontalAttacker(state.length, kingPosition, state, player)
    const invalidVerticalMoves = checkKingVerticalAttacker(state.length, kingPosition, state, player)
    const invalidBottomToUpRightDiagonalMoves = checkKingBottomToUpRightDiagonalAttacker(state.length, kingPosition, state, player)
    const invalidUpToDownRightDiagonalMoves = checkKingDownToBottomRightDiagonalAttacker(state.length, kingPosition, state, player)
    const invalidMovesCausedByKnight = checkKnightAttacker(state.length, kingPosition, state, player)
    const invalidMovesCausedByPawn = checkPawnAttackers(state.length, kingPosition, state, player)
    
    const invalidMoves = mergeMaps(invalidHorizontalMoves, invalidVerticalMoves, invalidBottomToUpRightDiagonalMoves, invalidUpToDownRightDiagonalMoves, invalidMovesCausedByKnight, invalidMovesCausedByPawn)
    return invalidMoves
}

const boardCellColorHandler = (clickCoordinate, target, defaultColor) => {
   if (target.onHoldSkillClickable){
        return "pink"
   }
//    if (target.onHoldSkill){
//         return "lime"
//    }
   if (target.movable) return "yellow"
   return clickCoordinate.row == target.row && clickCoordinate.col == target.col ? "red" : defaultColor
}


export {
    invalidKingUnderAttackMoves,
    generateNewNotationState,
    handleMovement,
    getPieceMovementAlgorithm,
    transformBoard, 
    boardCellColorHandler
}