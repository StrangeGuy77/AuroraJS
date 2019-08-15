const helper = {};

helper.randomName = () => {
    const possible = 'abcdefghijklmnopqrstuvwxyz$%&/()0123456789';
    let randomName = 0;
    for (let index = 0; index < 6; index++) {
        randomName += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randomName;
};

module.exports = helper;