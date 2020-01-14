const path = require("path");
const fs = require("fs");

class ImageUploader {
  constructor(files, tempPath) {
    this.images = files.images;
    this.logo = files.logo;
    this.dirname = tempPath;
    this.path = path.join(__dirname, this.dirname);
    this.files;
    this.init();
  }

  init() {
    if (fs.existsSync(this.path)) {
      fs.readdirSync(this.path).map(i => {
        fs.unlinkSync(path.join(this.path, i));
      });
      fs.rmdirSync(this.path);
    }
    fs.mkdirSync(this.path);

    this.files = [
      ...this.makeFileArray(this.images),
      ...this.makeFileArray(this.logo)
    ];
  }

  makeFileArray(a) {
    const files = [];
    a.constructor !== Array
      ? a.map(i => {
          files.push(i);
        })
      : files.push(a);
    return files;
  }

  moveFile(file) {
    return file.mv(path.join(this.path, file.name));
  }

  async upload() {
    // return new Promise(async (res, rej) => {
    // const processed = 0;
    for (let file of this.files) {
      await moveFile(file);
    }
    // this.files.map(file => {
    //   await file.mv(path.join(this.path, file.name)).then(err => {
    //     if (err) rej(err);
    //     processed + 1 === this.files.length
    res({
      images: this.images,
      logo: this.logo
    });

    // });
  }
}

module.exports = ImageUploader;
