const express = require("express");
const app = express();

const cors = require("cors");
const fileUpload = require("express-fileupload");

const uploadFiles = require("./modules/uploadFiles");
const createJimps = require("./modules/createJimps");
const validateImages = require("./modules/validateImages");
const processImages = require("./modules/processImages");

app.use(cors());
app.use(fileUpload());

app.post("/upload", (req, res) => {
  uploadFiles(req)
    .then(createJimps)
    .then(validateImages)
    .then(processImages)
    // .then(packageDownload)
    .then(data => {
      console.log("reached end");
      console.log(data)
      res.status(200).json({ success: true, msg: "success!!!!" });
    })
    .catch(err => {
      console.log("reached error");
      console.log(err);

      res.status(400).json({ success: false, err: err });
    });
});

app.listen(5000, () => {
  console.log("App listening on port 5000");
});
