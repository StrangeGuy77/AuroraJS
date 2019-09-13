const helper = {};

helper.randomName = () => {
    // '/()%' keywords send error whenever they're in the name of any image.
    const possible = 'abcdefghijklmnopqrstuvwxyz$&0123456789';
    let randomName = 0;
    for (let index = 0; index < 6; index++) {
        randomName += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randomName;
};

helper.size = (obj) => {
    let size = 0, key;
    for (const key in object) {
        if (object.hasOwnProperty(key)) size++;
    }
    return size;
}

module.exports = helper;