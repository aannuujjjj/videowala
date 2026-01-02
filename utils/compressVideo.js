const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const compressVideo = (inputPath) => {
  return new Promise((resolve, reject) => {
    const rootDir = process.cwd();

    // If multer already gave absolute path, use it directly
    const absoluteInputPath = path.isAbsolute(inputPath)
      ? inputPath
      : path.join(rootDir, inputPath);

    // Build output path (relative + absolute)
    const relativeOutputPath = inputPath.replace(
      path.extname(inputPath),
      '-compressed.mp4'
    );

    const absoluteOutputPath = path.isAbsolute(relativeOutputPath)
      ? relativeOutputPath
      : path.join(rootDir, relativeOutputPath);

    const ffmpegPath = path.join(rootDir, 'bin', 'ffmpeg');

    const command = `"${ffmpegPath}" -i "${absoluteInputPath}" -vf "scale='min(1280,iw)':-2" -b:v 800k -preset veryfast -y "${absoluteOutputPath}"`;

    exec(command, (error) => {
      if (error) {
        console.error('FFmpeg error:', error);
        return reject(error);
      }

      // HARD delete original
      fs.unlinkSync(absoluteInputPath);

      // Always store RELATIVE path in DB
      const cleanRelativePath = relativeOutputPath.startsWith(rootDir)
        ? relativeOutputPath.replace(rootDir + '/', '')
        : relativeOutputPath;

      resolve(cleanRelativePath);
    });
  });
};

module.exports = compressVideo;
