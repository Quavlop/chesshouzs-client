import constants from "@/config/constants/game"
import { generateNewNotationState, pawnCheck } from "../utils/game"

const execute = async (skill, state, args, endpoint, token) => {
    // const skillMap = skillMap()
    // const handler = skillMap.get(skill.name)
    args.skillId = skill.id
    console.log({
        skillId : args.skillId, 
        state : generateNewNotationState(state), 
        position : args.position, 
        playerId : args.playerId, 
        gameId : args.gameId,  
    })
    const response = await fetch(endpoint + "/v1/match/skills/execute/" + skill.id, {
        method : "POST",
        headers : {
          'Content-Type' : 'application/json',
          Authorization : `Bearer ${token}`
        },
        credentials : 'include',
        body : JSON.stringify({
            skillId : args.skillId, 
            state : generateNewNotationState(state), 
            position : args.position, 
            playerId : args.playerId, 
            gameId : args.gameId,  
        })
    })

    const data = await response.json() 
    console.log(data)
    return data
    // return await handler(state, args)
}

const skillMap = () => {

    const skillMap = new Map()

    skillMap.set(constants.SKILL_ENLIGHTENED_APPRENTICE, executeEnlightenedApprentice)
    skillMap.set(constants.SKILL_THE_GREAT_WALL, executeTheGreatWall)
    skillMap.set(constants.SKILL_FOG_MASTER, executeFogMaster)
    skillMap.set(constants.SKILL_FREEZING_WAND, executeFreezingWand)
    skillMap.set(constants.SKILL_PARALYZER, executeParalyzer)

    return skillMap

}

/*
    args {
        skillId : ***
        position :{
            row : ***
            col : ***
        }
        playerId : *** 
        gameId : ***
    }
*/

const generateFogMap = (playerColor, state, triggerPosition) => {
    const boardSize = state.length

    // key : `{row}-{col}` 
    // val : true / false
    var fogMap = new Map()

    var newState = state.map(row => row.slice());
    for (let row = boardSize - 1; row >= 0; row--) {
        for (let col = boardSize - 1; col >= 0; col--) {
            const pawn = pawnCheck(state[row][col])
            if (pawn.valid && pawn.color == playerColor){
                continue
            }

            const knight = knightCheck(state[row][col])
            if (knight.valid && knight.color == playerColor){
                continue
            }

            const king = kingCheck(state[row][col])
            if (king.valid && king.color == playerColor){
                continue
            }

            const queen = queenCheck(state[row][col])
            if (queen.valid && queen.color == playerColor){
                continue
            }

            const bishop = bishopCheck(state[row][col])
            if (bishop.valid && bishop.color == playerColor){
                continue
            }

            const rook = rookCheck(state[row][col])
            if (rook.valid && rook.color == playerColor){
                continue
            }

            const evolvedPawn = evolvedPawnCheck(state[row][col])
            if (evolvedPawn.valid && evolvedPawn.color == playerColor){
                continue
            }
        }
    }

    return newState
}

export {
    execute, 
    generateFogMap
}