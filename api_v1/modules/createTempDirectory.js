module.exports = (filePath) => {
  if (fs.existsSync(filePath)) {
    const tempDir = fs.readdirSync(filePath);
    tempDir.map(file => {
      fs.unlinkSync(filePath + "/" + file);
    });
    fs.rmdirSync(filePath);
  }
  fs.mkdirSync(filePath);
};
