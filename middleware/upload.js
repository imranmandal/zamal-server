const path = require("path");
const multer = require("multer");
// const { GridFsStorage } = require("multer-gridfs-storage");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
