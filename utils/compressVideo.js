const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const compressVideo = (inputPath) => {
  return new Promise((resolve, reject) => {
    const rootDir = process.cwd();

    const absoluteInputPath = path.isAbsolute(inputPath)
      ? inputPath
      : path.join(rootDir, inputPath);

    const relativeOutputPath = inputPath.replace(
      path.extname(inputPath),
      '-compressed.mp4'
    );

    const absoluteOutputPath = path.isAbsolute(relativeOutputPath)
      ? relativeOutputPath
      : path.join(rootDir, relativeOutputPath);

    // ✅ Use system ffmpeg (installed via winget)
    const command = `ffmpeg -i "${absoluteInputPath}" -vf "scale='min(1280,iw)':-2" -b:v 800k -preset veryfast -y "${absoluteOutputPath}"`;

    exec(command, (error) => {
      if (error) {
        console.error('FFmpeg error:', error);
        return reject(error);
      }

      // Delete original video after compression
      fs.unlinkSync(absoluteInputPath);

      const cleanRelativePath = relativeOutputPath.startsWith(rootDir)
        ? relativeOutputPath.replace(rootDir + path.sep, '')
        : relativeOutputPath;

      resolve(cleanRelativePath);
    });
  });
};

module.exports = compressVideo;
