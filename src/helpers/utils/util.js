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

export {
    mergeMaps
}