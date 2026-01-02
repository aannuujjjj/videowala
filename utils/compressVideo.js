const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const compressVideo = (relativeInputPath) => {
  return new Promise((resolve, reject) => {
    // Convert to absolute paths (CRITICAL FIX)
    const absoluteInputPath = path.join(process.cwd(), relativeInputPath);

    const relativeOutputPath = relativeInputPath.replace(
      path.extname(relativeInputPath),
      '-compressed.mp4'
    );

    const absoluteOutputPath = path.join(process.cwd(), relativeOutputPath);

    const command = `
      ./bin/ffmpeg -i "${absoluteInputPath}"
      -vf "scale='min(1280,iw)':-2"
      -b:v 800k
      -preset veryfast
      -y "${absoluteOutputPath}"
    `;

    exec(command, (error) => {
      if (error) {
        console.error('FFmpeg error:', error);
        return reject(error);
      }

      // HARD DELETE original
      fs.unlinkSync(absoluteInputPath);

      resolve(relativeOutputPath); // store RELATIVE path in DB
    });
  });
};

module.exports = compressVideo;
