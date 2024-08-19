import constants from "@/config/constants/game";
import { resetSkillBoardStats } from "../utils/util";

const triggerSkills = (skill, playerColor, state) => {  
    var newState = resetSkillBoardStats(state)
    console.log(skill)
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

export { triggerSkills }