import constants from "@/config/constants/game";
import { resetSkillBoardStats } from "../utils/util";

const triggerSkills = (skill, playerColor, state) => {  
    var newState = resetSkillBoardStats(state)
    if (!skill.autoTrigger){
        for (let row = 0; row < state.length; row++) {
            for (let col = 0; col < state.length; col++) {
                newState[row][col].onHoldSkill = true

                if (skill.rowLimit){
                    if (row < skill.rowLimit || row > state.length - skill.rowLimit - 1){
                        continue
                    }
                }

                if (skill.colLimit){
                    if (col < skill.colLimit || col > state.length - skill.colLimit - 1){
                        continue
                    }
                } 

                if (skill.name == constants.SKILL_FOG_MASTER){
                    newState[row][col].onHoldSkillClickable = true
                    continue
                }

                if (newState[row][col].character != "." && playerColor == newState[row][col]?.characterColor && skill.forSelf && !skill.forEnemy){
                    // for self (buff / defense)
                    if (skill.name == constants.SKILL_ENLIGHTENED_APPRENTICE){
                        if (newState[row][col].character == constants.CHARACTER_PAWN || newState[row][col].character.toLowerCase() == constants.CHARACTER_PAWN){
                            newState[row][col].onHoldSkillClickable = true
                        }
                    }
                } else if (newState[row][col].character != "." && playerColor != newState[row][col]?.characterColor && skill.forEnemy && !skill.forSelf){
                    // for enemy (attack)
                    newState[row][col].onHoldSkillClickable = true
                } else if (newState[row][col].character == "." && !skill.forEnemy && !skill.forSelf){
                    // skill active on empty cells
                    newState[row][col].onHoldSkillClickable = true
                }

            }
        }
    }


    return {
        state : newState
    }
}

const triggerEndGame = async (endpoint, gameId, token, winnerId, type) => {
    const response = await fetch(endpoint + "/v1/match/end/" + gameId, {
        method : "POST",
        headers : {
          'Content-Type' : 'application/json',
          Authorization : `Bearer ${token}`
        },
        credentials : 'include',
        body : JSON.stringify({
            winnerId, 
            type,
        })
    })

    const data = await response.json() 
    return data
}

export { triggerSkills, triggerEndGame }