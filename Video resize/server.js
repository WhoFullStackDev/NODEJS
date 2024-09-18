const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegStatic);

ffmpeg()
  .input("video.mp4")
  // .outputOptions("-ab", "192k")

  // // Output file
  // .saveToFile("audio.mp3")
  // .outputOptions("-vf", "scale=-2:720")

  // // Output file
  // .saveToFile("video-720p.mp4")
  // .outputOptions("-vf", "scale=-2:480")

  // // Output file
  // .saveToFile("video-480p.mp4")

  // .outputOptions("-vf", "scale=-2:360")

  // // Output file
  // .saveToFile("video-360p.mp4")
  // .outputOptions("-vf", "scale=-2:144")

  // // Output file
  // .saveToFile("video-144p.mp4")

  // .noAudio()

  // // // Copy the video without re-encoding
  // .outputOptions("-codec", "copy")

  // // Output file
  // .saveToFile("video-noAudio.mp4")
  // .saveToFile("frame-%03d.png")
  .input("frame-%03d.png")

  // Tell FFmpeg to import the frames at 10 fps
  .inputOptions("-framerate", "10")

  // Use the x264 video codec
  .videoCodec("libx264")

  // Use YUV color space with 4:2:0 chroma subsampling for maximum compatibility with
  // video players
  .outputOptions("-pix_fmt", "yuv420p")

  // Output file
  .saveToFile("videoFromFrame.mp4")
  .on("progress", (progress) => {
    if (progress.percent) {
      console.log(`Processing: ${Math.floor(progress.percent)}% done`);
    }
  })

  // The callback that is run when FFmpeg is finished
  .on("end", () => {
    console.log("FFmpeg has finished.");
  })

  // The callback that is run when FFmpeg encountered an error
  .on("error", (error) => {
    console.error(error);
  });
