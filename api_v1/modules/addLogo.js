const Jimp = require("jimp");
const config = require("../config");
const path = require("path");

module.exports = (image, mode, logo, title = false, textHeight = null) => {
  return new Promise((res, rej) => {
    Jimp.read(logo, (err, img) => {
      if (err) {
        rej(err);
      }
      img.resize(Jimp.AUTO, config.logo_size[mode]);
      const newLogoDimens = {
        width: img.bitmap.width,
        height: img.bitmap.height
      };
      img.quality(100);
      image.composite(
        img,
        image.bitmap.width - newLogoDimens.width - config.text_padding[mode],
        title
          ? image.bitmap.height -
              newLogoDimens.height -
              config.text_padding[mode] * 3 -
              textHeight
          : image.bitmap.height -
              newLogoDimens.height -
              config.text_padding[mode]
      );
      res(image);
    });
  });
};
