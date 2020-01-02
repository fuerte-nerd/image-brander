const express = require("express");
const fs = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");
const archiver = require("archiver");
const cors = require("cors");
const app = express();
const getImageOrientation = require("./modules/getImageOrientation");
const checkDimensions = require("./modules/checkDimensions");
const processImage = require("./modules/processImage");

app.use(cors());
app.use(express.json());
app.use(fileUpload());
const port = 5000;
const filePath = path.join(__dirname, "temp");

app.get("/download/:file", (req, res) => {
  res.download(path.join(filePath, req.params.file));
});

app.post("/upload", (req, res) => {
  if (fs.existsSync(filePath)) {
    const tempDir = fs.readdirSync(filePath);
    tempDir.map(file => {
      fs.unlinkSync(filePath + "/" + file);
    });
    fs.rmdirSync(filePath);
  }

  fs.mkdirSync(filePath);

  if (req.files.logo) {
    req.files.logo.mv(`${filePath}/${req.files.logo.name}`, err => {
      if (err) {
        console.error(err);
        return res.status(400).json({ msg: err });
      }
    });
  }

  if (req.files.file.length > 1) {
    var output = fs.createWriteStream(filePath + "/instagram_brander.zip");
    var archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(output);
    var filesProcessed = 0;
    for (let file in req.files.file) {
      req.files.file[file].mv(
        `${filePath}/${req.files.file[file].name}`,
        err => {
          if (err) {
            console.error(err);
            return res.status(400).json({ msg: err });
          } else {
            const images = {
              logo: `${filePath}/${req.files.logo.name}`,
              image: `${filePath}/${req.files.file[file].name}`
            };
            const orientation = getImageOrientation(images.image);
            checkDimensions(images, orientation)
              .then(() => {
                processImage(images, orientation, {
                  title: req.body.title,
                  titleBgColor: req.body.titleBgColor,
                  titleTextColor: req.body.titleTextColor
                }).then(() => {
                  archive.file(filePath + "/" + req.files.file[file].name, {
                    name: req.files.file[file].name
                  });
                  console.log(`FILES PROCESSED: ${filesProcessed}`);
                  console.log(`REQ.FILES: ${req.files.file.length}`);
                  if (filesProcessed + 1 === req.files.file.length) {
                    console.log("endgame reached");
                    archive.finalize().then(() => {
                      console.log("finalized!");
                      return res.status(200).json({
                        msg: "Complete!",
                        link: "instagram_brander.zip"
                      });
                    });
                  } else {
                    filesProcessed++;
                  }
                });
              })
              .catch(err => {
                return res.status(400).json({ msg: err });
              });
          }
        }
      );
    }
  } else {
    req.files.file.mv(`${filePath}/${req.files.file.name}`, err => {
      if (err) {
        console.error(err);
        return res.status(400).json({ msg: "there was an error" });
      } else {
        const images = {
          logo: `${filePath}/${req.files.logo.name}`,
          image: `${filePath}/${req.files.file.name}`
        };
        const orientation = getImageOrientation(images.image);
        checkDimensions(images, orientation)
          .then(() => {
            processImage(images, orientation, {
              title: req.body.title,
              titleBgColor: req.body.titleBgColor,
              titleTextColor: req.body.titleTextColor
            }).then(() => {
              return res.status(200).json({
                msg: "Successfully uploaded!",
                link: req.files.file.name
              });
            });
          })
          .catch(err => {
            return res.status(400).json({ msg: err });
          });
      }
    });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
