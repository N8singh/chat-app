const genmes = (Name,text) => {
    return {
    Name,
    text,
    createdAt : new Date().getTime()
}
}

const genloc = (Name,url) => {
    return {
        Name,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    genmes,
    genloc
}
