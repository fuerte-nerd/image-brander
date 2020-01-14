const createZipFile = require('./createZipFile')
const path = require('path')

module.exports = (filePath, files) =>{
    return new Promise((res,rej)=>{
        createZipFile(filePath).then(()=>{
            var filesProcessed = 0;
    
            for(let file in files){
                files[file].mv(
                    path.join(filePath, files[file].name),
                    err => {
                        if(err){ rej(err) }
                        const images = {
                            logo: 
                        }
                        
                    }
                )
            }
        })

    })
    
      for (let file in req.files.file) {
        req.files.file[file].mv(
          path.join(filePath, req.files.file[file].name),
          err => {
            if (err) {
              console.error(err);
              return res.status(400).json({ msg: err });
            } else {
              const images = {
                logo: path.join(filePath, req.files.logo.name),
                image: path.join(filePath, req.files.file[file].name)
              };
              const orientation = getImageOrientation(images.image);
              checkDimensions(images, orientation)
                .then(() => {
                  processImage(images, orientation, {
                    title: req.body.title,
                    titleBgColor: req.body.titleBgColor,
                    titleTextColor: req.body.titleTextColor
                  }).then(a => {
                    archive.file(path.join(filePath, a.filename), {
                      name: a.filename
                    });
                    if (filesProcessed + 1 === req.files.file.length) {
                      archive.finalize().then(() => {
                        return res.status(200).json({
                          msg: "Complete!",
                          link: "instagram_image_brander.zip"
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
}