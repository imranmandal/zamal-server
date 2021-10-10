require("dotenv").config();
const upload = require("./middleware/upload");
const Grid = require("gridfs-stream");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

let gfs;

const port = 5000;
const uri = process.env.ATLAS_URI;

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection("photos");
  console.log("connetion established.");
});

const gallerySchema = new mongoose.Schema({
  imgUrl: String,
  isFavourite: Boolean,
  workTitle: String,
  description: String,
});

const Gallery = new mongoose.model("Gallery", gallerySchema);

const newProjectSchema = new mongoose.Schema({
  title: String,
  createdOn: Date,
  description: String,
  siteImages: Array,
  siteImageUrls: Array,
});

const Project = new mongoose.model("Project", newProjectSchema);

app.get("/", (req, res) => {
  //   const galleryItem = new Gallery({
  //     imgUrl:
  //       "https://th.bing.com/th/id/R.f1d315c12d048ce30be850d51848aa65?rik=6%2bKJMSPETeXP%2fQ&riu=http%3a%2f%2fww1.prweb.com%2fprfiles%2f2013%2f06%2f19%2f10848398%2fportland-interior-design-condo.jpg&ehk=K4rd%2baU2KQyWFPR%2fY%2frv%2fK7VBTZ%2frppw8Q9JNJFkQJw%3d&risl=&pid=ImgRaw&r=0",
  //     isFavourite: true,
  //     workTitle: "Hall Room",
  //     description: "Hall room table, roof",
  //   });

  //   galleryItem.save((err) =>
  //     err ? console.log(err) : console.log("inserted succesfully")
  //   );

  res.send("hello from the server");
});

// app.get("/uploads/:imgName", (req, res) => {
//   console.log(req.params.imgName, __dirname);
//   res.send(`${__dirname}/uploads/${req.params.imgName}`);
// });

app.get("/gallery", (req, res) => {
  Gallery.find({}, (err, data) => {
    err ? res.send(err) : res.send(data);
  });
});

app.get("/recent-projects", (req, res) => {
  Project.find({}, (err, data) => {
    err ? res.sendStatus(400).send(err) : res.send(data);
  }).limit(3);
});

app.post("/add-project", upload.array("siteImages", 10), (req, res) => {
  console.log(req.files);
  if (req.files.length === 0) return res.send("you must select a file.");
  const files = req.files;
  const { title, createdOn, description } = req.body;

  const newProject = new Project({
    title,
    createdOn,
    description,
    siteImages: files,
    siteImageUrls: files.map((file) => {
      return `${process.env.DOMAIN}/uploads/${file.originalname}`;
    }),
  });
  console.log(files[0]);

  newProject.save((err) =>
    err ? console.log(err) : console.log("inserted succesfully")
  );

  return res.send({ files });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
