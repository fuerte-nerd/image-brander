const fs = require("fs");
const rimraf = require("rimraf");
const path = require("path");
const Jimp = require("jimp");
const l = require("./logger");

module.exports = {
  upload(files) {
    return new Promise(async (res, rej) => {
      l("Creating image array...", "yellow");
      const fileArr = [];
      files.file.constructor === Array
        ? files.file.map(i => {
            fileArr.push(i);
          })
        : fileArr.push(files.file);

      l("Image array created", "green");

      const createDirs = dirs => {
        for (let dir of dirs) {
          fs.mkdirSync(dir);
        }
      };

      l("Creating temp directories...", "yellow");
      const tempPath = path.join(__dirname, "temp");

      if (fs.existsSync(tempPath)) {
        rimraf.sync(tempPath);
      }
      createDirs([
        tempPath,
        path.join(tempPath, "unprocessed"),
        path.join(tempPath, "logo"),
        path.join(tempPath, "processed")
      ]);
      l("Temp directories created", "green");

      const moveFile = (file, subdir) => {
        return file.mv(path.join(tempPath, subdir, file.name)).then(err => {
          if (err) rej({ success: false, err: err });
        });
      };

      l("Uploading image(s)...", "yellow");
      for (let file of fileArr) {
        await moveFile(file, "unprocessed");
        l(`Successfully uploaded ${file.name}`, "green");
      }
      l("Image(s) uploaded", "green");

      l("Uploading logo...", "yellow");
      await moveFile(files.logo, "logo");
      l("Logo uploaded", "green");
      l("Processing...", "yellow");
      res({ success: true, data: null });
    });
  },

  processImages(data, files) {
    return new Promise(async (res, rej) => {
      const imgDir = fs.readdirSync(
        path.join(__dirname, "temp", "unprocessed")
      );
      l("Creating Jimps array...", "yellow");
      const jimps = [];

      const createJimp = file => {
        return Jimp.read(path.join(__dirname, "temp", "unprocessed", file));
      };

      for (let file of imgDir) {
        await createJimp(file).then(jimp => {
          jimps.push({
            filename: file,
            jimp
          });
        });
      }
      l("Jimps array created", "green");

      l("Processing image(s)...", "yellow");

      const getOrientation = jimp => {
        if (jimp.bitmap.height > jimp.bitmap.width) {
          return "portrait";
        } else if (jimp.bitmap.width > jimp.bitmap.height) {
          return "landscape";
        } else {
          return "square";
        }
      };

      const scaleImage = jimp => {
        const orientation = getOrientation(jimp);
        switch (orientation) {
          case "portrait":
            return jimp.cover(1080, 1350);
          case "landscape":
            return jimp.cover(1080, 608);
          case "square":
            return jimp.cover(1200, 1200);
        }
      };

      const getPositions = (jimp, addOnJimp, heightOffset = 0) => {
        const orientation = getOrientation(jimp);
        const padding = {
          portrait: 20,
          landscape: 10,
          square: 20
        };

        return {
          top_left: {
            x: padding[orientation],
            y: padding[orientation] + heightOffset
          },
          top_center: {
            x: jimp.bitmap.width / 2 - addOnJimp.bitmap.width / 2,
            y: padding[orientation] + heightOffset
          },
          top_right: {
            x:
              jimp.bitmap.width - padding[orientation] - addOnJimp.bitmap.width,
            y: padding[orientation] + heightOffset
          },
          center_left: {
            x: padding[orientation],
            y:
              jimp.bitmap.height / 2 -
              addOnJimp.bitmap.height / 2 +
              heightOffset
          },
          center: {
            x: jimp.bitmap.width / 2 - addOnJimp.bitmap.width / 2,
            y:
              jimp.bitmap.height / 2 -
              addOnJimp.bitmap.height / 2 +
              heightOffset
          },
          center_right: {
            x:
              jimp.bitmap.width - padding[orientation] - addOnJimp.bitmap.width,
            y: jimp.bitmap.height / 2 - addOnJimp.bitmap.height / 2
          },
          bottom_left: {
            x: padding[orientation],
            y:
              jimp.bitmap.height -
              addOnJimp.bitmap.height -
              padding[orientation] -
              heightOffset
          },
          bottom_center: {
            x: jimp.bitmap.width / 2 - addOnJimp.bitmap.width / 2,
            y:
              jimp.bitmap.height -
              addOnJimp.bitmap.height -
              padding[orientation] -
              heightOffset
          },
          bottom_right: {
            x:
              jimp.bitmap.width - addOnJimp.bitmap.width - padding[orientation],
            y:
              jimp.bitmap.height -
              addOnJimp.bitmap.height -
              padding[orientation] -
              heightOffset
          }
        };
      };

      const readJimp = (path)=>{
        return Jimp.read
      }

      const addLogo = (jimps, logo) => {
        return new Promise(async (res, rej) => {
        const offset = data.title ? 60 : 0;
        const logoFilename = fs.readdirSync(
          path.join(__dirname, "temp", "logo")
        )[0];
        Jimp.read(
          path.join(__dirname, "temp", "logo", logoFilename),
          (err, imgLogo) => {
            // const logoSizes = {
            //   portrait: 175,
            //   landscape: 100,
            //   square: 175
            // };

            // for (let jimp of jimps) {
            //   const orientation = getOrientation(jimp.jimp);
            //   imgLogo.resize(
            //     logoSizes[orientation],
            //     Jimp.AUTO,
            //     (err, resizedLogo) => {
            //       l(`Adding logo to ${jimp.filename}...`, "yellow");
            //       const position = getPositions(jimp.jimp, imgLogo);
            //      jimp.jimp.composite(
            //         resizedLogo,
            //         position.bottom_right.x,
            //         position.bottom_right.y,
            //         { mode: Jimp.BLEND_DESTINATION_OVER }
            //       , (err, img)=>{
            //         jimp.jimp = img
            //         res()
            //       });
            //       console.log(position);
                }
              );

              // const positioning = {
              //   x: getPositions(jimp, imgLogo, offset)[data.position].x,
              //   y: getPositions(jimp, imgLogo, offset)[data.position].y
              // }
              // jimp.composite(imgLogo, positioning.x, positioning.y);
            }
            // res();
          }
        );
        });
      };

      const addTitle = (jimp, title) => {};

      const writeImage = jimp => {
        console.log(jimp)
        return jimp.jimp.write(
          path.join(__dirname, "temp", "processed", jimp.filename)
        );
      };

      for (let jimp of jimps) {
        l(`Scaling ${jimp.filename}...`, "yellow");
        await scaleImage(jimp.jimp);
        l(`${jimp.filename} scaled`, "green");
      }

      l("Adding logo to images...", "yellow");
       const finalJimps = await addLogo(jimps, files.logo);
      l(`Logo added to images`, "green");
      // if (data.title) {
      //   l(`Adding text to ${jimp.filename}...`, "yellow");
      //   await addTitle(file, data.title);
      //   l(`Text added to ${jimp.filename}`, "green");
      // }

      for (let jimp of jimps) {
        l(`Writing ${jimp.filename}...`, "yellow");
        await writeImage(jimp);
        l(`${jimp.filename} written`, "green");
      }

      l("Images processed", "green");
      l("finished", "red");
    });
  }
};
