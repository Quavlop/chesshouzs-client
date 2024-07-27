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

export {
    mergeMaps, 
    convertGameVariantToWord, 
    formatConventionalGameVariant
}