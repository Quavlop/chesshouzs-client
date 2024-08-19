import constants from "@/config/constants/game"
import { generateNewNotationState } from "../utils/game"

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

// return newState
const executeEnlightenedApprentice = async (state, args) => {
    
}

// return newState
const executeTheGreatWall = async (state, args) => {

}

// return newState
const executeFogMaster = async (state, args) => {

}

// return newState
const executeFreezingWand = async (state, args) => {

}

// return newState
const executeParalyzer = async (state, args) => {

}

export {
    execute
}