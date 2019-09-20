const helper = {};

helper.randomName = () => {
  // '/()%' keywords send error whenever they're in the name of any image.
  const possible = "abcdefghijklmnopqrstuvwxyz$&0123456789";
  let randomName = 0;
  for (let index = 0; index < 6; index++) {
    randomName += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return randomName;
};

helper.randomId = () => {
  const possible = "0123456789";
  let randomId = 0;
  for (let index = 0; index < 15; index++) {
    randomId += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return randomId;
};

helper.size = obj => {
  let size = 0,
    key;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

module.exports = helper;
