const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  try {
    const filePath = path.join(__dirname, "SampleVideo_1280x720_1mb.mp4");
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("_");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[0], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, head);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

app.listen(3000, () => {
  console.log("Server start on http://localhost:3000");
});
