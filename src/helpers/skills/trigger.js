import { resetSkillBoardStats } from "../utils/util";

const triggerSkills = (skill, playerColor, state) => {  
    var newState = resetSkillBoardStats(state)
    if (!skill.autoTrigger){
        for (let row = 0; row < state.length; row++) {
            for (let col = 0; col < state.length; col++) {
                newState[row][col].onHoldSkill = true

                if (newState[row][col].character != "." && playerColor == newState[row][col]?.characterColor && skill.forSelf && !skill.forEnemy){
                    newState[row][col].onHoldSkillClickable = true
                } else if (newState[row][col].character != "." && playerColor != newState[row][col]?.characterColor && skill.forEnemy && !skill.forSelf){
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