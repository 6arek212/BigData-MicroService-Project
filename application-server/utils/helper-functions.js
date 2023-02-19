


exports.makePairsObj = (array) => {
    obj = {}
    for (let i = 0; i < array.length - 1; i += 2) {
        obj[array[i]] = array[i + 1]
    }
    return obj
}

exports.makePairsFromArray = (array) => {
    arr = []
    for (let i = 0; i < array.length - 1; i += 2) {
        arr.push({ key: array[i], value: array[i + 1] })
    }
    return arr
}


exports.objectToArray = (obj) => {
    arr = []
    for (k in obj) {
        arr.push({ key: k, value: obj[k] })
    }
    return arr
}
