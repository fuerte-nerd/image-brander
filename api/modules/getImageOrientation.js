const sizeOf = require('image-size')

module.exports = (image)=>{
    const dimens = sizeOf(image)
    return dimens.width > dimens.height
    ? 'landscape'
    : dimens.height > dimens.width
        ? 'portrait'
        : 'square'
}