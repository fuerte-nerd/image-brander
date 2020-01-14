const Jimp = require("jimp");
const config = require("../config");
const addTitle = require("./addTitle");
const addLogo = require("./addLogo");
const fs = require("fs");

module.exports = ({ logo, image }, mode, text = null) => {
  return new Promise((res, rej) => {
    const fileExt = image.match(/\.\w*$/g);
    const fileName = image.match(/^.*(?=\.)/g);

    const finalFilename = `${fileName}_processed${fileExt}`;

    const extractFilename =
      finalFilename.match(/[^\\\/]+(?=\.[\w]+$)|[^\\\/]+$/g)[0] + fileExt;
    console.log(finalFilename);
    console.log(extractFilename);
    fs.copyFileSync(image, finalFilename);

    Jimp.read(finalFilename, (err, img) => {
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
                b.write(finalFilename);
                res({ filename: extractFilename });
              })
              .catch(err => rej(err));
          })
        : addLogo(img, mode, logo)
            .then(b => {
              b.writeAsync(finalFilename).then(() => {
                res({ filename: extractFilename });
              });
            })
            .catch(err => rej(err));
    });
  });
};
