const path = require("path");

module.exports = (logo, filePath) => {
  return new Promise((res, rej) => {
    logo.mv(path.join(filePath, logo.name), err => {
      if (err) {
        console.error(err);
        rej(err)
        // return res.status(400).json({ msg: err });
      }
      res()
    });
  });
};
