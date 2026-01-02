const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const compressVideo = (relativeInputPath) => {
  return new Promise((resolve, reject) => {
    const rootDir = process.cwd(); // Azure-safe root

    const ffmpegPath = path.join(rootDir, 'bin', 'ffmpeg');

    const absoluteInputPath = path.join(rootDir, relativeInputPath);

    const relativeOutputPath = relativeInputPath.replace(
      path.extname(relativeInputPath),
      '-compressed.mp4'
    );

    const absoluteOutputPath = path.join(rootDir, relativeOutputPath);

    const command = `"${ffmpegPath}" -i "${absoluteInputPath}" -vf "scale='min(1280,iw)':-2" -b:v 800k -preset veryfast -y "${absoluteOutputPath}"`;

    exec(command, (error) => {
      if (error) {
        console.error('FFmpeg error:', error);
        return reject(error);
      }

      // HARD delete original file
      fs.unlinkSync(absoluteInputPath);

      resolve(relativeOutputPath); // store relative path in DB
    });
  });
};

module.exports = compressVideo;
