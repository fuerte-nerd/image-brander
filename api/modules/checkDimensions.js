const sizeOf = require("image-size");
const config = require("../config");

module.exports = ({ logo, image }, mode) => {
  return new Promise((res, rej) => {
    const logoDimens = sizeOf(logo);

    // make sure it's square
    logoDimens.width !== logoDimens.height
      ? rej("Please select a logo that has equal width and height")
      : null;

    // make sure it reaches minimum dimension
    logoDimens.width < 175
      ? rej("Please select a logo that has minimum size of 175px")
      : null;

    const imageDimens = sizeOf(image);

    imageDimens.width < config.image_size[mode][0] ||
    imageDimens.height < config.image_size[mode][1]
      ? rej("Unfortunately your original image is not big enough")
      : res();
  });
};
