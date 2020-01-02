const Jimp = require("jimp");
const config = require("../config");
const path = require("path");
module.exports = (image, mode, logo, title = false, textHeight = null) => {
  return new Promise((res, rej) => {
    Jimp.read(logo, (err, img) => {
      if (err) {
        rej(err);
      }
      img.resize(config.logo_size[mode], config.logo_size[mode]);
      img.quality(100);
      image.composite(
        img,
        image.bitmap.width - config.logo_size[mode] - config.text_padding[mode],
        title
          ? image.bitmap.height -
              config.logo_size[mode] -
              config.text_padding[mode] * 3 -
              textHeight
          : image.bitmap.height -
              config.logo_size[mode] -
              config.text_padding[mode]
      );
      res(image);
    });
  });
};
