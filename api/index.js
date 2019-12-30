const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());
const port = 5000;

app.post("/upload", (req, res) => {
  // make sure there is something in the title field
  if (req.body.title === "") {
    res.status(400).json({ msg: "Please provide a title" });
  } else {
    if (req.files.file.length > 1) {
      for (let file in req.files.file) {
        req.files.file[file].mv(
          `${__dirname}/uploads/${req.files.file[file].name}`,
          err => {
            if (err) {
              console.error(err);
              res.status(400).json({ msg: err });
            } else {
              res.status(200).json({ msg: "Successfully uploaded files!" });
            }
          }
        );
      }
    } else {
      req.files.file.mv(`${__dirname}/uploads/${req.files.file.name}`, err => {
        if (err) {
          console.error(err);
          res.status(400).json({ msg: "there was an error" });
        } else {
          res.status(200).json({ msg: "Successfully uploaded!" });
        }
      });
    }
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
