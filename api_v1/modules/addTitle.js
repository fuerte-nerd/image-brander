const Jimp = require("jimp");
const config = require("../config");

module.exports = (image, mode, title) => {
  const fonts = {
    portrait: Jimp.FONT_SANS_64_WHITE,
    square: Jimp.FONT_SANS_64_WHITE,
    landscape: Jimp.FONT_SANS_32_WHITE
  };
  return new Promise((res, rej) => {
    Jimp.loadFont(fonts[mode]).then(font => {
      const textDimens = {
        width: Jimp.measureText(font, title.title),
        height: Jimp.measureTextHeight(font, title.title)
      };
      new Jimp(
        textDimens.width + config.text_padding[mode] * 2,
        textDimens.height + config.text_padding[mode],
        title.titleBgColor,
        (err, img) => {
          image.composite(
            img,
            image.bitmap.width -
              textDimens.width -
              config.text_padding[mode] * 3,
            image.bitmap.height -
              textDimens.height -
              config.text_padding[mode] * 2
          );
          image.print(
            font,
            image.bitmap.width -
              textDimens.width -
              config.text_padding[mode] * 2,
            //   config.text_padding[mode] - (config.text_padding[mode] / 2),
            image.bitmap.height -
              textDimens.height -
              config.text_padding[mode] * 1.5,
            title.title
          );
          res({
            image: image,
            textHeight: textDimens.height
          });
        }
      );
    });
  });
};
