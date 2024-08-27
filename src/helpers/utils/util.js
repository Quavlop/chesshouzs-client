import constants from "@/config/constants/game";

const mergeMaps = (...maps) => {
    const mergedMap = new Map();

    maps.forEach(map => {
        map.forEach((value, key) => {
            if (!mergedMap.has(key)) {
                mergedMap.set(key, value);
            }
        });
    });

    return mergedMap;
}

const convertGameVariantToWord = (duration, increment) => {
    var d = Math.floor(duration / 60)
    if (increment != 0){
        return d + " | " + increment
    }
    return d + " min"
}

const formatConventionalGameVariant = (duration, increment) => {
    return duration + "-" + increment
}

const resetSkillBoardStats = (state) => {

    var newState = state.map(row => row.slice());
    for (let row = 0; row < state.length; row++) {
        for (let col = 0; col < state.length; col++) {
            newState[row][col].onHoldSkill = false
            newState[row][col].onHoldSkillClickable = false
        }
    }
    return newState
}

const constructBuffDebuffStatusMap = (status, skillStats, boardSize) => {
    const { buffState, debuffState } = status.data 
    const buffMap = new Map()
    const debuffFreezingWandMap = new Map()
    const debuffFogMasterMap = new Map()

    if (buffState) {

    }

    if (debuffState) {
        if (debuffState[constants.SKILL_FREEZING_WAND]){
            var list = debuffState[constants.SKILL_FREEZING_WAND].list
            for (let i = 0; i < list.length; i++){
                if (list[i].durationLeft <= 0) continue
                debuffFreezingWandMap.set(`${list[i].position.row}-${list[i].position.col}`, true)
            }
        }

        if (debuffState[constants.SKILL_FOG_MASTER]){
            var list = debuffState[constants.SKILL_FOG_MASTER].list
            var skill 
            for (let i = 0; i < skillStats.data.length; i++){
                if (skillStats.data[i].name == constants.SKILL_FOG_MASTER){
                    skill = skillStats.data[i]
                    break
                }
            }
            for (let i = 0; i < list.length; i++){

                if (list[i].durationLeft <= 0) continue

                var verticalUpperBound = list[i].position.row - skill.radiusY < 0 ? 0 : list[i].position.row - skill.radiusY
                var verticalLowerBound = list[i].position.row + skill.radiusY >= boardSize ? boardSize - 1 : list[i].position.row + skill.radiusY

                for (let j = verticalUpperBound; j <= verticalLowerBound; j++){
                    for (let col = 0; col < boardSize; col++){
                        debuffFogMasterMap.set(`${j}-${col}`, true)
                    }
                }

            }
        }

        // add more skills
    }

    var newBuffState = {}


    var newDebuffState = {}
    newDebuffState[constants.SKILL_FREEZING_WAND] = Object.fromEntries(debuffFreezingWandMap);

    if (debuffState[constants.SKILL_PARALYZER].durationLeft > 0){
        newDebuffState[constants.SKILL_PARALYZER] = debuffState[constants.SKILL_PARALYZER]
    }

    newDebuffState[constants.SKILL_FOG_MASTER] = Object.fromEntries(debuffFogMasterMap);

    return {
        buffState : newBuffState, 
        debuffState : newDebuffState,
    }

}

const isSquareCoveredByFog = (state, status, playerColor, row, col) => {
    const map = status.debuffState[constants.SKILL_FOG_MASTER]
    if (playerColor == "BLACK"){
        return map[`${state.length - row - 1}-${state.length - col - 1}`] && state[state.length - row - 1][state.length - col - 1].character != "." && state[state.length - row - 1][state.length - col - 1].characterColor != playerColor
    }
    return map[`${row}-${col}`] && state[row][col].character != "." && state[row][col].characterColor != playerColor
}

export {
    mergeMaps, 
    convertGameVariantToWord, 
    formatConventionalGameVariant, 
    resetSkillBoardStats, 
    constructBuffDebuffStatusMap, 
    isSquareCoveredByFog,
}