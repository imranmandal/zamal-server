const upload = require("../middleware/upload");
const express = require("express");
const router = express.Router();

router.post("/add-project", upload.single("file"), (req, res) => {
  if (req.file === undefined) return res.send("you must select a file.");
  const imgUrl = `http://localhost:8080/file/${req.file.fieldname}`;
  return res.send(imgUrl);
});

module.exports = router;
