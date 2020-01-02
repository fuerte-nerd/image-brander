const Jimp = require("jimp");
const config = require("../config");
const addTitle = require("./addTitle");
const addLogo = require("./addLogo");

module.exports = ({ logo, image }, mode, text = null) => {
  return new Promise((res, rej) => {
    Jimp.read(image, (err, img) => {
      if (err) {
        rej(err);
      }

      img
        .cover(config.image_size[mode][0], config.image_size[mode][1])
        .quality(100);

      text.title
        ? addTitle(img, mode, text).then(a => {
            addLogo(a.image, mode, logo, true, a.textHeight)
              .then(b => {
                b.write(image);
                res();
              })
              .catch(err => rej(err));
          })
        : addLogo(img, mode, logo)
            .then(b => {
              b.write(image);
              res();
            })
            .catch(err => rej(err));
    });
  });
};
