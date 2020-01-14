const config = require("./config");
const Jimp = require("jimp");
const path = require('path')

module.exports = data => {
  return new Promise(async (res, rej) => {
    const getOrientation = jimp => {
      if (jimp.img.bitmap.width > jimp.img.bitmap.height) {
        return "landscape";
      } else if (jimp.img.bitmap.width < jimp.img.bitmap.height) {
        return "portrait";
      } else {
        return "square";
      }
    };

    const resize = (jimp, orientation) => {
      jimp.cover(
        config.image_size[orientation].width,
        config.image_size[orientation].height
      );
      return jimp;
    };

    const addLogo = (jimp, logo, orientation) => {
      logo.resize(config.logo_size[orientation], Jimp.AUTO);
      jimp.img.composite(
        logo,
        jimp.img.bitmap.width - logo.bitmap.width - config.padding[orientation],
        jimp.img.bitmap.height -
          logo.bitmap.height -
          config.padding[orientation]
      );
    };

    // const writeImage = jimp =>{
    //     jimp.writeAsync(pa)
    // }

    for (let jimp of data.jimps.images) {
      const orientation = getOrientation(jimp);
      resize(jimp.img, orientation);
      const logoClone = data.jimps.logo.clone();
      addLogo(jimp, logoClone, orientation)
      jimp.img.writeAsync(path.join(__dirname, '../', 'temp', 'processed', jimp.filename))
    }
    res(data);
  });
};
