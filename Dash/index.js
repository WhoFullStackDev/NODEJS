// const ffmpegStatic = require("ffmpeg-static");
// const ffmpeg = require("fluent-ffmpeg");

// ffmpeg.setFfmpegPath(ffmpegStatic);

// const inputPath = "input.mp4";
// const outputPath = "output_dash/output.mpd";
// const scaleOptions = ["scale=1280:720", "scale=640:320"];
// const videoCodec = "libx264";
// const x264Options = "keyint=24:min-keyint=24:no-scenecut";
// const videoBitrates = ["1000k", "2000k", "4000k"];

// ffmpeg()
//   .input(inputPath)
//   .videoFilters(scaleOptions)
//   .videoCodec(videoCodec)
//   .addOption("-x264opts", x264Options)
//   .outputOptions("-b:v", videoBitrates[0])
//   .format("dash")
//   .output(outputPath)
//   .on("end", () => {
//     console.log("DASH encoding complete.");
//   })
//   .on("error", (err) => {
//     console.error("Error:", err.message);
//   })
//   .run();

const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Serve static files from 'output_dash' directory
app.use("/output_dash", express.static(path.join(__dirname, "output_dash")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
