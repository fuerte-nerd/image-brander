module.exports = filePath => {
  return new Promise((res, rej) => {
    var output = fs.createWriteStream(
      path.join(filePath, "/instagram_image_brander.zip")
    );
    var archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(output);
    res(archive)
  });
};
