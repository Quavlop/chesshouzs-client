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

export {
    mergeMaps, 
    convertGameVariantToWord, 
    formatConventionalGameVariant, 
    resetSkillBoardStats
}