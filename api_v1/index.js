const express = require("express");
// const fs = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");
// const archiver = require("archiver");
const cors = require("cors");
const app = express();

const ImageUploader = require("./ImageUploader");
const InstagramImage = require("./InstagramImage");
const Zipper = require("./Zipper");

const createTempDirectory = require("./modules/createTempDirectory");
const uploadLogo = require("./modules/uploadLogo");
const uploadMultiple = require("./modules/uploadMultiple");
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
  //upload
  const uploader = ImageUploader(
    {
      images: req.files.images,
      logo: req.files.logo
    },
    "temp"
  );

  uploader.upload().then(data => {
    let processed = 0;
    for (let img in data.images) {
      const image = new InstagramImage(img);
      image
        .validate()
        .then(image.scale())
        .then(image.addLogo(data.logo, { placement: req.body.logo_placement }))
        .then(() => {
          if (req.body.caption) {
            image
              .addCaption(req.body.caption, {
                font: "default", // should eventually be chosen in dropdown menu
                placement: req.body.caption_placement,
                offset: req.body.caption_offset
              })
              .then(
                image.finalize().then(filepath => {
                  processed++;
                  if (
                    data.images.length > 1 &&
                    processed === data.images.length
                  ) {
                    const zip = new Zipper();
                    zip.zip().then(zippath => {
                      return res.status(200).json({
                        download: zippath,
                        msg:
                          "File(s) succesfully processed.  Preparing download."
                      });
                    });
                  } else if (data.images.length === 1) {
                    return res.status(200).json({
                      download: filepath,
                      msg: "File(s) succesfully processed.  Preparing download."
                    });
                  }
                })
              );
          }
        })
        // .catch(err => res.status(400).json({ err: err }))  I dont think this is needed!
        .catch(err => res.status(400).json({ err: err }));
    }
  });
});

app.post("/upload", (req, res) => {
  createTempDirectory(filePath);

  if (req.files.logo) {
    uploadLogo(req.files.logo, filePath)
      .then(() => {
        req.files.file.length > 1 ? uploadMultiple() : uploadSingle();
      })
      .catch(err => {
        return res.status(400).json({ msg: err });
      });
  }

  if (req.files.file.length > 1) {
    uploadMultiple(filePath);
  } else {
    req.files.file.mv(path.join(filePath, req.files.file.name), err => {
      if (err) {
        console.error(err);
        return res.status(400).json({ msg: "there was an error" });
      } else {
        const image = new InstagramImage();
        image
          .validate()
          .then(() => {
            if (err) {
              return;
            }
          })
          .catch(err => res.status(400).json({ msg: err }));
        // const images = {
        //   logo: path.join(filePath, req.files.logo.name),
        //   image: path.join(filePath, req.files.file.name)
        // };
        // const orientation = getImageOrientation(images.image);
        // checkDimensions(images, orientation)
        //   .then(() => {
        //     processImage(images, orientation, {
        //       title: req.body.title,
        //       titleBgColor: req.body.titleBgColor,
        //       titleTextColor: req.body.titleTextColor
        //     }).then(a => {
        //       return res.status(200).json({
        //         msg: "Successfully uploaded!",
        //         link: a.filename
        //       });
        //     });
        //   })
        //   .catch(err => {
        //     return res.status(400).json({ msg: err });
        //   });
      }
    });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
