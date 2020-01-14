(img, heightOffset = 0) {
    return {
      top_left: {
        x: config.padding[this.orientation],
        y: config.padding[this.orientation] + heightOffset
      },
      top_center: {
        x: this.jimp.bitmap.width / 2 - img.bitmap.width / 2,
        y: config.padding[this.orientation] + heightOffset
      },
      top_right: {
        x:
          this.jimp.bitmap.width -
          config.padding[this.orientation] -
          img.bitmap.width,
        y: config.padding[this.orientation] + heightOffset
      },
      center_left: {
        x: config.padding[this.orientation],
        y: this.jimp.bitmap.height / 2 - img.bitmap.height / 2 + heightOffset
      },
      center: {
        x: this.jimp.bitmap.width / 2 - img.bitmap.width / 2,
        y: this.jimp.bitmap.height / 2 - img.bitmap.height / 2 + heightOffset
      },
      center_right: {
        x:
          this.jimp.bitmap.width -
          config.padding[this.orientation] -
          img.bitmap.width,
        y: this.jimp.bitmap.height / 2 - img.bitmap.height / 2
      },
      bottom_left: {
        x: config.padding[this.orientation],
        y:
          this.jimp.bitmap.height -
          img.bitmap.height -
          config.padding[this.orientation] -
          heightOffset
      },
      bottom_center: {
        x: this.jimp.bitmap.width / 2 - img.bitmap.width / 2,
        y:
          this.jimp.bitmap.height -
          img.bitmap.height -
          config.padding[this.orientation] -
          heightOffset
      },
      bottom_right: {
        x:
          this.jimp.bitmap.width -
          img.bitmap.width -
          config.padding[this.orientation],
        y:
          this.jimp.bitmap.height -
          img.bitmap.height -
          config.padding[this.orientation] -
          heightOffset
      }
    };
  }