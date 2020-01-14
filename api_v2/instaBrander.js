const Jimp = require("jimp");

module.exports = {
  readJimp: path => {
    return Jimp.read(path);
  },
  writeJimp: (jimp, writePath) => {
    return jimp.write(writePath);
  },
  getOrientation: jimp => {
    if (jimp.bitmap.height > jimp.bitmap.width) {
      return "portrait";
    } else if (jimp.bitmap.width > jimp.bitmap.height) {
      return "landscape";
    } else {
      return "square";
    }
  },
  scaleLogo: (jimp, orientation) => {
    jimp.resize(config.logoSize[orientation], Jimp.AUTO);
  }
};
