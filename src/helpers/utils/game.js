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
    
    // wall 
    if (piece == "0"){
        return null
    }

    var pieceChar = piece.toLowerCase()

    if (piece != "p" && piece != 'P'){
        pieceChar = piece.toLowerCase()
    }

    if (position.characterColor != playerColor && !position.validMove){
        pieceChar = "."
    }

    const handler = movement.get(pieceChar) 
    const result = handler({...position, pieceChar}, state, playerColor)
    return result
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
    // console.log(invalidHorizontalMoves.map.size)
    // console.log(invalidVerticalMoves.map.size)
    // console.log(invalidBottomToUpRightDiagonalMoves.map.size)
    // console.log(invalidUpToDownRightDiagonalMoves.map.size)
    // console.log(invalidMovesCausedByKnight.map.size)
    // console.log(invalidMovesCausedByPawn.map.size)

    
    const invalidMoves = mergeMaps(invalidHorizontalMoves.map, invalidVerticalMoves.map, invalidBottomToUpRightDiagonalMoves.map, invalidUpToDownRightDiagonalMoves.map, invalidMovesCausedByKnight.map, invalidMovesCausedByPawn.map)
    const source = [
        invalidHorizontalMoves.source, 
        invalidVerticalMoves.source, 
        invalidBottomToUpRightDiagonalMoves.source, 
        invalidUpToDownRightDiagonalMoves.source, 
        ...invalidMovesCausedByKnight.source, 
        ...invalidMovesCausedByPawn.source
    ]
    return {map : invalidMoves, source}
}

const boardCellColorHandler = (clickCoordinate, target, defaultColor) => {

   if (target.movable) {
        return "#90ee90"
   }

   if (target.coveredByFog) {
        return "#75663b"
   }

   if (target.enemyPieceFrozen){
        return "#f76a8b"
   }

   if (target.selfPieceFrozen) {
        return "#B3B3B3"
   }

   if (target.onHoldSkillClickable){
        return "pink"
   }

   if (target.isWall){
        return "black"
   }

   if (target.isEvolvedPawn){
        return "red"
   }
//    if (target.onHoldSkill){
//         return "lime"
//    }

   return clickCoordinate.row == target.row && clickCoordinate.col == target.col ? "#FFD700" : defaultColor
}

const isWall = (character) => {
    return character == '0';
}

const pawnCheck = (character) => {
    if (character == constants.CHARACTER_PAWN){
        return {
            valid : true,
            color : "BLACK"
        }
    }

    if (character.toLowerCase() == constants.CHARACTER_PAWN){
        return {
            valid : true,
            color : "WHITE"
        }
    }

    return { valid : false }
}

const knightCheck = (character) => {
    if (character == constants.CHARACTER_KNIGHT){
        return {
            valid : true,
            color : "BLACK"
        }
    }

    if (character.toLowerCase() == constants.CHARACTER_KNIGHT){
        return {
            valid : true,
            color : "WHITE"
        }
    }

    return { valid : false }
}

const kingCheck = (character) => {
    if (character == constants.CHARACTER_KING){
        return {
            valid : true,
            color : "BLACK"
        }
    }

    if (character.toLowerCase() == constants.CHARACTER_KING){
        return {
            valid : true,
            color : "WHITE"
        }
    }

    return { valid : false }
}

const queenCheck = (character) => {
    if (character == constants.CHARACTER_QUEEN){
        return {
            valid : true,
            color : "BLACK"
        }
    }

    if (character.toLowerCase() == constants.CHARACTER_QUEEN){
        return {
            valid : true,
            color : "WHITE"
        }
    }

    return { valid : false }
}

const bishopCheck = (character) => {
    if (character == constants.CHARACTER_BISHOP){
        return {
            valid : true,
            color : "BLACK"
        }
    }

    if (character.toLowerCase() == constants.CHARACTER_BISHOP){
        return {
            valid : true,
            color : "WHITE"
        }
    }

    return { valid : false }
}

const rookCheck = (character) => {
    if (character == constants.CHARACTER_ROOK){
        return {
            valid : true,
            color : "BLACK"
        }
    }

    if (character.toLowerCase() == constants.CHARACTER_ROOK){
        return {
            valid : true,
            color : "WHITE"
        }
    }

    return { valid : false }
}

const evolvedPawnCheck = (character) => {
    if (character == constants.CHARACTER_EVOLVED_PAWN){
        return {
            valid : true,
            color : "BLACK"
        }
    }

    if (character.toLowerCase() == constants.CHARACTER_EVOLVED_PAWN){
        return {
            valid : true,
            color : "WHITE"
        }
    }

    return { valid : false }
}

const findKing = (newState, playerColor) => {

    if (newState.length <= 0){
        return null
    }

    const boardSize = newState[0].length

    for (let row = 0; row < boardSize; row++){
        for (let col = 0; col < boardSize; col++){
            var king = kingCheck(newState[row][col].character)
            if (king.valid && king.color == playerColor){
              return {row, col}
            }
        }
    }
    
    return {row : null, col : null}
}

function formatMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
}

export {
    invalidKingUnderAttackMoves,
    generateNewNotationState,
    handleMovement,
    getPieceMovementAlgorithm,
    transformBoard, 
    boardCellColorHandler, 
    isWall,
    pawnCheck, 
    knightCheck, 
    kingCheck, 
    queenCheck, 
    bishopCheck, 
    rookCheck, 
    evolvedPawnCheck, 
    findKing,
    formatMinutes
}