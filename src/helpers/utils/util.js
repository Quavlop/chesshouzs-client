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

const constructBuffDebuffStatusMap = (status) => {
    const { buffState, debuffState } = status.data 

    const buffMap = new Map()
    const debuffFreezingWandMap = new Map()

    if (buffState) {

    }

    if (debuffState) {
        if (debuffState[constants.SKILL_FREEZING_WAND]){
            var list = debuffState[constants.SKILL_FREEZING_WAND].list
            for (let i = 0; i < list.length; i ++){
                if (list[i].durationLeft <= 0) continue
                debuffFreezingWandMap.set(`${list[i].position.row}-${list[i].position.col}`, true)
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

    return {
        buffState : newBuffState, 
        debuffState : newDebuffState,
    }

}

function mapToObject(map) {
    const obj = {};
    for (let [key, value] of map.entries()) {
        obj[key] = value;
    }
    return obj;
}

export {
    mergeMaps, 
    convertGameVariantToWord, 
    formatConventionalGameVariant, 
    resetSkillBoardStats, 
    constructBuffDebuffStatusMap
}