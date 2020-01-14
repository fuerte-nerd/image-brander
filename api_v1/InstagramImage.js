const sizeOf = require("image-size");
const Jimp = require("jimp");
const config = require("./config");
const temp = path.join(__dirname, "temp");

class InstagramImage {
  constructor(file) {
    this.file = file;
    this.src = file.name;
    // this.src = url;
    this.filename = this.src.match(/^.*(?=\.)/g);
    this.extension = this.src.match(/\.\w*$/g);
    this.height;
    this.width;
    this.orientation;
    this.jimp;
    this.init();
  }

  init() {
    this.height = sizeOf(this.src).height;
    this.width = sizeOf(this.src).width;
    this.orientation = this.setOrientation();

    // validate

    this.jimp = this.initJimp(this.src);
  }

  validate() {
    return new Promise((res, rej) => {
      if (
        this.height < config.image_size[this.orientation].height ||
        this.width < config.image_size[this.orientation].width
      ) {
        rej("Sorry, the image is not big enough");
      }
      res();
    });
  }

  setOrientation() {
    if (this.height > this.width) {
      return "portrait";
    } else if (this.width > this.height) {
      return "landscape";
    } else {
      return "square";
    }
  }

  initJimp(src) {
    Jimp.read(src, (err, img) => {
      this.jimp = img;
    });
  }

  scale() {
    return new Promise(() => {
      this.jimp.cover(
        config.image_size[this.orientation].width,
        config.image_size[this.orientation].height,
        img => {
          this.jimp = img;
          res();
        }
      );
    });
  }

  getPositions(img, heightOffset = 0) {
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

  getFont(font) {
    switch (font) {
      case "default":
        return Jimp.FONT_SANS_32_BLACK;
      default:
        return Jimp.FONT_SANS_32_BLACK;
    }
  }

  addCaption(text, options) {
    Jimp.loadFont(this.getFont(options.font), font => {
      const captionDimensions = {
        height: Jimp.measureTextHeight(font, text),
        width: Jimp.measureTextHeight(font, text)
      };
      new Jimp(
        captionDimensions.width + options.padding,
        captionDimensions.height + options.padding,
        options.color,
        img => {
          img.print(
            font,
            options.padding,
            options.padding,
            text,
            (err, newImg) => {
              if (err) return err;
              const position = this.getPositions(newImg);
              this.jimp.composite(
                newImg,
                position[options.placement].x + options.offset,
                position[options.placement].y + options.offset,
                { mode: Jimp.BLEND_DESTINATION_OVER },
                processedImg => {
                  this.jimp = processedImg;
                }
              );
            }
          );
        }
      );
    });
  }

  addLogo(logo, options) {
    return new Promise((res, rej) => {
      Jimp.read(logo, (err, img) => {
        if (err) return err;
        // validate
        if (logo.bitmap.height < config.logo_size[this.orientation]) {
          return Error("Sorry, the logo is not large enough");
        }
        img.resize(config.logo_size[this.orientation], Jimp.AUTO);
        const position = this.getPositions(img, options.heightOffset);
        this.jimp.composite(
          img,
          position[options.placement].x,
          position[options.placement]         .y,
          { mode: Jimp.BLEND_DESTINATION_OVER },
          brandedImage => {
            this.jimp = brandedImage;
          }
        );
      });
    });
  }

  finalize() {
    return new Promise((rej, res) => {
      const filepath = path.join(
        __dirname,
        "temp",
        "processed",
        `${this.filename}_ processed ${this.extension}`
      );
      this.jimp.writeAsync(filepath).then(res(filepath));
    });
  }
}
module.exports = InstagramImage;
